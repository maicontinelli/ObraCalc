'use client';

import { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { FileText, Printer, ArrowLeft, User as UserIcon, Phone, Building2, Calendar, Sparkles, Cloud } from 'lucide-react';
import { getDddInfo } from '@/lib/ddd-data';
import { createClient } from '@/lib/supabase/client';
import { User } from '@supabase/supabase-js';

export default function ReportClient({ estimateId }: { estimateId: string }) {
    const router = useRouter();
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<User | null>(null);

    const supabase = createClient();

    useEffect(() => {
        supabase.auth.getUser().then(({ data }) => setUser(data.user));
    }, [supabase]);

    useEffect(() => {
        const loadReportData = async () => {
            // 1. Try Local Storage first (fastest for creator)
            const savedData = localStorage.getItem(`estimate_${estimateId}`);
            if (savedData) {
                try {
                    const parsed = JSON.parse(savedData);
                    setData(parsed);
                    setLoading(false);
                    return;
                } catch (e) {
                    console.error('Error parsing local data:', e);
                }
            }

            // 2. Fallback to Supabase (for Admin or shared links)
            try {
                const { data: budget, error } = await supabase
                    .from('budgets')
                    .select('content')
                    .eq('id', estimateId)
                    .single();

                if (budget && budget.content) {
                    setData(budget.content);
                } else if (error) {
                    console.error('Error fetching from Supabase:', error);
                }
            } catch (err) {
                console.error('Unexpected error loading report:', err);
            } finally {
                setLoading(false);
            }
        };

        loadReportData();
    }, [estimateId, supabase]);

    // Get DDD info for phone numbers
    const providerDddInfo = useMemo(() => data?.providerPhone ? getDddInfo(data.providerPhone) : null, [data?.providerPhone]);
    const clientDddInfo = useMemo(() => data?.clientPhone ? getDddInfo(data.clientPhone) : null, [data?.clientPhone]);

    const handlePrint = () => {
        window.print();
    };

    const handleExportHTML = () => {
        if (!data) return;

        // Calculate values for export
        const includedItems = data.items?.filter((i: any) => i.included) || [];
        const subtotal = includedItems.reduce((sum: number, item: any) => {
            const price = item.manualPrice !== undefined && item.manualPrice !== null ? item.manualPrice : item.price;
            return sum + (Number(price) * Number(item.quantity));
        }, 0);
        const bdiValue = subtotal * ((data.bdi || 20) / 100);
        const total = subtotal + bdiValue;

        // Group items by category
        const groupedItems: Record<string, any[]> = {};
        includedItems.forEach((item: any) => {
            const category = item.category || 'OUTROS';
            if (!groupedItems[category]) {
                groupedItems[category] = [];
            }
            groupedItems[category].push(item);
        });
        const categories = Object.keys(groupedItems);

        // Get DDD info
        const providerDddInfo = data.providerPhone ? getDddInfo(data.providerPhone) : null;
        const clientDddInfo = data.clientPhone ? getDddInfo(data.clientPhone) : null;

        // Generate items HTML
        const itemsHTML = categories.map(category => {
            const categoryItems = groupedItems[category];
            const categoryTotal = categoryItems.reduce((sum: number, item: any) => {
                const price = item.manualPrice ?? item.price;
                return sum + (price * item.quantity);
            }, 0);

            // Group items by type
            const groups: Record<string, any[]> = { composition: [], service: [], material: [] };
            categoryItems.forEach((item: any) => {
                let type = item.type;
                if (!type || (type !== 'service' && type !== 'material')) {
                    type = 'composition';
                }
                groups[type].push(item);
            });

            // Define display order and headers
            const orderedGroups = [
                { id: 'composition', title: 'Composições', icon: '🛠️', items: groups.composition },
                { id: 'service', title: 'Serviços', icon: '🔨', items: groups.service },
                { id: 'material', title: 'Materiais', icon: '🧱', items: groups.material }
            ].filter(g => g.items.length > 0);

            const sectionsHTML = orderedGroups.map(g => {
                const rows = g.items.map(item => {
                    const price = item.manualPrice ?? item.price;
                    const itemTotal = price * item.quantity;
                    return `
                        <div class="item-row">
                            <div class="item-name">${item.name}</div>
                            <div class="item-unit">${item.unit}</div>
                            <div class="item-qty">${item.quantity}</div>
                            <div class="item-price">${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(price)}</div>
                            <div class="item-total">${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(itemTotal)}</div>
                        </div>
                    `;
                }).join('');

                return `
                    <div class="items-header">
                        <div><span style="font-size: 14px; margin-right: 6px; vertical-align: middle;">${g.icon}</span>${g.title}</div>
                        <div style="text-align: center;">Un.</div>
                        <div style="text-align: center;">Qtd</div>
                        <div style="text-align: right;">Unit</div>
                        <div style="text-align: right;">Total</div>
                    </div>
                    ${rows}
                `;
            }).join('');

            return `
                <div class="category-section">
                    <div class="category-header">
                        <div class="category-title">${category}</div>
                        <div class="category-total">${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(categoryTotal)}</div>
                    </div>
                    ${sectionsHTML}
                </div>
            `;
        }).join('');

        const htmlContent = `
<!DOCTYPE html>
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Orçamento - ${data?.clientName || 'Relatório'}</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
            background: #f3f4f6;
            padding: 40px;
            color: #374151;
            line-height: 1.5;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
        }
        .container { 
            max-width: 1000px;
            margin: 0 auto;
            background: white;
            border-radius: 12px;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
            overflow: hidden;
        }
        
        /* Invoice Header - Compact */
        .invoice-header {
            background: #374151;
            color: white;
            padding: 24px 30px;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .brand {
            display: flex;
            align-items: center;
            gap: 12px;
        }
        .brand-logo {
            font-size: 20px;
            font-weight: 600;
            letter-spacing: -0.5px;
            line-height: 1;
        }
        .brand-subtitle {
            font-size: 10px;
            color: #9ca3af;
            font-weight: 500;
            letter-spacing: 0.5px;
            text-transform: uppercase;
            margin-top: 2px;
        }
        .invoice-title {
            text-align: right;
        }
        .invoice-title h1 {
            font-size: 24px;
            font-weight: 500;
            letter-spacing: 1px;
            text-transform: uppercase;
            margin: 0;
            color: white;
            opacity: 1;
        }
        .invoice-id {
            color: #d1d5db;
            font-size: 11px;
            letter-spacing: 0.5px;
            margin-top: 2px;
            text-transform: uppercase;
        }

        /* Info Grid - Compact */
        .info-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            border-bottom: 1px solid #e5e7eb;
        }
        .info-col {
            padding: 20px 30px;
        }
        .info-col.left {
            background: #f9fafb;
            border-right: 1px solid #e5e7eb;
        }
        .col-label {
            font-size: 10px;
            font-weight: 600;
            color: #9ca3af;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-bottom: 12px;
            display: flex;
            align-items: center;
            gap: 8px;
        }
        .info-row {
            margin-bottom: 8px;
        }
        .info-key {
            font-size: 9px;
            color: #6b7280;
            font-weight: 500;
            text-transform: uppercase;
            display: block;
            margin-bottom: 1px;
        }
        .info-val {
            font-size: 13px;
            color: #111827;
            font-weight: 400;
            line-height: 1.2;
        }

        /* Tables & Lists */
        .category-section { margin-top: 40px; padding: 0 40px; }
        .category-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 10px 0;
            border-bottom: 2px solid #e5e7eb;
            margin-bottom: 20px;
        }
        .category-title {
            font-size: 16px;
            font-weight: 800;
            color: #111827;
            text-transform: uppercase;
        }
        .category-total {
            font-size: 16px;
            font-weight: 800;
            color: #111827;
        }

        .items-header {
            display: grid;
            grid-template-columns: 4fr 1fr 1fr 1.5fr 1.5fr;
            gap: 16px;
            padding: 10px 0;
            border-bottom: 1px solid #e5e7eb;
            margin-top: 20px;
        }
        .items-header div {
            font-size: 10px;
            font-weight: 700;
            color: #6b7280;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        
        .item-row {
            display: grid;
            grid-template-columns: 4fr 1fr 1fr 1.5fr 1.5fr;
            gap: 16px;
            padding: 12px 0;
            border-bottom: 1px solid #f3f4f6;
            font-size: 12px;
            color: #374151;
        }
        .item-name { font-weight: 500; }
        .item-row div { align-self: center; }
        
        /* Footer Layout */
        .footer-wrapper {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            padding: 0 40px 40px 40px;
            gap: 20px;
            margin-top: 40px;
        }
        .footer-left {
            display: flex;
            gap: 20px;
            flex-wrap: wrap;
        }
        .footer-box {
            background: white;
            border: 1px solid #e5e7eb;
            border-radius: 8px;
            padding: 16px;
            min-width: 200px;
            width: fit-content;
        }
        .box-title {
            font-size: 10px;
            font-weight: 700;
            color: #9ca3af;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-bottom: 8px;
        }
        .box-item {
            display: flex;
            align-items: center;
            gap: 8px;
            font-size: 10px;
            color: #6b7280;
            font-weight: 500;
            text-transform: uppercase;
            margin-bottom: 4px;
        }
        .box-icon { font-size: 12px; }

        /* Totals */
        .totals-section {
            margin: 0; /* Handled by wrapper */
            display: flex;
            justify-content: flex-end;
        }
        .totals-box {
            width: 350px;
            background: #f9fafb;
            border: 1px solid #e5e7eb;
            border-radius: 8px;
            padding: 24px;
        }
        .total-row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 10px;
            font-size: 13px;
        }
        .total-final {
            display: flex;
            justify-content: space-between;
            border-top: 2px solid #e5e7eb;
            padding-top: 15px;
            margin-top: 15px;
        }
        .total-final .total-val {
            font-size: 18px;
            font-weight: 800;
            color: #059669;
        }

        @media print {
            body { padding: 0; background: white; }
            .container { box-shadow: none; border: none; border-radius: 0; max-width: 1000px; }
            .invoice-header { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
            .info-col.left { -webkit-print-color-adjust: exact; print-color-adjust: exact; background: #f9fafb !important; }
        }
    </style>
</head>
<body>
    <div class="container">
        <!-- Invoice Header -->
        <div class="invoice-header">
            <div class="brand">
                <img src="${window.location.origin}/logo-v4.png" alt="Logo" style="height: 32px; width: auto;">
                <div style="display: flex; flex-direction: column;">
                    <span class="brand-logo">ObraCalc</span>
                    <span class="brand-subtitle">Tecnologia Especialista em Construção Civil</span>
                </div>
            </div>
            <div class="invoice-title">
                <h1>Orçamento</h1>
                <div class="invoice-id">#${data?.id?.slice(0, 8).toUpperCase() || 'REF-001'}</div>
            </div>
        </div>

        <!-- Info Grid -->
        <div class="info-grid">
            <div class="info-col left">
                <div class="col-label">Prestador de Serviços</div>
                <div class="info-row">
                    <span class="info-key">Nome / Empresa</span>
                    <div class="info-val">${data.providerName || '-'}</div>
                </div>
                <div class="info-row">
                    <span class="info-key">Telefone</span>
                    <div class="info-val">${data.providerPhone || '-'}</div>
                </div>
                <div class="info-row">
                    <span class="info-key">Tipo de Obra</span>
                    <div class="info-val">${data.projectType || '-'}</div>
                </div>
            </div>
            <div class="info-col">
                <div class="col-label">Dados do Cliente</div>
                 <div class="info-row">
                    <span class="info-key">Cliente</span>
                    <div class="info-val">${data.clientName || '-'}</div>
                </div>
                <div class="info-row">
                    <span class="info-key">Telefone</span>
                    <div class="info-val">${data.clientPhone || '-'}</div>
                </div>
                <div class="info-row">
                    <span class="info-key">Prazo Estimado</span>
                    <div class="info-val">${data.deadline || '-'}</div>
                </div>
            </div>
        </div>

        ${itemsHTML}

        <div class="footer-wrapper">
             <div class="footer-left">
                  <div class="footer-box">
                       <div class="box-title">Legenda:</div>
                       <div class="box-item"><span class="box-icon">🛠️</span> Composição (Serviço + Material)</div>
                       <div class="box-item"><span class="box-icon">🔨</span> Mão de Obra (Apenas Execução)</div>
                       <div class="box-item"><span class="box-icon">🧱</span> Material (Insumo Isolado)</div>
                  </div>
                  ${!user ? `
                  <div class="footer-box">
                       <div class="box-title">Plano Gratuito:</div>
                       <div class="box-item"><span class="box-icon">✨</span> Gerado por ObraCalc</div>
                       <div class="box-item"><span class="box-icon">🔒</span> Versão não salva na nuvem</div>
                  </div>
                  ` : ''}
             </div>
             
             <div class="totals-section">
                <div class="totals-box">
                    <div class="total-row">
                        <span style="color: #6b7280; font-weight: 600;">SUBTOTAL</span>
                        <span style="font-weight: 600;">${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(subtotal)}</span>
                    </div>
                    <div class="total-row">
                        <span style="color: #6b7280; font-weight: 600;">BDI (${data.bdi || 20}%)</span>
                        <span style="font-weight: 600;">${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(bdiValue)}</span>
                    </div>
                    <div class="total-final">
                        <span style="font-weight: 700; color: #111827;">TOTAL GERAL</span>
                        <span class="total-val">${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(total)}</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
    ${!user ? '<div class="watermark">Gerado gratuitamente por ObraCalc</div>' : ''}
</body>
</html>`;

        // Try to open in new window
        const newWindow = window.open('', '_blank');

        if (newWindow && !newWindow.closed) {
            // Successfully opened new window
            newWindow.document.write(htmlContent);
            newWindow.document.close();
        } else {
            // Popup was blocked, download instead
            const blob = new Blob([htmlContent], { type: 'text/html' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `orcamento-${data?.clientName || estimateId}.html`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-gray-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-gray-600">Carregando relatório...</p>
                </div>
            </div>
        );
    }

    if (!data) {
        return (
            <div className="flex flex-col justify-center items-center min-h-screen bg-gray-50">
                <div className="text-center">
                    <p className="text-xl mb-6 text-gray-800">Orçamento não encontrado</p>
                    <button onClick={() => router.push('/')} className="btn btn-primary">
                        Voltar para Home
                    </button>
                </div>
            </div>
        );
    }

    const includedItems = data.items?.filter((i: any) => i.included) || [];
    const subtotal = includedItems.reduce((sum: number, item: any) => {
        const price = item.manualPrice !== undefined && item.manualPrice !== null ? item.manualPrice : item.price;
        return sum + (Number(price) * Number(item.quantity));
    }, 0);

    const bdiValue = subtotal * ((data.bdi || 20) / 100);
    const total = subtotal + bdiValue;

    // Group items by category
    const groupedItems: Record<string, any[]> = {};
    includedItems.forEach((item: any) => {
        const category = item.category || 'OUTROS';
        if (!groupedItems[category]) {
            groupedItems[category] = [];
        }
        groupedItems[category].push(item);
    });

    const categories = Object.keys(groupedItems);

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 print:bg-white print:min-h-0 print:h-auto">
            <style jsx global>{`
                @media print {
                    @page { 
                        margin: 7mm;
                        size: A4;
                    }
                    body { 
                        margin: 0; 
                        background: white !important; 
                        -webkit-print-color-adjust: exact;
                        print-color-adjust: exact;
                    }
                    nav, .no-print, footer, .footer { 
                        display: none !important; 
                    }
                    .print-content { 
                        box-shadow: none !important; 
                        background: white !important;
                        max-width: 100% !important;
                        width: 100% !important;
                    }
                    
                    /* Balanced colors for print */
                    div, span, p, h2, h3, h4, h5, h6 {
                        color: #374151 !important; /* Dark Grey base */
                    }
                    
                    /* Highlights - Black */
                    .font-bold, .font-semibold, h2, .item-total, .total-value {
                        color: #000000 !important;
                    }

                    /* Header Override - Force White on Dark BG */
                    .bg-\[\#374151\] *, .invoice-header *, .brand-logo, .invoice-title h1 {
                        color: white !important;
                    }

                    /* Secondary - Discreet Grey */
                    .text-gray-400, .text-gray-500, .uppercase.text-xs {
                        color: #4b5563 !important;
                    }

                    /* Keep Total Green */
                    .text-green-600, .text-green-600 * {
                        color: #16a34a !important;
                    }

                    /* Remove any potential footer elements */
                    *[class*="footer"], 
                    *[class*="Footer"],
                    *[id*="footer"],
                    *[id*="Footer"] {
                        display: none !important;
                    }
                    /* Ensure totals section uses condensed font sizes */
                    .space-y-3 > div {
                        font-size: 12px !important;
                    }
                    .space-y-3 span[class*="text-xs"],
                    .space-y-3 span[class*="text-sm"] {
                        font-size: 12px !important;
                    }
                    .space-y-3 span[class*="text-[10px]"] {
                        font-size: 10px !important;
                    }
                    .space-y-3 span[class*="text-base"] {
                        font-size: 16px !important;
                    }
                    .watermark {
                        text-align: center;
                        color: #9ca3af;
                        font-size: 10px;
                        margin-top: 40px;
                        margin-bottom: 20px;
                        text-transform: uppercase;
                        letter-spacing: 1px;
                    }
                    @media print {
                        .watermark {
                            display: block !important;
                            position: fixed;
                            bottom: 10px;
                            left: 0;
                            width: 100%;
                        }
                    }
                }
            `}</style>

            {/* Toolbar */}
            <div className="no-print bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm sticky top-0 z-50">
                <div className="max-w-[1600px] mx-auto px-6 py-4 flex justify-between items-center gap-4">
                    <button
                        onClick={() => router.push(`/editor/${estimateId}`)}
                        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 rounded-lg transition-colors shadow-sm"
                    >
                        <ArrowLeft size={18} /> Voltar ao Editor
                    </button>

                    <div className="flex gap-3">
                        {/* Guest Actions (Discreet) */}
                        {!user && (
                            <>
                                <button
                                    onClick={() => router.push('/login')}
                                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 rounded-lg transition-colors shadow-sm"
                                    title="Crie uma conta para salvar"
                                >
                                    <Cloud size={18} /> <span className="hidden sm:inline">Salvar na Nuvem</span>
                                </button>
                                <button
                                    onClick={() => router.push('/planos')}
                                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 rounded-lg transition-colors shadow-sm"
                                >
                                    <Sparkles size={18} /> <span className="hidden sm:inline">Remover Marca d'Água</span>
                                </button>
                            </>
                        )}

                        <button
                            onClick={handleExportHTML}
                            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 rounded-lg transition-colors shadow-sm"
                        >
                            <FileText size={18} /> Exportar HTML
                        </button>
                        <button
                            onClick={handlePrint}
                            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-primary hover:bg-primary/90 rounded-lg transition-colors shadow-sm"
                        >
                            <Printer size={18} /> Gerar PDF
                        </button>
                    </div>
                </div>
            </div>

            {/* Report Content */}
            <div id="report-content" className="max-w-none mx-auto p-4 lg:p-8 print-content print:p-0 print:max-w-full">
                {/* Header - Premium Invoice Style (Compact 40%) */}
                <div className="mb-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden break-inside-avoid print:border print:shadow-none print:rounded-xl">
                    {/* Top Bar - Brand & Title */}
                    <div className="bg-[#374151] text-white px-6 py-4 flex justify-between items-center print:bg-[#374151] print:text-white">
                        <div className="flex items-center gap-3">
                            <img
                                src="/logo-v4.png"
                                alt="Logo ObraCalc"
                                className="h-8 w-auto"
                            />
                            <div>
                                <div className="text-xl font-semibold tracking-tight leading-none text-white">ObraCalc</div>
                                <div className="text-[10px] text-gray-400 font-medium tracking-wide uppercase mt-0.5 leading-none">Tecnologia Especialista em Construção Civil</div>
                            </div>
                        </div>
                        <div className="text-right">
                            <h1 className="text-2xl font-medium tracking-wide uppercase opacity-100 mb-0.5 text-white">Orçamento</h1>
                            <p className="text-xs text-gray-300 font-mono tracking-wide uppercase">#{estimateId.slice(0, 8)}</p>
                        </div>
                    </div>

                    {/* Info Grid - Split Panel */}
                    <div className="grid grid-cols-1 md:grid-cols-2">
                        {/* Prestador (Left) */}
                        <div className="p-5 border-b md:border-b-0 md:border-r border-gray-100 dark:border-gray-700 bg-gray-50/80 dark:bg-gray-800/50 print:bg-gray-50">
                            <div className="mb-3 pb-1 border-b border-gray-200 dark:border-gray-700">
                                <h3 className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest leading-none">Prestador de Serviços</h3>
                            </div>

                            <div className="space-y-2">
                                <div>
                                    <div className="text-[9px] font-medium text-gray-400 uppercase mb-0.5 leading-none">Nome / Empresa</div>
                                    <div className="text-gray-900 dark:text-white font-normal text-sm leading-tight">{data.providerName || '-'}</div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <div className="text-[9px] font-medium text-gray-400 uppercase mb-0.5 leading-none">Telefone</div>
                                        <div className="text-gray-800 dark:text-gray-200 font-normal text-sm leading-none">{data.providerPhone || '-'}</div>
                                    </div>
                                    <div>
                                        <div className="text-[9px] font-medium text-gray-400 uppercase mb-0.5 leading-none">Tipo de Obra</div>
                                        <div className="text-gray-800 dark:text-gray-200 font-normal text-sm leading-none">{data.projectType || '-'}</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Cliente (Right) */}
                        <div className="p-5 bg-white dark:bg-gray-800 print:bg-white">
                            <div className="mb-3 pb-1 border-b border-gray-100 dark:border-gray-700">
                                <h3 className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest leading-none">Dados do Cliente</h3>
                            </div>

                            <div className="space-y-2">
                                <div>
                                    <div className="text-[9px] font-medium text-gray-400 uppercase mb-0.5 leading-none">Cliente</div>
                                    <div className="text-gray-900 dark:text-white font-normal text-sm leading-tight">{data.clientName || '-'}</div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <div className="text-[9px] font-medium text-gray-400 uppercase mb-0.5 leading-none">Telefone</div>
                                        <div className="text-gray-800 dark:text-gray-200 font-normal text-sm leading-none">{data.clientPhone || '-'}</div>
                                    </div>
                                    <div>
                                        <div className="text-[9px] font-medium text-gray-400 uppercase mb-0.5 leading-none">Prazo</div>
                                        <div className="text-gray-800 dark:text-gray-200 font-normal text-sm leading-none">{data.deadline || '-'}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Items - Condensed Table Style */}
                <div className="space-y-6">
                    {categories.map((category) => {
                        const categoryItems = groupedItems[category];
                        const categoryTotal = categoryItems.reduce((sum: number, item: any) => {
                            const price = item.manualPrice ?? item.price;
                            return sum + (price * item.quantity);
                        }, 0);

                        return (
                            <div key={category}>
                                {/* Category Header */}
                                <div className="flex items-center justify-between px-4 py-2 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                                    <h3 className="text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                                        {category}
                                    </h3>
                                    <span className="text-xs font-bold text-gray-700 dark:text-gray-300">
                                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(categoryTotal)}
                                    </span>
                                </div>

                                {/* Sections by Type */}
                                <div className="bg-white dark:bg-gray-900">
                                    {(() => {
                                        // Group items
                                        const groups: Record<string, any[]> = { composition: [], service: [], material: [] };
                                        categoryItems.forEach((item: any) => {
                                            let type = item.type;
                                            if (!type || (type !== 'service' && type !== 'material')) {
                                                type = 'composition';
                                            }
                                            groups[type].push(item);
                                        });

                                        const orderedGroups = [
                                            { id: 'composition', title: 'Composições', icon: '🛠️', items: groups.composition },
                                            { id: 'service', title: 'Serviços', icon: '🔨', items: groups.service },
                                            { id: 'material', title: 'Materiais', icon: '🧱', items: groups.material }
                                        ].filter(g => g.items.length > 0);

                                        return orderedGroups.map(g => (
                                            <div key={g.id}>
                                                {/* Group Header as Column Header */}
                                                <div className="grid grid-cols-12 gap-4 px-4 py-2 text-[9px] font-bold text-gray-400 uppercase tracking-wider bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 mt-2 first:mt-0">
                                                    <div className="col-span-5 flex items-center gap-2 text-gray-600 dark:text-gray-400">
                                                        <span className="text-sm leading-none">{g.icon}</span>
                                                        <span>{g.title}</span>
                                                    </div>
                                                    <div className="col-span-1 text-center">Un.</div>
                                                    <div className="col-span-2 text-center">Qtd</div>
                                                    <div className="col-span-2 text-right">Unit</div>
                                                    <div className="col-span-2 text-right">Total</div>
                                                </div>

                                                {/* Rows */}
                                                {g.items.map((item: any) => {
                                                    const price = item.manualPrice ?? item.price;
                                                    const itemTotal = price * item.quantity;

                                                    return (
                                                        <div
                                                            key={item.id}
                                                            className="grid grid-cols-12 gap-4 px-4 py-2 text-[11px] border-b border-gray-50 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                                                        >
                                                            <div className="col-span-5 text-gray-700 dark:text-gray-300 font-medium">
                                                                {item.name}
                                                            </div>
                                                            <div className="col-span-1 text-center text-gray-400 dark:text-gray-500 text-[10px] uppercase">{item.unit}</div>
                                                            <div className="col-span-2 text-center text-gray-600 dark:text-gray-400">{item.quantity}</div>
                                                            <div className="col-span-2 text-right text-gray-500 dark:text-gray-400">
                                                                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(price)}
                                                            </div>
                                                            <div className="col-span-2 text-right text-gray-700 dark:text-gray-300 font-semibold">
                                                                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(itemTotal)}
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        ));
                                    })()}
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Footer Section: Legend & Totals Side-by-Side */}
                <div className="mt-8 flex flex-col md:flex-row justify-between items-start md:items-stretch gap-8 break-inside-avoid">

                    <div className="flex flex-col lg:flex-row gap-4">
                        {/* Legend Island (Left) */}
                        <div className="w-full md:w-72 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 flex flex-col justify-center">
                            <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-3">Legenda:</h3>
                            <div className="flex flex-col gap-2 text-[10px] text-gray-500 uppercase tracking-wide font-medium">
                                <div className="flex items-center gap-2">
                                    <span className="text-sm">🛠️</span>
                                    <span>Composição (Serviço + Material)</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-sm">🔨</span>
                                    <span>Mão de Obra (Apenas Execução)</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-sm">🧱</span>
                                    <span>Material (Insumo Isolado)</span>
                                </div>
                            </div>
                        </div>

                        {/* Branding/Watermark Island (Hidden for Paid Plans) */}
                        {!user && (
                            <div className="w-full md:w-72 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 flex flex-col justify-center">
                                <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-3">Plano Gratuito:</h3>
                                <div className="flex flex-col gap-2 text-[10px] text-gray-500 uppercase tracking-wide font-medium">
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm">✨</span>
                                        <span>Gerado por ObraCalc</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm">🔒</span>
                                        <span>Versão não salva na nuvem</span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Totals Box (Right) */}
                    <div className="w-full md:w-80 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
                        <div className="space-y-3">
                            <div className="flex justify-between text-xs">
                                <span className="font-bold text-gray-700 dark:text-gray-400 uppercase text-[10px]">Subtotal</span>
                                <span className="font-semibold text-gray-900 dark:text-white">
                                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(subtotal)}
                                </span>
                            </div>
                            <div className="flex justify-between text-xs">
                                <span className="font-bold text-gray-700 dark:text-gray-400 uppercase text-[10px]">BDI ({data.bdi || 20}%)</span>
                                <span className="font-semibold text-gray-900 dark:text-white">
                                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(bdiValue)}
                                </span>
                            </div>
                            <div className="flex justify-between text-sm font-bold border-t border-gray-200 dark:border-gray-700 pt-3">
                                <span className="text-gray-900 dark:text-white uppercase text-[10px]">Total Geral</span>
                                <span className="text-green-600 dark:text-green-400 text-base">
                                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(total)}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
