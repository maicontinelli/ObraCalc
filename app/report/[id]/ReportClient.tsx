'use client';

import { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { FileText, Printer, ArrowLeft, User as UserIcon, Phone, Building2, Calendar } from 'lucide-react';
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
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Orçamento - ${data?.clientName || 'Relatório'}</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
            background: #f9fafb;
            padding: 40px 20px;
            color: #374151;
            line-height: 1.5;
        }
        .container { 
            max-width: 1600px;
            margin: 0 auto;
            background: white;
            padding: 48px;
            border-radius: 8px;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }
        h1 { 
            font-size: 24px;
            font-weight: 700;
            color: #111827;
            margin-bottom: 24px;
        }
        .header-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 64px;
            margin-bottom: 32px;
            font-size: 14px;
            background: white;
            border: 1px solid #e5e7eb;
            border-radius: 8px;
            padding: 24px;
        }
        .info-column { 
            display: flex;
            flex-direction: column;
            gap: 12px;
        }
        .info-block {
            display: flex;
            align-items: flex-start;
            gap: 8px;
        }
        .info-icon {
            width: 16px;
            height: 16px;
            color: #4b5563;
            flex-shrink: 0;
            margin-top: 2px;
        }
        .info-content {
            flex: 1;
            display: flex;
            align-items: baseline;
            gap: 6px;
            flex-wrap: wrap;
        }
        .info-label {
            font-size: 10px;
            font-weight: 700;
            color: #4b5563;
            text-transform: uppercase;
            letter-spacing: 0.05em;
        }
        .info-value {
            color: #111827;
            font-weight: 500;
        }
        .ddd-info {
            font-size: 10px;
            color: #6b7280;
            margin-top: 2px;
            width: 100%;
        }
        .ddd-state {
            font-weight: 600;
            color: #00704A;
        }
        .category-section {
            margin-bottom: 24px;
        }
        .category-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 8px 16px;
            background: #f9fafb;
            border-bottom: 1px solid #e5e7eb;
        }
        .category-title {
            font-size: 12px;
            font-weight: 700;
            color: #374151;
            text-transform: uppercase;
            letter-spacing: 0.05em;
        }
        .category-total {
            font-size: 12px;
            font-weight: 700;
            color: #111827;
        }
        .items-header {
            display: grid;
            grid-template-columns: 5fr 1fr 2fr 2fr 2fr;
            gap: 16px;
            padding: 8px 16px;
            background: white;
            border-bottom: 1px solid #f3f4f6;
        }
        .items-header div {
            font-size: 9px;
            font-weight: 700;
            color: #4b5563;
            text-transform: uppercase;
            letter-spacing: 0.05em;
        }
        .item-row {
            display: grid;
            grid-template-columns: 5fr 1fr 2fr 2fr 2fr;
            gap: 16px;
            padding: 8px 16px;
            border-bottom: 1px solid #f9fafb;
            font-size: 11px;
        }
        .item-row:hover {
            background: #f9fafb;
        }
        .item-name {
            color: #374151;
            font-weight: 500;
        }
        .item-unit {
            text-align: center;
            color: #6b7280;
            font-size: 10px;
            text-transform: uppercase;
        }
        .item-qty {
            text-align: center;
            color: #374151;
        }
        .item-price {
            text-align: right;
            color: #374151;
        }
        .item-total {
            text-align: right;
            color: #111827;
            font-weight: 600;
        }
        .totals-section {
            margin-top: 32px;
            display: flex;
            justify-content: flex-end;
        }
        .totals-box {
            width: 320px;
            background: white;
            border: 1px solid #e5e7eb;
            border-radius: 8px;
            padding: 24px;
        }
        .total-row {
            display: flex;
            justify-content: space-between;
            
            font-size: 12px;
        }
        .total-label {
            font-size: 10px;
            font-weight: 700;
            color: #374151;
            text-transform: uppercase;
        }
        .total-value {
            font-weight: 600;
            color: #111827;
            font-size: 12px;
        }
        .total-final {
            display: flex;
            justify-content: space-between;
            border-top: 1px solid #e5e7eb;
            padding-top: 12px;
            margin-top: 12px;
        }
        .total-final .total-label {
            font-size: 10px;
            color: #111827;
        }
        .total-final .total-value {
            font-size: 16px;
            font-weight: 700;
            color: #059669;
        }
        @media print {
            body { background: white; padding: 0; }
            .container { box-shadow: none; }
        }
    </style>
