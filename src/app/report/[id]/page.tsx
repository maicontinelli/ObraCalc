'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { DEFAULT_BOQ_CATEGORIES } from '@/lib/constants';
import { QRCodeSVG } from 'qrcode.react';
import { Share2, ArrowLeft, ExternalLink, Building2, Phone, Hammer, User } from 'lucide-react';


import Link from 'next/link';

// Fallback mock data loader
const loadMockEstimate = (id: string) => {
    return {
        id,
        title: 'Reforma Apartamento 101',
        client: 'João Silva',
        date: new Date().toISOString(),
        items: DEFAULT_BOQ_CATEGORIES.flatMap(c => c.items.map(i => ({ ...i, category: c.name, included: true }))),
        bdi: 20,
        aiRequests: []
    };
};

export default function ReportPage({ params }: { params: Promise<{ id: string }> }) {
    const [id, setId] = useState<string>('');
    const [data, setData] = useState<any>(null);
    const [url, setUrl] = useState('');

    // Company information states
    const [companyName, setCompanyName] = useState('');
    const [companyPhone, setCompanyPhone] = useState('');
    const [companyEmail, setCompanyEmail] = useState('');

    // Editable Project Title
    const [editableTitle, setEditableTitle] = useState('');

    // Load company info from localStorage
    useEffect(() => {
        const savedCompanyInfo = localStorage.getItem('company_info');
        if (savedCompanyInfo) {
            try {
                const parsed = JSON.parse(savedCompanyInfo);
                setCompanyName(parsed.name || '');
                setCompanyPhone(parsed.phone || '');
                setCompanyEmail(parsed.email || '');
            } catch (e) {
                console.error('Error loading company info:', e);
            }
        }
    }, []);

    // Save company info to localStorage whenever it changes
    useEffect(() => {
        if (companyName || companyPhone || companyEmail) {
            const companyInfo = {
                name: companyName,
                phone: companyPhone,
                email: companyEmail
            };
            localStorage.setItem('company_info', JSON.stringify(companyInfo));
        }
    }, [companyName, companyPhone, companyEmail]);

    useEffect(() => {
        params.then(async (p) => {
            setId(p.id);
            setUrl(`${window.location.origin}/report/${p.id}`);

            try {
                // 1. Try Supabase
                const { data: orcamento, error } = await supabase
                    .from('orcamento')
                    .select('*, items:orcamento_item(*)')
                    .eq('id', p.id)
                    .single();

                if (orcamento && !error) {
                    // Map Supabase data to local format
                    const mappedItems = orcamento.items.map((item: any) => ({
                        id: item.id,
                        category: item.categoria,
                        name: item.nome,
                        unit: item.unidade,
                        quantity: item.quantidade,
                        price: item.valor_medio,
                        manualPrice: item.valor_manual,
                        included: item.incluir,
                        aiRequestId: item.ai_request_id // Assuming we might add this to DB later
                    }));

                    setData({
                        id: orcamento.id,
                        title: orcamento.titulo,
                        client: orcamento.cliente,
                        date: orcamento.data_atualizacao || orcamento.data_criacao,
                        items: mappedItems,
                        bdi: orcamento.bdi_percent,
                        aiRequests: orcamento.ai_requests || [] // Assuming JSONB or similar
                    });
                    return;
                }
            } catch (err) {
                console.error('Error fetching from Supabase:', err);
            }

            // 2. Fallback to localStorage
            const savedData = localStorage.getItem(`estimate_${p.id}`);
            if (savedData) {
                try {
                    const parsed = JSON.parse(savedData);
                    setData(parsed);
                } catch (e) {
                    console.error('Error parsing saved estimate:', e);
                    setData(loadMockEstimate(p.id));
                }
            } else {
                // 3. Fallback to Mock
                setData(loadMockEstimate(p.id));
            }
        });
    }, [params]);

    // Update editable title when data is loaded
    useEffect(() => {
        if (data?.title) {
            setEditableTitle(data.title);
        }
    }, [data]);

    if (!data) return <div className="p-8 text-center">Carregando relatório...</div>;

    // Calculate totals
    let subtotal = 0;
    const categoryTotals: Record<string, number> = {};

    data.items.forEach((item: any) => {
        if (item.included) {
            const price = item.manualPrice !== undefined && item.manualPrice !== null ? item.manualPrice : item.price;
            const total = price * (item.quantity || 0);
            subtotal += total;
            if (!categoryTotals[item.category]) categoryTotals[item.category] = 0;
            categoryTotals[item.category] += total;
        }
    });

    const bdiValue = subtotal * (data.bdi / 100);
    const total = subtotal + bdiValue;

    // Group items by AI Request
    const baseItems = data.items.filter((i: any) => !i.aiRequestId && i.included);
    const aiGroups = (data.aiRequests || []).map((req: any) => ({
        ...req,
        items: data.items.filter((i: any) => i.aiRequestId === req.id && i.included)
    })).filter((group: any) => group.items.length > 0);

    // Helper to render a table of items
    const renderItemTable = (items: any[]) => {
        // Group by category within this section
        const localCategories: Record<string, any[]> = {};
        items.forEach(item => {
            if (!localCategories[item.category]) localCategories[item.category] = [];
            localCategories[item.category].push(item);
        });

        return (
            <div className="space-y-4">
                {Object.entries(localCategories).map(([category, catItems]) => {
                    const catTotal = catItems.reduce((acc, item) => {
                        const price = item.manualPrice ?? item.price;
                        return acc + (price * item.quantity);
                    }, 0);

                    return (
                        <div key={category}>
                            <div className="flex justify-between items-center bg-gray-50 px-3 py-1.5 border-b border-gray-200 mb-1">
                                <h3 className="font-bold text-gray-800 text-sm">{category}</h3>
                                <span className="font-semibold text-sm">{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(catTotal)}</span>
                            </div>
                            <table className="w-full text-xs">
                                <thead>
                                    <tr className="text-left text-gray-500 border-b border-gray-100">
                                        <th className="pb-1 font-medium w-1/2">Serviço</th>
                                        <th className="pb-1 font-medium text-center">Unid.</th>
                                        <th className="pb-1 font-medium text-center">Qtd.</th>
                                        <th className="pb-1 font-medium text-right">Unit.</th>
                                        <th className="pb-1 font-medium text-right">Total</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {catItems.map((item: any) => {
                                        const price = item.manualPrice !== undefined && item.manualPrice !== null ? item.manualPrice : item.price;
                                        return (
                                            <tr key={item.id} className="border-b border-gray-50">
                                                <td className="py-1">{item.name}</td>
                                                <td className="py-1 text-center text-gray-500">{item.unit}</td>
                                                <td className="py-1 text-center">{item.quantity}</td>
                                                <td className="py-1 text-right text-gray-600">
                                                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(price)}
                                                </td>
                                                <td className="py-1 text-right font-medium">
                                                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(price * item.quantity)}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    );
                })}
            </div>
        );
    };


    const handleDownloadHtml = () => {
        // Create a self-contained HTML structure with inline styles
        const styles = `
            body { font-family: system-ui, -apple-system, sans-serif; color: #111; line-height: 1.5; max-width: 800px; margin: 0 auto; padding: 40px; }
            h1 { color: #1e3a8a; margin: 0 0 15px 0; font-size: 18px; text-align: center; text-transform: uppercase; letter-spacing: 1px; }
            .header { margin-bottom: 30px; }
            .header-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 30px; background-color: #f9fafb; padding: 20px; border-radius: 8px; border: 1px solid #e5e7eb; }
            .header-item { display: flex; flex-direction: column; gap: 4px; }
            .header-label { font-size: 10px; text-transform: uppercase; letter-spacing: 0.5px; color: #6b7280; font-weight: 600; display: flex; align-items: center; gap: 4px; }
            .header-value { font-size: 14px; color: #111827; font-weight: 500; }
            .header-icon { width: 12px; height: 12px; color: #9ca3af; }

            .category { margin-top: 30px; }
            .cat-header { background: #f8f9fa; padding: 8px 12px; font-weight: bold; font-size: 14px; border-bottom: 1px solid #ddd; display: flex; justify-content: space-between; }
            table { width: 100%; border-collapse: collapse; font-size: 12px; margin-top: 10px; }
            th { text-align: left; color: #666; font-weight: 500; padding: 8px; border-bottom: 1px solid #eee; }
            td { padding: 8px; border-bottom: 1px solid #f5f5f5; }
            .text-right { text-align: right; }
            .text-center { text-align: center; }
            .totals { margin-top: 40px; border-top: 2px solid #eee; padding-top: 20px; display: flex; justify-content: flex-end; }
            .totals-box { width: 300px; }
            .row { display: flex; justify-content: space-between; margin-bottom: 5px; }
            .total-final { font-size: 18px; font-weight: bold; color: #2563eb; border-top: 1px solid #eee; padding-top: 10px; margin-top: 10px; }
            .footer { margin-top: 60px; text-align: center; font-size: 12px; color: #666; border-top: 1px solid #eee; padding-top: 20px; }
            .professionals-container { display: flex; gap: 20px; justify-content: center; margin-top: 15px; flex-wrap: wrap; }
            .professional-card { background: #f8f9fa; border: 1px solid #e9ecef; border-radius: 8px; padding: 15px; text-align: left; flex: 1; min-width: 200px; max-width: 350px; }
            .professional-card p { margin: 3px 0; }
            .ai-section { margin-top: 40px; border-top: 2px dashed #eee; padding-top: 20px; }
            .ai-guidance { background: transparent; border-left: 2px solid #9ca3af; padding: 10px 15px; margin-bottom: 15px; font-size: 11px; color: #6b7280; white-space: pre-line; font-style: italic; }
            .ai-title { font-weight: 600; color: #6b7280; margin-bottom: 5px; display: block; font-size: 10px; text-transform: uppercase; letter-spacing: 0.5px; font-style: normal; }
        `;

        // Helper for HTML generation
        const generateTableHtml = (items: any[]) => {
            const localCategories: Record<string, any[]> = {};
            items.forEach(item => {
                if (!localCategories[item.category]) localCategories[item.category] = [];
                localCategories[item.category].push(item);
            });

            return Object.entries(localCategories).map(([category, catItems]) => {
                const catTotal = catItems.reduce((acc, item) => {
                    const price = item.manualPrice ?? item.price;
                    return acc + (price * item.quantity);
                }, 0);

                const rows = catItems.map((item: any) => {
                    const price = item.manualPrice !== undefined && item.manualPrice !== null ? item.manualPrice : item.price;
                    return `
                        <tr>
                            <td>${item.name}</td>
                            <td class="text-center">${item.unit}</td>
                            <td class="text-center">${item.quantity}</td>
                            <td class="text-right">${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(price)}</td>
                            <td class="text-right"><strong>${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(price * item.quantity)}</strong></td>
                        </tr>
                    `;
                }).join('');

                return `
                    <div class="category">
                        <div class="cat-header">
                            <span>${category}</span>
                            <span>${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(catTotal)}</span>
                        </div>
                        <table>
                            <thead>
                                <tr>
                                    <th width="50%">Serviço</th>
                                    <th class="text-center">Unid.</th>
                                    <th class="text-center">Qtd.</th>
                                    <th class="text-right">Unit.</th>
                                    <th class="text-right">Total</th>
                                </tr>
                            </thead>
                            <tbody>${rows}</tbody>
                        </table>
                    </div>
                `;
            }).join('');
        };

        const baseItemsHtml = generateTableHtml(baseItems);

        const aiGroupsHtml = aiGroups.map((group: any) => `
            <div class="ai-section">
                <div class="ai-guidance">
                    <span class="ai-title">Nota Técnica / IA</span>
                    ${group.guidance}
                </div>
                ${generateTableHtml(group.items)}
            </div>
        `).join('');

        const htmlContent = `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="utf-8">
                <title>Orçamento - ${data.title}</title>
                <style>${styles}</style>
            </head>
            <body>
                <div class="header">
                    <h1 style="margin-bottom: 20px;">Orçamento</h1>
                    
                    <div class="header-grid">
                        <div class="header-item">
                            <div class="header-label">
                                <svg class="header-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="16" height="20" x="4" y="2" rx="2" ry="2"/><path d="M9 22v-4h6v4"/><path d="M8 6h.01"/><path d="M16 6h.01"/><path d="M8 10h.01"/><path d="M16 10h.01"/><path d="M8 14h.01"/><path d="M16 14h.01"/><path d="M8 18h.01"/><path d="M16 18h.01"/></svg>
                                Prestador
                            </div>
                            <div class="header-value">${data.client}</div>
                        </div>
                        
                        <div class="header-item">
                            <div class="header-label">
                                <svg class="header-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                                Contato
                            </div>
                            <div class="header-value">${data.phone}</div>
                        </div>

                        <div class="header-item">
                            <div class="header-label">
                                <svg class="header-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 12-8.5 8.5c-.83.83-2.17.83-3 0 0 0 0 0 0 0a2.12 2.12 0 0 1 0-3L12 9"/><path d="M17.64 15 22 10.64"/><path d="m20.91 11.7-1.25-1.25c-.6-.6-.93-1.4-.93-2.25V7.86c0-.55-.45-1-1-1H16.5c-.85 0-1.65-.33-2.25-.93L13 4.71"/><path d="M16 22h6.5c.28 0 .5-.22.5-.5v-6"/></svg>
                                Serviço
                            </div>
                            <div class="header-value">${editableTitle}</div>
                        </div>

                        <div class="header-item">
                            <div class="header-label">
                                <svg class="header-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                                Cliente
                            </div>
                            <div class="header-value">${companyName || ''}</div>
                        </div>
                    </div>
                </div>

                ${baseItemsHtml}
                ${aiGroupsHtml}

                <div class="totals">
                    <div class="totals-box">
                        <div class="row">
                            <span>Subtotal</span>
                            <span>${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(subtotal)}</span>
                        </div>
                        <div class="row">
                            <span>BDI (${data.bdi}%)</span>
                            <span>${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(bdiValue)}</span>
                        </div>
                        <div class="row total-final">
                            <span>Total Geral</span>
                            <span>${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(total)}</span>
                        </div>
                    </div>
                </div>

                <div class="footer">
                    <p style="font-size: 11px; color: #6b7280; font-style: italic;">Recomendação Técnica: Este serviço pode contar com o suporte de um engenheiro ou arquiteto credenciado de sua região, garantindo a qualidade e a segurança que você precisa.</p>
                    
                    <div class="professionals-container">
                        <div class="professional-card">
                            <p><strong>Profissional Indicado:</strong> Eng. Carlos Mendes Silva</p>
                            <p><strong>Registro:</strong> CREA-SP 123456-7</p>
                            <p><strong>Contato:</strong> (11) 98765-4321</p>
                        </div>
                        <div class="professional-card">
                            <p><strong>Profissional Indicado:</strong> Arq. Ana Paula Souza</p>
                            <p><strong>Registro:</strong> CAU-SP A12345-6</p>
                            <p><strong>Contato:</strong> (11) 91234-5678</p>
                        </div>
                    </div>

                    <p style="margin-top: 20px; font-size: 10px; color: #999;"><a href="${url}">${url}</a></p>
                </div>
            </body>
            </html>
        `;

        const newWindow = window.open('', '_blank');
        if (newWindow) {
            newWindow.document.write(htmlContent);
            newWindow.document.close();
        } else {
            alert('Por favor, permita pop-ups para visualizar o relatório.');
        }
    };

    return (
        <div className="min-h-screen bg-white dark:bg-gray-900 text-black dark:text-gray-100 print:bg-white print:text-black transition-colors">
            <style jsx global>{`
                @media print {
                    @page {
                        margin: 5mm;
                        size: auto;
                    }
                    body {
                        margin: 0;
                    }
                    /* Hide browser default headers/footers if possible */
                    header, footer {
                        display: none !important;
                    }
                }
            `}</style>
            {/* Sticky Toolbar */}
            <div className="sticky top-0 z-10 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm print:hidden">
                <div className="container mx-auto py-2 flex flex-wrap sm:flex-nowrap justify-between items-center gap-4 px-4">
                    <div className="flex items-center gap-3 flex-1 w-full min-w-0 overflow-hidden">
                        <Link href={`/editor/${id}`} className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full text-gray-500 dark:text-gray-400 shrink-0">
                            <ArrowLeft size={18} />
                        </Link>
                        <div className="flex items-center gap-2 overflow-hidden w-full">
                            <span className="font-bold text-sm text-gray-900 dark:text-gray-100 truncate min-w-[100px]">
                                {data.title}
                            </span>
                            <span className="text-gray-300 dark:text-gray-600 text-sm flex-shrink-0">/</span>
                            <span className="text-sm text-gray-500 dark:text-gray-400 truncate flex-1">
                                {data.client}
                            </span>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 w-full sm:w-auto justify-end border-t sm:border-t-0 pt-2 sm:pt-0 border-gray-100 dark:border-gray-700">
                        <button onClick={handleDownloadHtml} className="btn bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 flex items-center gap-2 text-xs px-3 py-1.5 h-8">
                            <ExternalLink size={14} /> HTML
                        </button>
                        <button onClick={() => window.print()} className="btn btn-primary shadow-sm text-xs flex items-center gap-2 px-3 py-1.5 h-8">
                            <Share2 size={14} /> PDF
                        </button>
                    </div>
                </div>
            </div>

            <div className="max-w-4xl mx-auto p-4 sm:p-8 border-x border-gray-200 dark:border-gray-700 print:border-none">
                {/* Header */}
                <div className="mb-6">
                    <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 border border-gray-100 dark:border-gray-700 grid grid-cols-1 sm:grid-cols-2 gap-4 shadow-sm">
                        {/* Prestador */}
                        <div className="space-y-1">
                            <div className="flex items-center gap-1.5 text-[10px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                <Building2 size={12} className="text-gray-400" />
                                Prestador
                            </div>
                            <div className="font-medium text-gray-900 dark:text-gray-100 text-sm">
                                {data.client}
                            </div>
                        </div>

                        {/* Contato */}
                        <div className="space-y-1">
                            <div className="flex items-center gap-1.5 text-[10px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                <Phone size={12} className="text-gray-400" />
                                Contato
                            </div>
                            <div className="font-medium text-gray-900 dark:text-gray-100 text-sm">
                                {data.phone}
                            </div>
                        </div>

                        {/* Serviço */}
                        <div className="space-y-1">
                            <div className="flex items-center gap-1.5 text-[10px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                <Hammer size={12} className="text-gray-400" />
                                Serviço
                            </div>
                            <div className="relative">
                                <input
                                    type="text"
                                    value={editableTitle}
                                    onChange={(e) => setEditableTitle(e.target.value)}
                                    className="w-full bg-transparent border-b border-dashed border-gray-300 dark:border-gray-600 py-0.5 focus:outline-none focus:border-blue-500 transition-colors placeholder-gray-400 dark:placeholder-gray-500 font-medium text-gray-900 dark:text-gray-100 text-sm"
                                    placeholder="Serviço"
                                />
                            </div>
                        </div>

                        {/* Cliente */}
                        <div className="space-y-1">
                            <div className="flex items-center gap-1.5 text-[10px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                <User size={12} className="text-gray-400" />
                                Cliente
                            </div>
                            <div className="relative">
                                <input
                                    type="text"
                                    value={companyName}
                                    onChange={(e) => setCompanyName(e.target.value)}
                                    placeholder="Nome do cliente"
                                    className="w-full bg-transparent border-b border-dashed border-gray-300 dark:border-gray-600 py-0.5 focus:outline-none focus:border-blue-500 transition-colors placeholder-gray-400 font-medium text-gray-900 dark:text-gray-100 text-sm"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Title and QR Code below header */}
                    <div className="flex justify-between items-center mt-4 pb-3 border-b-2 border-blue-400 dark:border-blue-500">
                        <h1 className="text-lg font-bold text-gray-900 dark:text-white tracking-tight uppercase">Orçamento</h1>

                        {/* QR Code */}
                        <div className="flex flex-col items-center opacity-80 hover:opacity-100 transition-opacity">
                            <QRCodeSVG value={url} size={40} />
                            <span className="text-[8px] text-gray-400 mt-0.5 font-medium">Ver online</span>
                        </div>
                    </div>
                </div>

                {/* Items */}
                <div className="space-y-8">
                    {/* Base Items Section */}
                    {baseItems.length > 0 && (
                        <div>
                            {renderItemTable(baseItems)}
                        </div>
                    )}

                    {/* AI Groups Sections */}
                    {aiGroups.map((group: any) => (
                        <div key={group.id} className="border-t-2 border-dashed border-gray-200 pt-6 mt-6">
                            <div className="border-l-2 border-gray-300 dark:border-gray-600 pl-4 mb-4">
                                <span className="text-[10px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider block mb-1">
                                    Nota Técnica / IA
                                </span>
                                <p className="text-xs italic text-gray-500 dark:text-gray-400 whitespace-pre-line leading-relaxed">
                                    {group.guidance}
                                </p>
                            </div>

                            {renderItemTable(group.items)}
                        </div>
                    ))}
                </div>

                {/* Totals */}
                <div className="mt-6 pt-4 border-t-2 border-gray-200">
                    <div className="flex justify-end">
                        <div className="w-64 space-y-1 text-sm">
                            <div className="flex justify-between text-gray-600">
                                <span>Subtotal</span>
                                <span>{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(subtotal)}</span>
                            </div>
                            <div className="flex justify-between text-gray-600">
                                <span>BDI ({data.bdi}%)</span>
                                <span>{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(bdiValue)}</span>
                            </div>
                            <div className="flex justify-between text-lg font-bold text-[#00704A] dark:text-[#00a86b] pt-2 border-t border-gray-200">
                                <span>Total Geral</span>
                                <span>{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(total)}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="mt-12 pt-8 border-t border-gray-200 text-center">
                    <div className="max-w-3xl mx-auto text-sm text-gray-600 space-y-4">
                        <p className="text-xs italic text-gray-500 dark:text-gray-400">
                            Recomendação Técnica: Este serviço pode contar com o suporte de um engenheiro ou arquiteto credenciado de sua região, garantindo a qualidade e a segurança que você precisa.
                        </p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                            <div className="text-left bg-gray-50 dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                                <p className="text-xs text-gray-500 uppercase tracking-wider mb-2 font-bold">Profissional Indicado 1</p>
                                <div className="space-y-1">
                                    <p><span className="font-semibold">Nome:</span> Eng. Carlos Mendes Silva</p>
                                    <p><span className="font-semibold">Registro:</span> CREA-SP 123456-7</p>
                                    <p><span className="font-semibold">Contato:</span> (11) 98765-4321</p>
                                </div>
                            </div>
                            <div className="text-left bg-gray-50 dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                                <p className="text-xs text-gray-500 uppercase tracking-wider mb-2 font-bold">Profissional Indicado 2</p>
                                <div className="space-y-1">
                                    <p><span className="font-semibold">Nome:</span> Arq. Ana Paula Souza</p>
                                    <p><span className="font-semibold">Registro:</span> CAU-SP A12345-6</p>
                                    <p><span className="font-semibold">Contato:</span> (11) 91234-5678</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="mt-6 text-[10px] text-gray-400">
                        <p>{url}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
