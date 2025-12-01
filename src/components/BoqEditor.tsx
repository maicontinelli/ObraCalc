'use client';

import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { BOQ_TEMPLATES } from '@/lib/constants';
import { Save, Trash2, Sparkles } from 'lucide-react';
import { useRouter } from 'next/navigation';
import CommandSearch from './CommandSearch';


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
    aiRequestId?: string;
};

export default function BoqEditor({ estimateId }: { estimateId: string }) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const type = (searchParams?.get('type') as 'obra_nova') || 'obra_nova';

    const [items, setItems] = useState<BoqItem[]>([]);
    const [bdi, setBdi] = useState(20); // Default 20%

    const [projectName, setProjectName] = useState('Serviço');
    const [clientName, setClientName] = useState('');
    const [clientPhone, setClientPhone] = useState('');

    const [collapsedCategories, setCollapsedCategories] = useState<Record<string, boolean>>({});

    const [aiRequests, setAiRequests] = useState<{ id: string, query: string, guidance: string, timestamp: string }[]>([]);

    const [showValidationMessage, setShowValidationMessage] = useState(false);

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
                    if (parsed.phone) setClientPhone(parsed.phone);
                    if (parsed.aiRequests) setAiRequests(parsed.aiRequests);


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

    const formatPhoneNumber = (value: string) => {
        // Remove tudo que não é número
        const numbers = value.replace(/\D/g, '');

        // Limita a 11 dígitos (DDD + 9 dígitos)
        const limited = numbers.slice(0, 11);

        // Aplica a máscara
        if (limited.length <= 2) {
            return limited;
        } else if (limited.length <= 6) {
            return `(${limited.slice(0, 2)}) ${limited.slice(2)}`;
        } else if (limited.length <= 10) {
            return `(${limited.slice(0, 2)}) ${limited.slice(2, 6)}-${limited.slice(6)}`;
        } else {
            return `(${limited.slice(0, 2)}) ${limited.slice(2, 7)}-${limited.slice(7)}`;
        }
    };

    const handlePhoneChange = (value: string) => {
        const formatted = formatPhoneNumber(value);
        setClientPhone(formatted);
    };

    const isValidPhone = (phone: string) => {
        // Remove caracteres não numéricos
        const numbers = phone.replace(/\D/g, '');
        // Verifica se tem 10 ou 11 dígitos (com ou sem 9 no celular)
        return numbers.length >= 10 && numbers.length <= 11;
    };

    const handleSave = async () => {
        try {
            // Save to localStorage
            const estimateData = {
                id: estimateId,
                title: projectName,
                client: clientName,
                phone: clientPhone,
                date: new Date().toISOString(),
                items: items,
                bdi: bdi,
                aiRequests: aiRequests
            };
            localStorage.setItem(`estimate_${estimateId}`, JSON.stringify(estimateData));
        } catch (error) {
            console.error('Error saving estimate:', error);
            alert('Erro ao salvar localmente.');
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

    const handleSearchSelect = (item: BoqItem) => {
        setItems(prev => prev.map(i => {
            if (i.id === item.id) {
                return { ...i, included: true };
            }
            return i;
        }));

        // Expand the category of the selected item
        setCollapsedCategories(prev => ({
            ...prev,
            [item.category]: false
        }));
    };

    const handleAiAdd = (
        newItemData: Omit<BoqItem, 'id' | 'included' | 'isCustom'> | Omit<BoqItem, 'id' | 'included' | 'isCustom'>[],
        aiContext?: { query: string, guidance: string }
    ) => {
        const itemsToAdd = Array.isArray(newItemData) ? newItemData : [newItemData];

        let aiRequestId: string | undefined;

        if (aiContext) {
            aiRequestId = crypto.randomUUID();
            setAiRequests(prev => [...prev, {
                id: aiRequestId!,
                query: aiContext.query,
                guidance: aiContext.guidance,
                timestamp: new Date().toISOString()
            }]);
        }

        const newItems: BoqItem[] = itemsToAdd.map(data => ({
            id: crypto.randomUUID(),
            name: data.name,
            unit: data.unit,
            price: data.price,
            quantity: data.quantity || 1,
            manualPrice: data.price,
            included: true,
            category: data.category || "Itens Adicionais",
            isCustom: true,
            aiRequestId: aiRequestId // Link to the AI request
        }));

        setItems(prev => [...newItems, ...prev]);

        // Expand categories for new items
        setCollapsedCategories(prev => {
            const newCollapsed = { ...prev };
            newItems.forEach(item => {
                newCollapsed[item.category] = false;
            });
            return newCollapsed;
        });
    };



    const handleGenerateReport = async () => {
        if (!clientName.trim()) {
            setShowValidationMessage(true);
            setTimeout(() => setShowValidationMessage(false), 5000);
            return;
        }

        if (!clientPhone.trim() || !isValidPhone(clientPhone)) {
            setShowValidationMessage(true);
            setTimeout(() => setShowValidationMessage(false), 5000);
            return;
        }

        // 1. Save to LocalStorage
        await handleSave();

        // 2. Navigate to report page
        router.push(`/report/${estimateId}`);
    };



    return (
        <div className="pb-20 dark:bg-gray-900">
            {/* Toolbar */}
            {/* Toolbar */}
            <div className="sticky top-16 z-40 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm mb-6 transition-all">
                <div className="container mx-auto py-2 flex flex-wrap sm:flex-nowrap justify-between items-center gap-4 px-4">
                    <div className="flex items-center gap-3 flex-1 w-full min-w-0 overflow-hidden">
                        <input
                            type="text"
                            value={projectName}
                            onChange={(e) => setProjectName(e.target.value)}
                            className="text-sm text-gray-500 dark:text-gray-400 dark:bg-gray-800 border border-gray-200 dark:border-gray-600 p-1 rounded focus:ring-0 w-auto min-w-[120px] max-w-[200px] placeholder-gray-400 dark:placeholder-gray-500 truncate"
                            placeholder="Nome do Projeto"
                        />
                        <span className="text-gray-300 dark:text-gray-600 text-sm flex-shrink-0">/</span>
                        <div className="flex items-center gap-1 flex-1 min-w-0">
                            <input
                                type="text"
                                value={clientName}
                                onChange={(e) => setClientName(e.target.value)}
                                className={`text-sm dark:bg-gray-800 p-1 rounded focus:ring-0 flex-1 min-w-[100px] placeholder-gray-400 dark:placeholder-gray-500 truncate transition-all ${showValidationMessage && !clientName.trim()
                                    ? 'border-2 border-yellow-400 dark:border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20 text-gray-900 dark:text-gray-100'
                                    : 'text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-gray-600'
                                    }`}
                                placeholder="Empresa *"
                                required
                            />
                        </div>
                        <span className="text-gray-300 dark:text-gray-600 text-sm flex-shrink-0">/</span>
                        <div className="flex items-center gap-1 flex-1 min-w-0">
                            <input
                                type="tel"
                                value={clientPhone}
                                onChange={(e) => handlePhoneChange(e.target.value)}
                                className={`text-sm dark:bg-gray-800 p-1 rounded focus:ring-0 flex-1 min-w-[100px] placeholder-gray-400 dark:placeholder-gray-500 truncate transition-all ${showValidationMessage && !clientPhone.trim()
                                    ? 'border-2 border-yellow-400 dark:border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20 text-gray-900 dark:text-gray-100'
                                    : 'text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-gray-600'
                                    }`}
                                placeholder="Telefone *"
                                required
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            onClick={handleGenerateReport}
                            className="btn btn-primary text-xs p-2 flex items-center justify-center"
                            title="Salvar e Gerar Relatório"
                        >
                            <Save size={16} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Validation Message Dropdown */}
            {showValidationMessage && (
                <div className="container mx-auto px-4 -mt-4 mb-4">
                    <div className="bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-400 dark:border-yellow-600 p-4 rounded-r-lg shadow-md animate-in slide-in-from-top-2 fade-in">
                        <div className="flex items-start gap-3">
                            <div className="flex-shrink-0">
                                <svg className="h-5 w-5 text-yellow-400 dark:text-yellow-500" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div className="flex-1">
                                <h3 className="text-sm font-semibold text-yellow-800 dark:text-yellow-200 mb-1">
                                    Informações obrigatórias
                                </h3>
                                <p className="text-sm text-yellow-700 dark:text-yellow-300">
                                    Por favor, preencha o <strong>nome do cliente</strong> e o <strong>telefone</strong> para gerar o relatório.
                                </p>
                            </div>
                            <button
                                onClick={() => setShowValidationMessage(false)}
                                className="flex-shrink-0 text-yellow-400 hover:text-yellow-600 dark:text-yellow-500 dark:hover:text-yellow-300"
                            >
                                <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="container mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8 px-4">
                {/* Main Editor */}
                <div className="lg:col-span-2 space-y-6">

                    <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-md border-2 border-blue-500/50 dark:border-blue-400/50 mb-8 ring-4 ring-blue-500/10 dark:ring-blue-400/10 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
                            <Sparkles className="w-24 h-24 text-blue-500" />
                        </div>

                        <div className="flex items-center gap-2 mb-3 relative z-10">
                            <div className="p-1.5 bg-blue-100 dark:bg-blue-900/50 rounded-lg">
                                <Sparkles className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                            </div>
                            <span className="text-sm font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                                Assistente IA de Construção
                            </span>
                        </div>

                        <div className="relative z-10">
                            <CommandSearch
                                items={items}
                                onSelect={handleSearchSelect}
                                onAddCustom={handleAiAdd}
                            />
                        </div>
                    </div>

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
                                        <h2 className="font-semibold text-sm text-gray-800 dark:text-white capitalize tracking-wide select-none">{category}</h2>
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
                    {/* Button to add custom category - moved to bottom */}
                    {!groupedItems["Itens Adicionais"] && (
                        <button
                            onClick={() => handleAddCustomItem("Itens Adicionais")}
                            className="w-full py-3 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-gray-500 dark:text-gray-400 font-medium hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] transition-colors flex items-center justify-center gap-2 text-sm"
                        >
                            + Adicionar Categoria Personalizada
                        </button>
                    )}
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
