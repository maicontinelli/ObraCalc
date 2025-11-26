'use client';

import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { BOQ_TEMPLATES } from '@/lib/constants';
import { Save, ArrowLeft, RefreshCw, Trash2, Moon, Sun } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useTheme } from '@/contexts/ThemeContext';


type BoqItem = {
    id: string;
    name: string;
    unit: string;
    price: number;
    quantity: number;
    manualPrice?: number;
    included: boolean;
    category: string;
    isCustom?: boolean;
};

export default function BoqEditor({ estimateId }: { estimateId: string }) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const type = (searchParams?.get('type') as 'obra_nova') || 'obra_nova';
    const { theme, toggleTheme } = useTheme();

    const [items, setItems] = useState<BoqItem[]>([]);
    const [bdi, setBdi] = useState(20); // Default 20%
    const [isSaving, setIsSaving] = useState(false);
    const [lastSaved, setLastSaved] = useState<Date | null>(null);
    const [projectName, setProjectName] = useState('Novo Orçamento');
    const [clientName, setClientName] = useState('');

    const [collapsedCategories, setCollapsedCategories] = useState<Record<string, boolean>>({});



    // Initialize items from default BOQ based on type
    useEffect(() => {
        // Try to load from localStorage first
        const savedData = localStorage.getItem(`estimate_${estimateId}`);
        if (savedData) {
            try {
                const parsed = JSON.parse(savedData);
                if (parsed.items && Array.isArray(parsed.items) && parsed.items.length > 0) {
                    setItems(parsed.items);
                    if (parsed.bdi) setBdi(parsed.bdi);
                    if (parsed.title) setProjectName(parsed.title);
                    if (parsed.client) setClientName(parsed.client);


                    // Re-initialize collapsed state based on loaded items
                    const initialCollapsedState: Record<string, boolean> = {};
                    const categories = new Set(parsed.items.map((i: BoqItem) => i.category));
                    categories.forEach((cat) => {
                        initialCollapsedState[cat as string] = true;
                    });
                    // Ensure "Itens Adicionais" is present
                    initialCollapsedState["Itens Adicionais"] = true;

                    setCollapsedCategories(initialCollapsedState);
                    return;
                }
            } catch (e) {
                console.error("Error loading saved estimate:", e);
            }
        }

        // Fallback: Load default template
        const template = BOQ_TEMPLATES[type] || BOQ_TEMPLATES.obra_nova;

        const flatItems: BoqItem[] = [];
        const initialCollapsedState: Record<string, boolean> = {};

        template.forEach(cat => {
            initialCollapsedState[cat.name] = true; // Collapse by default
            cat.items.forEach(item => {
                flatItems.push({
                    ...item,
                    category: cat.name,
                    included: false,
                    quantity: 0,
                });
            });
        });

        // Add custom category items if not present
        const customCategoryName = "Itens Adicionais";
        initialCollapsedState[customCategoryName] = true;

        setItems(flatItems);
        setCollapsedCategories(initialCollapsedState);
    }, [type, estimateId]);



    // Calculations
    const totals = useMemo(() => {
        let subtotal = 0;
        const categoryTotals: Record<string, number> = {};

        items.forEach(item => {
            if (item.included) {
                const price = item.manualPrice !== undefined && item.manualPrice !== null ? item.manualPrice : item.price;
                const total = price * item.quantity;
                subtotal += total;

                if (!categoryTotals[item.category]) categoryTotals[item.category] = 0;
                categoryTotals[item.category] += total;
            }
        });

        const bdiValue = subtotal * (bdi / 100);
        const total = subtotal + bdiValue;

        return { subtotal, bdiValue, total, categoryTotals };
    }, [items, bdi]);

    const groupedItems = useMemo(() => {
        const groups: Record<string, BoqItem[]> = {};

        // Ensure all categories from items are present
        items.forEach(item => {
            if (!groups[item.category]) groups[item.category] = [];
            groups[item.category].push(item);
        });

        // Sort to ensure "Itens Adicionais" appears first
        const sortedGroups: Record<string, BoqItem[]> = {};

        // Add "Itens Adicionais" first if it exists
        if (groups["Itens Adicionais"]) {
            sortedGroups["Itens Adicionais"] = groups["Itens Adicionais"];
        }

        // Add all other categories
        Object.keys(groups).forEach(key => {
            if (key !== "Itens Adicionais") {
                sortedGroups[key] = groups[key];
            }
        });

        return sortedGroups;
    }, [items]);

    // Handlers
    const handleQuantityChange = (id: string, val: string) => {
        const num = parseFloat(val) || 0;
        setItems(prev => prev.map(item => item.id === id ? { ...item, quantity: num } : item));
    };

    const handleManualPriceChange = (id: string, val: string) => {
        const num = val === '' ? undefined : parseFloat(val);
        setItems(prev => prev.map(item => item.id === id ? { ...item, manualPrice: num } : item));
    };

    const toggleInclude = (id: string) => {
        setItems(prev => prev.map(item => item.id === id ? { ...item, included: !item.included } : item));
    };

    const handleUnitChange = (id: string, newUnit: string) => {
        setItems(prev => prev.map(item => item.id === id ? { ...item, unit: newUnit } : item));
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            // Save to localStorage
            const estimateData = {
                id: estimateId,
                title: projectName,
                client: clientName,
                date: new Date().toISOString(),
                items: items,
                bdi: bdi,
            };
            localStorage.setItem(`estimate_${estimateId}`, JSON.stringify(estimateData));
            setLastSaved(new Date());
        } catch (error) {
            console.error('Error saving estimate:', error);
            alert('Erro ao salvar localmente.');
        } finally {
            setIsSaving(false);
        }
    };

    const toggleCategoryCollapse = (category: string) => {
        setCollapsedCategories(prev => ({
            ...prev,
            [category]: !prev[category]
        }));
    };

    const toggleCategoryItems = (category: string, shouldInclude: boolean) => {
        setItems(prev => prev.map(item =>
            item.category === category ? { ...item, included: shouldInclude } : item
        ));
    };

    const handleAddCustomItem = (category: string) => {
        const newItem: BoqItem = {
            id: crypto.randomUUID(),
            name: "",
            unit: "un",
            price: 0,
            quantity: 1,
            manualPrice: 0,
            included: true,
            category: category,
            isCustom: true
        };

        setItems(prev => [...prev, newItem]);

        // Ensure category is expanded when adding item
        setCollapsedCategories(prev => ({
            ...prev,
            [category]: false
        }));
    };

    const handleDeleteItem = (id: string) => {
        setItems(prev => prev.filter(item => item.id !== id));
    };

    const handleItemNameChange = (id: string, newName: string) => {
        setItems(prev => prev.map(item => item.id === id ? { ...item, name: newName } : item));
    };



    const handleGenerateReport = async () => {
        // 1. Save to LocalStorage
        await handleSave();

        // 2. Navigate to report page
        router.push(`/report/${estimateId}`);
    };



    return (
        <div className="pb-20 dark:bg-gray-900">
            {/* Toolbar */}
            <div className="sticky top-0 z-10 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm mb-6">
                <div className="container mx-auto py-2 flex flex-col sm:flex-row justify-between items-center gap-4 px-4">
                    <div className="flex items-center gap-4 flex-1 w-full">
                        <Link href="/" className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full text-gray-500 dark:text-gray-400 shrink-0">
                            <ArrowLeft size={20} />
                        </Link>
                        <div className="flex-1">
                            <input
                                type="text"
                                value={projectName}
                                onChange={(e) => setProjectName(e.target.value)}
                                className="font-bold text-base text-gray-900 dark:text-gray-100 dark:bg-gray-800 border-none p-0 focus:ring-0 w-full placeholder-gray-400 dark:placeholder-gray-500"
                                placeholder="Nome do Projeto"
                            />
                            <div className="flex items-center gap-2">
                                <input
                                    type="text"
                                    value={clientName}
                                    onChange={(e) => setClientName(e.target.value)}
                                    className="text-xs text-gray-500 dark:text-gray-400 dark:bg-gray-800 border-none p-0 focus:ring-0 w-auto placeholder-gray-400 dark:placeholder-gray-500"
                                    placeholder="Nome do Cliente"
                                />
                                <span className="text-gray-300 text-xs">|</span>
                                <div className="text-xs text-gray-500 flex items-center gap-2 whitespace-nowrap">
                                    {isSaving ? (
                                        <span className="flex items-center gap-1 text-blue-600"><RefreshCw size={10} className="animate-spin" /> Salvando...</span>
                                    ) : lastSaved ? (
                                        <span className="flex items-center gap-1">
                                            Salvo às {lastSaved.toLocaleTimeString()}
                                        </span>
                                    ) : (
                                        <span>Não salvo</span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            onClick={handleGenerateReport}
                            className="btn btn-primary text-xs px-3 py-2 flex items-center gap-2 whitespace-nowrap"
                        >
                            <Save size={14} /> Salvar e Gerar
                        </button>
                        <button
                            onClick={toggleTheme}
                            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full text-gray-500 dark:text-gray-400 transition-colors"
                            title={theme === 'dark' ? 'Modo Claro' : 'Modo Escuro'}
                        >
                            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
                        </button>
                    </div>
                </div>
            </div>

            <div className="container mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8 px-4">
                {/* Main Editor */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Button to add custom category - moved to top */}
                    {!groupedItems["Itens Adicionais"] && (
                        <button
                            onClick={() => handleAddCustomItem("Itens Adicionais")}
                            className="w-full py-3 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-gray-500 dark:text-gray-400 font-medium hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] transition-colors flex items-center justify-center gap-2 text-sm"
                        >
                            + Adicionar Categoria Personalizada
                        </button>
                    )}
                    {Object.entries(groupedItems).map(([category, catItems]) => {
                        const isCollapsed = collapsedCategories[category];
                        const anyIncluded = catItems.some(i => i.included);
                        const allIncluded = catItems.every(i => i.included);

                        return (
                            <div key={category} className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden mb-4 shadow-sm">
                                <div
                                    className="bg-gray-50 dark:bg-gray-700 px-3 py-2 border-b border-gray-200 dark:border-gray-600 flex justify-between items-center cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                                    onClick={() => toggleCategoryCollapse(category)}
                                >
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                toggleCategoryCollapse(category);
                                            }}
                                            className="text-gray-400 hover:text-gray-600"
                                        >
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                width="14"
                                                height="14"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                className={`transition-transform duration-200 ${isCollapsed ? '-rotate-90' : 'rotate-0'}`}
                                            >
                                                <path d="m6 9 6 6 6-6" />
                                            </svg>
                                        </button>
                                        <h2 className="font-semibold text-sm text-gray-800 capitalize tracking-wide select-none">{category}</h2>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <span className="text-xs font-medium text-gray-900 dark:text-gray-100">
                                            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totals.categoryTotals[category] || 0)}
                                        </span>
                                        <div
                                            className="flex items-center gap-2 text-xs text-gray-500 hover:text-gray-700"
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            <input
                                                type="checkbox"
                                                checked={anyIncluded}
                                                onChange={(e) => toggleCategoryItems(category, !allIncluded)}
                                                className="rounded border-gray-300 text-[var(--color-primary)] focus:ring-[var(--color-primary)] cursor-pointer w-4 h-4"
                                                title={allIncluded ? "Desmarcar todos" : "Marcar todos"}
                                            />
                                        </div>
                                    </div>
                                </div>

                                {!isCollapsed && (
                                    <div className="animate-in fade-in slide-in-from-top-2 duration-200 overflow-x-auto">
                                        <table className="w-full text-xs sm:text-sm text-left min-w-[600px] sm:min-w-0">
                                            <thead className="bg-white dark:bg-gray-700 text-gray-500 dark:text-gray-300 font-medium border-b border-gray-100 dark:border-gray-600">
                                                <tr>
                                                    <th className="px-2 py-1.5 w-8"></th>
                                                    <th className="px-2 py-1.5">Serviço</th>
                                                    <th className="px-2 py-1.5 w-16 text-center">Unid.</th>
                                                    <th className="px-2 py-1.5 w-16 text-center">Qtd.</th>
                                                    <th className="px-2 py-1.5 w-24 text-right">Unit.</th>
                                                    <th className="px-2 py-1.5 w-24 text-right">Total</th>
                                                    <th className="px-2 py-1.5 w-8"></th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-50 dark:divide-gray-700">
                                                {catItems.map(item => (
                                                    <tr
                                                        key={item.id}
                                                        className={`group hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer ${!item.included ? 'opacity-50' : ''}`}
                                                        onClick={() => !item.included && toggleInclude(item.id)}
                                                    >
                                                        <td className="px-2 py-1" onClick={(e) => e.stopPropagation()}>
                                                            <input
                                                                type="checkbox"
                                                                checked={item.included}
                                                                onChange={() => toggleInclude(item.id)}
                                                                className="rounded border-gray-300 text-[var(--color-primary)] focus:ring-[var(--color-primary)] w-3.5 h-3.5"
                                                            />
                                                        </td>
                                                        <td className="px-2 py-1">
                                                            {item.isCustom ? (
                                                                <input
                                                                    type="text"
                                                                    value={item.name}
                                                                    onChange={(e) => handleItemNameChange(item.id, e.target.value)}
                                                                    onClick={(e) => e.stopPropagation()}
                                                                    className="font-medium text-gray-900 dark:text-gray-100 w-full border-none p-0 focus:ring-0 bg-transparent placeholder-gray-400 dark:placeholder-gray-500 text-xs"
                                                                    placeholder="Nome do serviço"
                                                                    autoFocus
                                                                />
                                                            ) : (
                                                                <div className="font-medium text-gray-900 dark:text-gray-100 text-xs">{item.name}</div>
                                                            )}
                                                        </td>
                                                        <td className="px-2 py-1 text-center text-xs" onClick={(e) => e.stopPropagation()}>
                                                            {item.isCustom ? (
                                                                <input
                                                                    type="text"
                                                                    value={item.unit}
                                                                    onChange={(e) => handleUnitChange(item.id, e.target.value)}
                                                                    className="text-center text-gray-500 dark:text-gray-400 w-full border-none p-0 focus:ring-0 bg-transparent placeholder-gray-400 dark:placeholder-gray-500 text-xs"
                                                                    placeholder="un"
                                                                />
                                                            ) : (
                                                                <span className="text-gray-500 dark:text-gray-400">{item.unit}</span>
                                                            )}
                                                        </td>
                                                        <td className="px-2 py-1" onClick={(e) => e.stopPropagation()}>
                                                            <input
                                                                type="number"
                                                                value={item.quantity}
                                                                onChange={(e) => handleQuantityChange(item.id, e.target.value)}
                                                                onFocus={(e) => e.target.select()}
                                                                className="w-full text-center border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded py-0.5 px-1 text-xs focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)]"
                                                                disabled={!item.included}
                                                            />
                                                        </td>
                                                        <td className="px-2 py-1 text-right" onClick={(e) => e.stopPropagation()}>
                                                            <input
                                                                type="number"
                                                                value={item.manualPrice ?? ''}
                                                                placeholder={item.price.toString()}
                                                                onChange={(e) => handleManualPriceChange(item.id, e.target.value)}
                                                                onFocus={(e) => e.target.select()}
                                                                className={`w-full text-right border-gray-200 dark:border-gray-600 rounded py-0.5 px-1 text-xs focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] ${item.manualPrice ? 'bg-yellow-50 border-yellow-200 text-yellow-800 dark:bg-yellow-900/30 dark:border-yellow-700 dark:text-yellow-300' : 'dark:bg-gray-700 dark:text-gray-100'}`}
                                                                disabled={!item.included}
                                                            />
                                                        </td>
                                                        <td className="px-2 py-1 text-right font-medium text-gray-900 dark:text-gray-100 text-xs">
                                                            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(
                                                                (item.manualPrice ?? item.price) * item.quantity
                                                            )}
                                                        </td>
                                                        <td className="px-2 py-1 text-center" onClick={(e) => e.stopPropagation()}>
                                                            {item.isCustom && (
                                                                <button
                                                                    onClick={() => handleDeleteItem(item.id)}
                                                                    className="text-gray-400 hover:text-red-500 transition-colors p-0.5"
                                                                    title="Remover item"
                                                                >
                                                                    <Trash2 size={12} />
                                                                </button>
                                                            )}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                        <div className="p-1.5 border-t border-gray-100 dark:border-gray-600 bg-gray-50 dark:bg-gray-700">
                                            <button
                                                onClick={() => handleAddCustomItem(category)}
                                                className="w-full py-1.5 text-xs text-[var(--color-primary)] font-medium hover:bg-white dark:hover:bg-gray-600 hover:shadow-sm rounded border border-dashed border-[var(--color-primary)]/30 transition-all flex items-center justify-center gap-2"
                                            >
                                                + Adicionar Item
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>

                {/* Sidebar Summary */}
                <div className="lg:col-span-1">
                    <div className="sticky top-24 space-y-6">
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 p-6">
                            <h3 className="font-bold text-gray-900 dark:text-gray-100 mb-4 text-lg">Resumo do Orçamento</h3>

                            <div className="space-y-3 mb-6">
                                <div className="flex justify-between text-gray-600 dark:text-gray-300">
                                    <span>Subtotal</span>
                                    <span>{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totals.subtotal)}</span>
                                </div>

                                <div className="flex justify-between items-center text-gray-600 dark:text-gray-300">
                                    <div className="flex items-center gap-2">
                                        <span>BDI</span>
                                        <div className="flex items-center bg-gray-100 dark:bg-gray-700 rounded px-2">
                                            <input
                                                type="number"
                                                value={bdi}
                                                onChange={(e) => setBdi(parseFloat(e.target.value) || 0)}
                                                className="w-12 bg-transparent border-none text-right text-sm focus:ring-0 p-0 dark:text-gray-100"
                                            />
                                            <span className="text-sm">%</span>
                                        </div>
                                    </div>
                                    <span>{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totals.bdiValue)}</span>
                                </div>

                                <div className="h-px bg-gray-200 dark:bg-gray-600 my-2"></div>

                                <div className="flex justify-between text-xl font-bold text-[var(--color-primary)]">
                                    <span>Total Geral</span>
                                    <span>{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totals.total)}</span>
                                </div>
                            </div>
                        </div>

                        {/* Quick Stats or Tips */}
                        <div className="bg-[var(--color-accent)] dark:bg-gray-700 rounded-lg p-4 border border-[var(--color-primary)]/20 dark:border-gray-600">
                            <h4 className="font-bold text-[var(--color-secondary)] dark:text-gray-200 text-sm mb-2">Dica Profissional</h4>
                            <p className="text-xs text-[var(--color-secondary)]/80 dark:text-gray-300">
                                Itens com valor manual estão destacados em amarelo. Verifique se o BDI está adequado para a região da obra.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div >
    );
}
