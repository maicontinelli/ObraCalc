'use client';

import { useState, useEffect, useRef } from 'react';
import { Plus, Loader2, Check, Bot, Send, AlertTriangle, FilePlus, Sparkles, Calculator } from 'lucide-react';

export type BoqItem = {
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

type SuggestedItem = {
    name: string;
    unit: string;
    quantity: number;
    price: number;
    category: string;
    included?: boolean;
};

type SuggestedBudget = {
    title: string;
    items: SuggestedItem[];
};

type AiResponse = {
    text: string;
    suggestedBudget?: SuggestedBudget | null;
    error?: string;
};

interface CommandSearchProps {
    items: BoqItem[];
    onSelect: (item: BoqItem) => void;
    onAddCustom: (
        items: Omit<BoqItem, 'id' | 'included' | 'isCustom'>[],
        aiContext?: { query: string, guidance: string, suggestedTitle?: string }
    ) => void;
}

export default function CommandSearch({ items, onSelect, onAddCustom }: CommandSearchProps) {
    const [query, setQuery] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const [filteredItems, setFilteredItems] = useState<BoqItem[]>([]);
    const [isAiLoading, setIsAiLoading] = useState(false);
    const [aiResponse, setAiResponse] = useState<AiResponse | null>(null);
    const [aiError, setAiError] = useState<string | null>(null);

    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                // Only close if not interacting with the AI response
                if (!aiResponse) {
                    setIsOpen(false);
                }
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [aiResponse]);

    // Local search effect
    useEffect(() => {
        if (query.trim() === '') {
            setFilteredItems([]);
            return;
        }

        // Only search locally if we haven't triggered AI mode or if we are typing
        if (!aiResponse) {
            const lowerQuery = query.toLowerCase();
            const matches = items.filter(item =>
                item.name.toLowerCase().includes(lowerQuery)
            ).slice(0, 5);
            setFilteredItems(matches);
            setIsOpen(true);
        }
    }, [query, items, aiResponse]);

    const handleAiSearch = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        if (!query.trim()) return;

        setIsAiLoading(true);
        setAiResponse(null);
        setAiError(null);
        setIsOpen(false); // Close local search dropdown

        try {
            const res = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: query }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Erro ao comunicar com a IA');
            }

            setAiResponse(data);
        } catch (err: any) {
            console.error(err);
            setAiError(err.message || 'Ocorreu um erro inesperado.');
        } finally {
            setIsAiLoading(false);
        }
    };

    const handleAddSuggestedItems = () => {
        if (!aiResponse?.suggestedBudget) return;

        // Only add items that are currently selected/included in the UI state
        // We need to track the selection state of suggested items if we want to allow user to toggle them BEFORE adding.
        // For now, let's assume valid items are those with included=true from the AI response, 
        // OR we can convert this to a local state to let user toggle.

        // Since we didn't add local state for toggling AI items yet, let's just add all of them 
        // but respect the 'included' flag as the initial state in the editor.
        const itemsToAdd = aiResponse.suggestedBudget.items.map(item => ({
            name: item.name,
            unit: item.unit,
            price: item.price,
            quantity: item.quantity,
            category: item.category,
            manualPrice: item.price,
            included: item.included !== undefined ? item.included : true // Pass this through
        }));

        onAddCustom(itemsToAdd, {
            query: query,
            guidance: aiResponse.text,
            suggestedTitle: aiResponse.suggestedBudget.title
        });

        // Reset state
        setQuery('');
        setAiResponse(null);
    };

    return (
        <div className="w-full mb-6 relative" ref={containerRef}>
            <div className="group">
                <form onSubmit={handleAiSearch} className="relative">
                    {/* Spotlight Search Bar with Animated Border */}
                    <div className="relative inline-flex overflow-hidden rounded-xl p-[2px] w-full">
                        <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#F3F4F6_0%,#00BCD4_50%,#F3F4F6_100%)] dark:bg-[conic-gradient(from_90deg_at_50%_50%,#111827_0%,#00BCD4_50%,#111827_100%)]" />
                        <div className="flex items-center relative bg-white dark:bg-gray-950 rounded-xl transition-all duration-300 focus-within:ring-2 focus-within:ring-[#00BCD4]/20 focus-within:shadow-lg w-full z-10">
                            <input
                                type="text"
                                value={query}
                                onChange={(e) => {
                                    setQuery(e.target.value);
                                    if (aiResponse) setAiResponse(null);
                                }}
                                onFocus={() => query && !aiResponse && setIsOpen(true)}
                                placeholder="Adicione outros serviços aqui (ex: 'Reboco de parede 20m2')..."
                                className="w-full pl-5 pr-12 py-4 rounded-xl border-none outline-none bg-transparent text-base text-gray-700 dark:text-gray-300 placeholder-gray-400 dark:placeholder-gray-500"
                            />

                            <button
                                type="submit"
                                disabled={isAiLoading || !query.trim()}
                                className="absolute right-3 p-2 bg-[#00BCD4] text-white hover:bg-[#00ACC1] rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm z-20"
                            >
                                {isAiLoading ? <Loader2 size={18} className="animate-spin" /> : <Calculator size={18} />}
                            </button>
                        </div>
                    </div>
                </form>
            </div>

            {/* Local Search Results Dropdown - Linear Style */}
            {isOpen && filteredItems.length > 0 && !aiResponse && (
                <div className="absolute z-50 mt-1 w-full bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700 shadow-lg overflow-hidden animate-in fade-in duration-100">
                    <ul className="max-h-[60vh] overflow-auto py-1">
                        <li className="px-3 py-1 text-[9px] font-semibold text-gray-500 dark:text-gray-500 uppercase tracking-wider">
                            Encontrados
                        </li>
                        {filteredItems.map((item) => (
                            <li
                                key={item.id}
                                className="group flex items-center justify-between px-3 py-1.5 hover:bg-gray-50/50 dark:hover:bg-gray-800/50 cursor-pointer transition-colors border-b border-gray-50 dark:border-gray-800/50 last:border-0"
                                onClick={() => {
                                    onSelect(item);
                                    setQuery('');
                                    setIsOpen(false);
                                    setAiResponse(null);
                                }}
                            >
                                <div className="flex items-center gap-2 min-w-0 flex-1">
                                    <div className={`p-1 rounded ${item.included ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400' : 'bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400'}`}>
                                        {item.included ? <Check size={10} /> : <Plus size={10} />}
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <p className="font-medium text-gray-700 dark:text-gray-300 text-[11px] truncate">{item.name}</p>
                                        <p className="text-[9px] text-gray-500 dark:text-gray-500 truncate">{item.category}</p>
                                    </div>
                                </div>
                                <div className="text-right flex-shrink-0 ml-2">
                                    <p className="text-[11px] font-semibold text-gray-700 dark:text-gray-300 tabular-nums">
                                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.manualPrice ?? item.price)}
                                    </p>
                                    <p className="text-[9px] text-gray-500 dark:text-gray-500 uppercase font-mono">{item.unit}</p>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {/* AI Error Message - Linear Style */}
            {aiError && (
                <div className="mt-2 p-2 bg-red-50/50 dark:bg-red-900/10 text-red-600 dark:text-red-400 rounded border border-red-200 dark:border-red-800/30 text-[11px] flex items-center gap-1.5 animate-in fade-in duration-100">
                    <AlertTriangle size={12} />
                    {aiError.includes("Chave de API") ? (
                        <span>
                            Configure sua chave de API do Groq no arquivo <code className="text-[10px] bg-red-100 dark:bg-red-900/30 px-1 rounded">.env.local</code>.
                        </span>
                    ) : (
                        <span>{aiError}</span>
                    )}
                </div>
            )}

            {/* AI Response Preview - Linear Style */}
            {aiResponse && (
                <div className="mt-2 bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700 p-3 shadow-md animate-in fade-in duration-100 relative z-40">
                    <div className="flex gap-2">
                        <div className="mt-0.5 bg-orange-100 dark:bg-orange-900/30 p-1 rounded h-fit text-orange-600 dark:text-orange-400 shrink-0">
                            <Bot size={12} />
                        </div>
                        <div className="space-y-3 w-full">
                            <div className="text-[11px] text-gray-700 dark:text-gray-300 whitespace-pre-line leading-relaxed">
                                {aiResponse.text}
                            </div>

                            {aiResponse.suggestedBudget && (
                                <div className="bg-orange-50/50 dark:bg-orange-900/10 rounded border border-orange-200 dark:border-orange-800/30 p-3">
                                    <div className="flex items-center justify-between mb-2">
                                        <h4 className="font-semibold text-orange-900 dark:text-orange-300 text-[11px]">Sugestão de Itens</h4>
                                        <span className="text-[9px] text-orange-600 dark:text-orange-400 bg-orange-100 dark:bg-orange-900/50 px-1.5 py-0.5 rounded-full font-medium">
                                            {aiResponse.suggestedBudget.items.length} itens
                                        </span>
                                    </div>

                                    <ul className="space-y-1 mb-3 max-h-60 overflow-y-auto">
                                        {aiResponse.suggestedBudget.items.map((item, idx) => (
                                            <li key={idx} className={`text-[11px] flex justify-between items-center border-b border-orange-100 dark:border-orange-800/30 last:border-0 pb-1 last:pb-0 ${item.included === false ? 'opacity-60 grayscale' : 'text-gray-700 dark:text-gray-300'}`}>
                                                <div className="flex items-center gap-2 flex-1 min-w-0">
                                                    {/* Show visual indicator if item is optional/unchecked */}
                                                    <div className={`w-1.5 h-1.5 rounded-full ${item.included === false ? 'bg-gray-300 dark:bg-gray-600' : 'bg-orange-500'}`}></div>
                                                    <div className="min-w-0">
                                                        <span className="font-medium">{item.name}</span>
                                                        <div className="text-[9px] text-gray-500 dark:text-gray-500">{item.category}</div>
                                                    </div>
                                                </div>
                                                <div className="text-right ml-2 flex-shrink-0">
                                                    <div className="font-semibold tabular-nums">~R$ {item.price}</div>
                                                    <div className="text-[9px] text-gray-500 dark:text-gray-500 font-mono uppercase">{item.quantity} {item.unit}</div>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>

                                    <button
                                        onClick={handleAddSuggestedItems}
                                        className="w-full py-1.5 bg-orange-600 dark:bg-orange-500 hover:bg-orange-700 dark:hover:bg-orange-600 text-white rounded text-[11px] font-medium transition-colors flex items-center justify-center gap-1.5"
                                    >
                                        <FilePlus size={12} />
                                        Adicionar Itens ao Orçamento
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