</head>
<body>
    <div class="container">
        <h1 style="text-align: center;">Orçamento</h1>
        
        <div class="header-grid">
            <div class="info-column">
                <div class="info-block">
                    <svg class="info-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                    <div class="info-content">
                        <span class="info-label">PRESTADOR:</span>
                        <span class="info-value">${data.providerName || '-'}</span>
                    </div>
                </div>
                <div class="info-block">
                    <svg class="info-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                    <div class="info-content">
                        <span class="info-label">TELEFONE:</span>
                        <span class="info-value">${data.providerPhone || '-'}</span>
                    </div>
                </div>
                <div class="info-block">
                    <svg class="info-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z"/><path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2"/><path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2"/><path d="M10 6h4"/><path d="M10 10h4"/><path d="M10 14h4"/><path d="M10 18h4"/></svg>
                    <div class="info-content">
                        <span class="info-label">TIPO DE OBRA:</span>
                        <span class="info-value">${data.projectType || '-'}</span>
                    </div>
                </div>
            </div>
            
            <div class="info-column">
                <div class="info-block">
                    <svg class="info-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                    <div class="info-content">
                        <span class="info-label">CLIENTE:</span>
                        <span class="info-value">${data.clientName || '-'}</span>
                    </div>
                </div>
                <div class="info-block">
                    <svg class="info-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                    <div class="info-content">
                        <span class="info-label">TELEFONE:</span>
                        <span class="info-value">${data.clientPhone || '-'}</span>
                    </div>
                </div>
                <div class="info-block">
                    <svg class="info-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>
                    <div class="info-content">
                        <span class="info-label">PRAZO:</span>
                        <span class="info-value">${data.deadline || '-'}</span>
                    </div>
                </div>
            </div>
        </div>

        ${itemsHTML}

        <div class="totals-section">
            <div class="totals-box">
                <div class="total-row">
                    <div class="total-label">Subtotal</div>
                    <div class="total-value">${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(subtotal)}</div>
                </div>
                <div class="total-row">
                    <div class="total-label">BDI (${data.bdi || 20}%)</div>
                    <div class="total-value">${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(bdiValue)}</div>
                </div>
                <div class="total-final">
                    <div class="total-label">Total Geral</div>
                    <div class="total-value">${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(total)}</div>
                </div>
            </div>
        </div>
    </div>
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
                        margin: 15mm;
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
                    }
                    
                    /* Balanced colors for print */
                    div, span, p, h1, h2, h3, h4, h5, h6 {
                        color: #374151 !important; /* Dark Grey base */
                    }
                    
                    /* Highlights - Black */
                    .font-bold, .font-semibold, h1, h2, .item-total, .total-value {
                        color: #000000 !important;
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
                }
            `}</style>

            {/* Toolbar */}
            <div className="no-print bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm sticky top-0 z-50">
                <div className="max-w-[1600px] mx-auto px-6 py-4 flex justify-between items-center gap-4">
                    <button
                        onClick={() => router.push(`/editor/${estimateId}`)}
                        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                    >
                        <ArrowLeft size={18} /> Voltar ao Editor
                    </button>

                    <div className="flex gap-3">
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
            <div id="report-content" className="max-w-[1600px] mx-auto p-6 lg:p-8 print-content">
                {/* Header - Condensed */}
                <div className="mb-8 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6" style={{ breakInside: 'avoid' }}>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
                        Orçamento
                    </h1>

                    {/* Info Grid - Two columns with inline icons */}
                    <div className="grid grid-cols-1 md:grid-cols-2 print:grid-cols-2 gap-x-16 gap-y-0 text-sm">
                        {/* Prestador Column */}
                        <div className="space-y-3">
                            <div className="flex items-center gap-2">
                                <UserIcon className="w-4 h-4 text-gray-500 flex-shrink-0" />
                                <div className="flex items-baseline gap-1.5">
                                    <span className="text-[10px] font-bold text-gray-600 uppercase tracking-wide">PRESTADOR:</span>
                                    <span className="text-gray-900 dark:text-white font-medium">{data.providerName || '-'}</span>
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                <Phone className="w-4 h-4 text-gray-500 flex-shrink-0" />
                                <div className="flex items-baseline gap-1.5">
                                    <span className="text-[10px] font-bold text-gray-600 uppercase tracking-wide">TELEFONE:</span>
                                    <span className="text-gray-900 dark:text-white">{data.providerPhone || '-'}</span>
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                <Building2 className="w-4 h-4 text-gray-500 flex-shrink-0" />
                                <div className="flex items-baseline gap-1.5">
                                    <span className="text-[10px] font-bold text-gray-600 uppercase tracking-wide">TIPO DE OBRA:</span>
                                    <span className="text-gray-900 dark:text-white">{data.projectType || '-'}</span>
                                </div>
                            </div>
                        </div>

                        {/* Cliente Column */}
                        <div className="space-y-3">
                            <div className="flex items-center gap-2">
                                <UserIcon className="w-4 h-4 text-gray-500 flex-shrink-0" />
                                <div className="flex items-baseline gap-1.5">
                                    <span className="text-[10px] font-bold text-gray-600 uppercase tracking-wide">CLIENTE:</span>
                                    <span className="text-gray-900 dark:text-white font-medium">{data.clientName || '-'}</span>
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                <Phone className="w-4 h-4 text-gray-500 flex-shrink-0" />
                                <div className="flex items-baseline gap-1.5">
                                    <span className="text-[10px] font-bold text-gray-600 uppercase tracking-wide">TELEFONE:</span>
                                    <span className="text-gray-900 dark:text-white">{data.clientPhone || '-'}</span>
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4 text-gray-500 flex-shrink-0" />
                                <div className="flex items-baseline gap-1.5">
                                    <span className="text-[10px] font-bold text-gray-600 uppercase tracking-wide">PRAZO:</span>
                                    <span className="text-gray-900 dark:text-white">{data.deadline || '-'}</span>
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

                    {/* Legend Island (Left) */}
                    <div className="w-full md:w-80 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 flex flex-col justify-center">
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

            {/* Guest Warning Banner */}
            {!loading && !user && (
                <div className="no-print fixed bottom-0 left-0 right-0 bg-yellow-50 border-t border-yellow-200 p-4 shadow-lg z-50">
                    <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-yellow-100 text-yellow-700 rounded-full">
                                <span className="text-xl">⚠️</span>
                            </div>
                            <div>
                                <p className="text-sm font-bold text-yellow-800">
                                    Atenção: Este orçamento é temporário
                                </p>
                                <p className="text-xs text-yellow-700 mt-0.5">
                                    Ele não está salvo na nuvem e será perdido se você limpar o navegador.
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={() => router.push('/login')}
                            className="w-full sm:w-auto px-6 py-2 bg-yellow-500 hover:bg-yellow-600 text-white text-sm font-bold rounded-lg shadow-sm transition-colors whitespace-nowrap"
                        >
                            Salvar na Nuvem Agora
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
