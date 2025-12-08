'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Plus, Trash2, FileText, Settings, ChevronDown, Sparkles, Loader2 } from 'lucide-react';
import CommandSearch, { BoqItem } from './CommandSearch';
import { BOQ_TEMPLATES } from '@/lib/constants';
import { getDddInfo } from '@/lib/ddd-data';

export default function BoqEditor({ estimateId }: { estimateId: string }) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const type = (searchParams?.get('type') as 'obra_nova') || 'obra_nova';

    const [items, setItems] = useState<BoqItem[]>([]);
    const [bdi, setBdi] = useState(20);
    const [providerName, setProviderName] = useState('');
    const [clientName, setClientName] = useState('');
    const [projectType, setProjectType] = useState('');
    const [deadline, setDeadline] = useState('');
    const [providerPhone, setProviderPhone] = useState('');
    const [clientPhone, setClientPhone] = useState('');
    const [aiRequests, setAiRequests] = useState<any[]>([]);
    const [isSaving, setIsSaving] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);

    const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({});

    // FULL Default Items Template generated from shared constants
    const DEFAULT_ITEMS: BoqItem[] = useMemo(() => {
        return BOQ_TEMPLATES.obra_nova.flatMap(cat =>
            cat.items.map(item => ({
                id: item.id,
                category: cat.name.toUpperCase(), // Normalize to Uppercase for consistency
                name: item.name,
                unit: item.unit,
                quantity: item.quantity || 0,
                price: item.price,
                included: false
            }))
        );
    }, []);

    // Load from localStorage on mount
    useEffect(() => {
        const savedData = localStorage.getItem(`estimate_${estimateId}`);
        if (savedData) {
            try {
                const parsed = JSON.parse(savedData);

                // INTELLIGENT MERGE/RECOVERY Logic
                let loadedItems = parsed.items || [];

                // If the loaded items are using the OLD IDs (def-...), we might want to migrate or just use them.
                // But for AI integration (item_...), we need to ensure we don't discard them.

                const hasStructure = loadedItems.some((i: BoqItem) => i.category.includes('ESTRUTURA') || i.category.includes('Estrutura'));

                // If it looks like a very empty list or broken previous load, merge defaults
                if (loadedItems.length < 10 && !hasStructure) {
                    const mergedItems = [...DEFAULT_ITEMS];

                    // Restore user/AI items
                    loadedItems.forEach((savedItem: BoqItem) => {
                        const index = mergedItems.findIndex(def => def.id === savedItem.id);
                        if (index !== -1) {
                            if (savedItem.quantity > 0 || savedItem.included) {
                                mergedItems[index] = { ...mergedItems[index], ...savedItem };
                            }
                        } else if (savedItem.isCustom || savedItem.included) {
                            // Preserve AI suggestions or custom items
                            mergedItems.push(savedItem);
                        }
                    });

                    loadedItems = mergedItems;
                } else {
                    // Normal load: Ensure category names match current DEFAULT_ITEMS (uppercase) if needed
                    // Or keep as is.
                }

                setItems(loadedItems);
                setBdi(parsed.bdi || 20);
                setProviderName(parsed.providerName || '');
                setClientName(parsed.clientName || '');
                setProjectType(parsed.projectType || '');
                setDeadline(parsed.deadline || '');
                setProviderPhone(parsed.providerPhone || '');
                setClientPhone(parsed.clientPhone || '');
                setAiRequests(parsed.aiRequests || []);

            } catch (e) {
                console.error("Error loading estimate:", e);
                setItems(DEFAULT_ITEMS);
            }
        } else {
            // New estimate: Load defaults
            setItems(DEFAULT_ITEMS);
        }
        setIsLoaded(true);
    }, [estimateId, DEFAULT_ITEMS]);

    // Save to localStorage on change
    useEffect(() => {
        if (!isLoaded) return; // Prevent overwriting with initial empty state

        const dataToSave = {
            id: estimateId,
            items,
            bdi,
            providerName,
            clientName,
            projectType,
            deadline,
            providerPhone,
            clientPhone,
            updatedAt: new Date().toISOString(),
            aiRequests
        };
        localStorage.setItem(`estimate_${estimateId}`, JSON.stringify(dataToSave));

        // Update list of estimates
        const estimatesList = JSON.parse(localStorage.getItem('estimates_list') || '[]');
        if (!estimatesList.find((e: any) => e.id === estimateId)) {
            localStorage.setItem('estimates_list', JSON.stringify([...estimatesList, { id: estimateId, clientName, updatedAt: new Date().toISOString() }]));
        }
    }, [estimateId, items, bdi, providerName, clientName, projectType, deadline, providerPhone, clientPhone, aiRequests, isLoaded]);


    // Handlers
    const toggleInclude = (id: string, forceState?: boolean) => {
        setItems(prev => prev.map(item => {
            if (item.id === id) {
                return { ...item, included: forceState !== undefined ? forceState : !item.included };
            }
            return item;
        }));
    };

    const handleQuantityChange = (id: string, value: string) => {
        const numValue = parseFloat(value);
        setItems(prev => prev.map(item => item.id === id ? { ...item, quantity: isNaN(numValue) ? 0 : numValue, included: true } : item));
    };

    const handlePriceChange = (id: string, value: string) => {
        const numValue = parseFloat(value);
        setItems(prev => prev.map(item => item.id === id ? { ...item, manualPrice: isNaN(numValue) ? 0 : numValue, included: true } : item));
    };

    const handleNameChange = (id: string, name: string) => {
        setItems(prev => prev.map(item => item.id === id ? { ...item, name, included: true } : item));
    };

    const handleUnitChange = (id: string, unit: string) => {
        setItems(prev => prev.map(item => item.id === id ? { ...item, unit, included: true } : item));
    };

    const handleDelete = (id: string) => {
        setItems(items.filter(item => item.id !== id));
    };

    const handleAddCustomItem = (category: string) => {
        const newItem: BoqItem = {
            id: crypto.randomUUID(),
            name: '',
            unit: 'un',
            quantity: 0,
            price: 0,
            category: category,
            included: true,
            isCustom: true
        };
        setItems([...items, newItem]);
    };

    const toggleCategoryItems = (category: string, shouldInclude: boolean) => {
        setItems(items.map(item =>
            item.category === category ? { ...item, included: shouldInclude } : item
        ));
    };

    const toggleCategoryExpansion = (category: string) => {
        setExpandedCategories(prev => ({
            ...prev,
            [category]: !prev[category]
        }));
    };

    const handleGenerateReport = async () => {
        setIsSaving(true);
        // Force save one last time before navigating
        const dataToSave = {
            id: estimateId,
            items,
            bdi,
            providerName,
            clientName,
            projectType,
            deadline,
            providerPhone,
            clientPhone,
            updatedAt: new Date().toISOString(),
            aiRequests
        };
        localStorage.setItem(`estimate_${estimateId}`, JSON.stringify(dataToSave));

        // Small delay to ensure storage write
        await new Promise(resolve => setTimeout(resolve, 500));

        router.push(`/report/${estimateId}`);
    };

    // Calculations
    const includedItems = items.filter(i => i.included);

    const subtotal = useMemo(() =>
        includedItems.reduce((sum, item) => {
            const price = item.manualPrice ?? item.price;
            return sum + (Number(price) * Number(item.quantity));
        }, 0),
        [includedItems]);

    const bdiValue = subtotal * (bdi / 100);
    const total = subtotal + bdiValue;

    // Group items by category
    const groupedItems = useMemo(() => {
        const groups: Record<string, BoqItem[]> = {};

        // Get standard categories from template
        const templateCategories = BOQ_TEMPLATES.obra_nova.map(c => c.name.toUpperCase());

        // Initialize groups
        templateCategories.forEach(cat => {
            groups[cat] = [];
        });

        // Populate items
        items.forEach(item => {
            // If category matches standard (case insensitive check just in case), use it. 
            // Otherwise create new group if needed.
            // But we already normalized to Uppercase in load/add.
            const cat = item.category || 'ITENS ADICIONAIS';
            if (!groups[cat]) groups[cat] = [];
            groups[cat].push(item);
        });

        return groups;
    }, [items]);

    // Get categories maintaining the preferred order: Custom First, then Standard
    const categories = useMemo(() => {
        const defaultCats = BOQ_TEMPLATES.obra_nova.map(c => c.name.toUpperCase());
        const activeCats = Object.keys(groupedItems).filter(cat => groupedItems[cat].length > 0);

        const standard = defaultCats.filter(c => activeCats.includes(c));
        const custom = activeCats.filter(c => !defaultCats.includes(c) && c !== 'ITENS ADICIONAIS');
        const others = activeCats.filter(c => c === 'ITENS ADICIONAIS');

        // Custom (AI) -> Standard -> Others
        return [...custom, ...standard, ...others];
    }, [groupedItems]);

    // Get DDD info for phone numbers
    const providerDddInfo = useMemo(() => getDddInfo(providerPhone), [providerPhone]);
    const clientDddInfo = useMemo(() => getDddInfo(clientPhone), [clientPhone]);

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 font-sans">
            <div className="max-w-[1600px] mx-auto p-6 lg:p-8">

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">

                    {/* LEFT COLUMN: Main Content (2/3) */}
                    <div className="lg:col-span-2 space-y-6">

                        {/* AI Assistant Search Bar */}
                        <div className="mb-2">
                            <CommandSearch
                                items={items}
                                onSelect={(item) => {
                                    // Expand the category where the item is located
                                    setExpandedCategories(prev => ({
                                        ...prev,
                                        [item.category]: true
                                    }));

                                    // Mark the item as included
                                    toggleInclude(item.id, true);

                                    // Focus on the quantity field after a short delay to allow category expansion
                                    setTimeout(() => {
                                        const quantityInput = document.querySelector(`input[data-item-id="${item.id}"]`) as HTMLInputElement;
                                        if (quantityInput) {
                                            quantityInput.focus();
                                            quantityInput.select();
                                        }
                                    }, 150);
                                }}
                                onAddCustom={(newItems, request) => {
                                    const requestId = crypto.randomUUID();
                                    // FORCE Single Group: Use title/query as category for ALL items, ignoring internal categories
                                    const targetCategory = (request?.suggestedTitle || request?.query || 'ITENS ADICIONAIS').toUpperCase();

                                    const itemsWithIds = newItems.map(item => ({
                                        ...item,
                                        id: crypto.randomUUID(),
                                        included: true,
                                        category: targetCategory,
                                        aiRequestId: requestId
                                    }));
                                    setItems(prev => [...itemsWithIds, ...prev]);
                                    if (request) {
                                        setAiRequests(prev => [...prev, { ...request, id: requestId, timestamp: new Date().toISOString() }]);
                                    }
                                }}
                            />
                        </div>

                        {/* Main List Container */}
                        <div className="">
                            {/* Items List Content - Removed divide-y, using space-y for cleaner separation */}
                            <div className="space-y-2">
                                {categories.map((category) => {
                                    const categoryItems = groupedItems[category];
                                    const categoryIncluded = categoryItems.filter(i => i.included).length;
                                    const isExpanded = expandedCategories[category];

                                    // Calculate Category Total
                                    const categoryTotal = categoryItems.reduce((sum, item) => {
                                        if (!item.included) return sum;
                                        const price = item.manualPrice ?? item.price;
                                        return sum + (price * item.quantity);
                                    }, 0);

                                    return (
                                        <div key={category} className="rounded-lg">
                                            {/* Group Header */}
                                            <div className="flex items-center justify-between px-4 py-3 group cursor-pointer hover:bg-gray-50 transition-colors" onClick={() => toggleCategoryExpansion(category)}>
                                                <div className="flex items-center gap-3">
                                                    <ChevronDown
                                                        className={`w-3.5 h-3.5 text-gray-400 transition-transform duration-200 ${!isExpanded ? '-rotate-90' : ''}`}
                                                    />
                                                    <div className="flex items-baseline gap-2">
                                                        <h3 className="text-xs font-bold text-gray-600 uppercase tracking-wide">
                                                            {category}
                                                        </h3>
                                                        <span className="text-[10px] text-gray-400 font-normal">
                                                            ({categoryItems.length})
                                                        </span>
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-3" onClick={(e) => e.stopPropagation()}>
                                                    <span className="text-xs font-bold text-gray-700 tabular-nums">
                                                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(categoryTotal)}
                                                    </span>
                                                    <button
                                                        onClick={() => toggleCategoryItems(category, categoryIncluded < categoryItems.length)}
                                                        className={`w-4 h-4 border rounded transition-colors flex items-center justify-center ${categoryIncluded > 0 // Show check if ANY item is included
                                                            ? 'bg-blue-600 border-blue-600 text-white'
                                                            : 'border-gray-300 bg-white hover:border-gray-400'
                                                            }`}
                                                    >
                                                        {categoryIncluded > 0 && <span className="text-[8px] font-bold">✓</span>}
                                                    </button>
                                                </div>
                                            </div>

                                            {/* Items List (Accordion Body) */}
                                            {isExpanded && (
                                                <div className="pb-4 pt-1 bg-white border-t border-gray-50">
                                                    {/* Column Headers */}
                                                    <div className="grid grid-cols-12 gap-4 mb-2 px-4 text-[9px] font-bold text-gray-400 uppercase tracking-wider">
                                                        <div className="col-span-1"></div>
                                                        <div className="col-span-4">Serviço</div>
                                                        <div className="col-span-1 text-center">Un.</div>
                                                        <div className="col-span-2 text-center">Qtd</div>
                                                        <div className="col-span-2 text-right">Unit</div>
                                                        <div className="col-span-2 text-right">Total</div>
                                                    </div>

                                                    <div className="space-y-0 text-[11px]">
                                                        {categoryItems.map(item => (
                                                            <div
                                                                key={item.id}
                                                                onClick={() => toggleInclude(item.id, true)} // Select on row click
                                                                className={`grid grid-cols-12 gap-4 px-4 py-1 items-center hover:bg-gray-50 transition-colors group/item cursor-pointer ${!item.included ? 'opacity-50' : ''}`}
                                                            >
                                                                {/* Checkbox */}
                                                                <div className="col-span-1 flex justify-center -ml-4" onClick={(e) => e.stopPropagation()}>
                                                                    <input
                                                                        type="checkbox"
                                                                        checked={item.included}
                                                                        onChange={() => toggleInclude(item.id)} // Specific toggle logic
                                                                        className="w-3.5 h-3.5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                                                                    />
                                                                </div>

                                                                {/* Name */}
                                                                <div className="col-span-4">
                                                                    <input
                                                                        type="text"
                                                                        value={item.name}
                                                                        onChange={(e) => handleNameChange(item.id, e.target.value)}
                                                                        className="w-full bg-transparent border-none p-0 text-[11px] font-medium text-gray-600 focus:text-gray-900 focus:ring-0 placeholder-gray-300 leading-tight"
                                                                        placeholder="Nome do item"
                                                                    />
                                                                </div>

                                                                {/* Unit */}
                                                                <div className="col-span-1 text-center">
                                                                    <input
                                                                        type="text"
                                                                        value={item.unit}
                                                                        onChange={(e) => handleUnitChange(item.id, e.target.value)}
                                                                        className="w-full text-center bg-transparent border-none p-0 text-[10px] text-gray-400 uppercase focus:ring-0"
                                                                    />
                                                                </div>

                                                                {/* Qty */}
                                                                <div className="col-span-2 px-2">
                                                                    <input
                                                                        type="number"
                                                                        value={item.quantity}
                                                                        onChange={(e) => handleQuantityChange(item.id, e.target.value)}
                                                                        data-item-id={item.id}
                                                                        className="w-full text-center bg-gray-50 border-none rounded py-1 text-[11px] text-gray-600 focus:text-gray-900 focus:ring-1 focus:ring-blue-500 hover:bg-gray-100 tabular-nums"
                                                                        min="0"
                                                                        step="1"
                                                                    />
                                                                </div>

                                                                {/* Unit Price */}
                                                                <div className="col-span-2 text-right">
                                                                    <input
                                                                        type="number"
                                                                        value={item.manualPrice ?? item.price}
                                                                        onChange={(e) => handlePriceChange(item.id, e.target.value)}
                                                                        className="w-full text-right bg-transparent border-none p-0 text-[11px] text-gray-500 focus:text-gray-900 focus:ring-0 tabular-nums"
                                                                        min="0"
                                                                        step="0.01"
                                                                    />
                                                                </div>

                                                                {/* Total & Trash */}
                                                                <div className="col-span-2 text-right flex items-center justify-end gap-2 group/actions relative">
                                                                    <span className="text-[11px] font-bold text-gray-500 tabular-nums">
                                                                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(
                                                                            (item.manualPrice ?? item.price) * item.quantity
                                                                        )}
                                                                    </span>
                                                                    {item.isCustom && (
                                                                        <button
                                                                            onClick={() => handleDelete(item.id)}
                                                                            className="opacity-0 group-hover/item:opacity-100 text-red-400 hover:text-red-600 p-1 absolute -right-6 md:static transition-all"
                                                                            title="Excluir"
                                                                        >
                                                                            <Trash2 size={14} />
                                                                        </button>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>

                                                    {/* Add Button */}
                                                    <div className="mt-4 flex justify-center border-t border-dashed border-gray-100 pt-4 mx-6">
                                                        <button
                                                            onClick={() => handleAddCustomItem(category)}
                                                            className="flex items-center gap-1 text-[11px] font-bold text-gray-400 hover:text-blue-600 uppercase tracking-widest transition-colors py-2 px-4 rounded hover:bg-blue-50"
                                                        >
                                                            <Plus size={12} /> Adicionar
                                                        </button>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                    </div>

                    {/* RIGHT COLUMN: Sidebar (1/3) */}
                    <div className="lg:col-span-1 space-y-6 lg:sticky lg:top-6">

                        {/* Information Card */}
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-6">
                                Informações do Relatório
                            </h3>

                            <div className="space-y-4">
                                <div>
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-1.5 block">
                                        Prestador *
                                    </label>
                                    <input
                                        type="text"
                                        value={providerName}
                                        onChange={(e) => setProviderName(e.target.value)}
                                        placeholder="Nome ou empresa"
                                        className="w-full bg-gray-50 border border-gray-200 rounded px-3 py-2 text-sm text-gray-700 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all placeholder-gray-400"
                                    />
                                </div>
                                <div>
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-1.5 block">
                                        Telefone Prestador *
                                    </label>
                                    <input
                                        type="text"
                                        value={providerPhone}
                                        onChange={(e) => setProviderPhone(e.target.value)}
                                        placeholder="(00) 00000-0000"
                                        className="w-full bg-gray-50 border border-gray-200 rounded px-3 py-2 text-sm text-gray-700 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all placeholder-gray-400"
                                    />
                                    {providerDddInfo && (
                                        <div className="mt-1.5 text-[10px] text-gray-500 flex items-center gap-1.5">
                                            <span className="font-semibold text-blue-600">{providerDddInfo.state}</span>
                                            <span>•</span>
                                            <span>{providerDddInfo.region}</span>
                                        </div>
                                    )}
                                </div>
                                <div className="pt-2">
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-1.5 block">
                                        Cliente *
                                    </label>
                                    <input
                                        type="text"
                                        value={clientName}
                                        onChange={(e) => setClientName(e.target.value)}
                                        placeholder="Nome completo"
                                        className="w-full bg-gray-50 border border-gray-200 rounded px-3 py-2 text-sm text-gray-700 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all placeholder-gray-400"
                                    />
                                </div>
                                <div>
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-1.5 block">
                                        Telefone Cliente *
                                    </label>
                                    <input
                                        type="text"
                                        value={clientPhone}
                                        onChange={(e) => setClientPhone(e.target.value)}
                                        placeholder="(00) 00000-0000"
                                        className="w-full bg-gray-50 border border-gray-200 rounded px-3 py-2 text-sm text-gray-700 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all placeholder-gray-400"
                                    />
                                    {clientDddInfo && (
                                        <div className="mt-1.5 text-[10px] text-gray-500 flex items-center gap-1.5">
                                            <span className="font-semibold text-blue-600">{clientDddInfo.state}</span>
                                            <span>•</span>
                                            <span>{clientDddInfo.region}</span>
                                        </div>
                                    )}
                                </div>
                                <div className="pt-2">
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-1.5 block">
                                        Tipo de Obra *
                                    </label>
                                    <select
                                        value={projectType}
                                        onChange={(e) => setProjectType(e.target.value)}
                                        className="w-full bg-gray-50 border border-gray-200 rounded px-3 py-2 text-sm text-gray-700 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-gray-500"
                                    >
                                        <option value="">Selecione...</option>
                                        <option value="Construção Nova">Construção Nova</option>
                                        <option value="Reforma">Reforma</option>
                                        <option value="Ampliação">Ampliação</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-1.5 block">
                                        Prazo Estimado *
                                    </label>
                                    <select
                                        value={deadline}
                                        onChange={(e) => setDeadline(e.target.value)}
                                        className="w-full bg-gray-50 border border-gray-200 rounded px-3 py-2 text-sm text-gray-700 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-gray-500"
                                    >
                                        <option value="">Selecione...</option>
                                        <option value="imediato">Imediato (até 30 dias)</option>
                                        <option value="curto">Curto prazo (30 a 90 dias)</option>
                                        <option value="medio">Médio prazo (3 a 6 meses)</option>
                                        <option value="longo">Longo prazo (+6 meses)</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Generate Report Button - Sidebar Position */}
                        <button
                            onClick={handleGenerateReport}
                            disabled={isSaving}
                            className="w-full flex items-center justify-center px-6 py-4 text-base font-bold text-white transition-all duration-200 bg-blue-600 rounded-xl hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600 disabled:opacity-70 disabled:cursor-not-allowed shadow-lg shadow-blue-200"
                        >
                            {isSaving ? (
                                <>
                                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                    Salvando...
                                </>
                            ) : (
                                <>
                                    <FileText className="w-5 h-5 mr-2" />
                                    Gerar Relatório
                                </>
                            )}
                        </button>

                        {/* Totals Summary Card */}
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-6">
                                Resumo do Orçamento
                            </h3>

                            <div className="space-y-4">
                                <div className="flex justify-between items-center text-sm font-bold text-gray-600">
                                    <span>SUBTOTAL</span>
                                    <span>
                                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(subtotal)}
                                    </span>
                                </div>

                                <div className="flex justify-between items-center text-sm font-bold text-gray-600">
                                    <div className="flex items-center gap-2">
                                        <span>BDI</span>
                                        <div className="bg-gray-100 rounded px-2 py-0.5 text-xs text-gray-500 font-mono">
                                            <input
                                                type="number"
                                                value={bdi}
                                                onChange={(e) => setBdi(parseFloat(e.target.value) || 0)}
                                                className="w-8 bg-transparent text-center outline-none"
                                                min="0"
                                                max="100"
                                            />
                                            %
                                        </div>
                                    </div>
                                    <span>
                                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(bdiValue)}
                                    </span>
                                </div>

                                <div className="pt-4 mt-2 border-t border-gray-100 flex justify-between items-center">
                                    <span className="text-sm font-bold text-green-600 uppercase">Total Geral</span>
                                    <span className="text-xl font-bold text-green-600 tabular-nums">
                                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(total)}
                                    </span>
                                </div>
                            </div>
                        </div>

                    </div>

                </div>
            </div>
        </div>
    );
}
