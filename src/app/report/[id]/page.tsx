'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { DEFAULT_BOQ_CATEGORIES } from '@/lib/constants';
import { QRCodeSVG } from 'qrcode.react';
import { Download, Share2, ArrowLeft, ExternalLink, Building2 } from 'lucide-react';
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
    };
};

export default function ReportPage({ params }: { params: Promise<{ id: string }> }) {
    const [id, setId] = useState<string>('');
    const [data, setData] = useState<any>(null);
    const [url, setUrl] = useState('');

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
                        included: item.incluir
                    }));

                    setData({
                        id: orcamento.id,
                        title: orcamento.titulo,
                        client: orcamento.cliente,
                        date: orcamento.data_atualizacao || orcamento.data_criacao,
                        items: mappedItems,
                        bdi: orcamento.bdi_percent,
                        logo: orcamento.logo_url // Assuming we might save logo url later, or use local state for now
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



    const handleDownloadHtml = () => {
        // Create a self-contained HTML structure with inline styles
        const styles = `
            body { font-family: system-ui, -apple-system, sans-serif; color: #111; line-height: 1.5; max-width: 800px; margin: 0 auto; padding: 40px; }
            h1 { color: #2563eb; margin-bottom: 5px; font-size: 24px; }
            h2 { margin-top: 0; font-size: 18px; color: #333; }
            .header { display: flex; justify-content: space-between; margin-bottom: 40px; border-bottom: 1px solid #eee; padding-bottom: 20px; }
            .meta { font-size: 14px; color: #666; }
            .logo { max-height: 60px; max-width: 150px; }
            .category { margin-top: 30px; page-break-inside: avoid; }
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
            .footer { margin-top: 60px; text-align: center; font-size: 10px; color: #999; border-top: 1px solid #eee; padding-top: 20px; }
        `;

        const itemsHtml = Object.entries(categoryTotals).map(([category, catTotal]) => {
            const catItems = data.items.filter((i: any) => i.category === category && i.included && (i.quantity > 0));
            if (catItems.length === 0) return '';

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
                    <div>
                        <h1>Orçamento de Obra</h1>
                        <h2>${data.title}</h2>
                        <div class="meta">
                            <p>Cliente: ${data.client}</p>
                            <p>Data: ${new Date(data.date).toLocaleDateString('pt-BR')}</p>
                        </div>
                    </div>

                </div>

                ${itemsHtml}

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
                    <p>Gerado por Orçamentos Civil</p>
                    <p><a href="${url}">${url}</a></p>
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
            {/* Sticky Toolbar */}
            <div className="sticky top-0 z-10 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm print:hidden">
                <div className="container mx-auto py-3 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div className="flex items-center gap-4 flex-1 w-full">
                        <Link href={`/editor/${id}`} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full text-gray-500 dark:text-gray-400 shrink-0">
                            <ArrowLeft size={20} />
                        </Link>
                        <div className="flex-1 max-w-xl">
                            <div className="font-bold text-base sm:text-lg text-gray-900 dark:text-gray-100">
                                {data.title}
                            </div>
                            <div className="flex flex-wrap items-center gap-2 mt-1">
                                <span className="text-xs text-gray-500 dark:text-gray-400">
                                    Cliente: {data.client}
                                </span>
                                <div className="hidden sm:block text-xs text-gray-300 dark:text-gray-600">|</div>
                                <span className="text-xs text-gray-500 dark:text-gray-400">
                                    {new Date(data.date).toLocaleDateString('pt-BR')}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 w-full sm:w-auto justify-end border-t sm:border-t-0 pt-2 sm:pt-0 border-gray-100 dark:border-gray-700">
                        <button onClick={handleDownloadHtml} className="btn bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 flex items-center gap-2 text-xs sm:text-sm">
                            <ExternalLink size={16} /> HTML
                        </button>
                        <button onClick={() => window.print()} className="btn btn-primary shadow-lg text-xs sm:text-sm flex items-center gap-2">
                            <Share2 size={16} /> PDF
                        </button>
                    </div>
                </div>
            </div>

            <div className="max-w-4xl mx-auto p-4 sm:p-8 border-x border-gray-200 dark:border-gray-700 print:border-none">
                {/* Header */}
                <div className="flex justify-between items-start mb-6 border-b border-gray-200 pb-4">
                    <div>
                        <h1 className="text-2xl font-bold text-[var(--color-primary)] mb-1">Orçamento de Obra</h1>
                        <h2 className="text-lg font-semibold text-gray-800">{data.title}</h2>
                        <p className="text-gray-600 mt-1 text-sm">Cliente: {data.client}</p>
                        <p className="text-gray-500 text-xs">Data: {new Date(data.date).toLocaleDateString('pt-BR')}</p>
                    </div>
                    <div className="text-right">
                        <div className="flex flex-col items-end">
                            <QRCodeSVG value={url} size={60} />
                            <span className="text-[10px] text-gray-400 mt-1">Ver online</span>
                        </div>
                    </div>
                </div>

                {/* Items */}
                <div className="space-y-4">
                    {Object.entries(categoryTotals).map(([category, catTotal]) => (
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
                                    {data.items.filter((i: any) => i.category === category && i.included && (i.quantity > 0)).map((item: any) => {
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
                            <div className="flex justify-between text-lg font-bold text-[var(--color-primary)] pt-2 border-t border-gray-200">
                                <span>Total Geral</span>
                                <span>{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(total)}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="mt-8 pt-4 border-t border-gray-100 text-center text-[10px] text-gray-400">
                    <p>Gerado por Orçamentos Civil - Acesse via QR Code para versão atualizada.</p>
                    <p>{url}</p>
                </div>
            </div>
        </div>
    );
}
