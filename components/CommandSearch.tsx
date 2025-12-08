'use client';

import { useState, useEffect, useRef } from 'react';
import { Plus, Loader2, Check, Bot, Send, AlertTriangle, FilePlus, Sparkles } from 'lucide-react';

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
};

type SuggestedItem = {
    name: string;
    unit: string;
    quantity: number;
    price: number;
    category: string;
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

        const itemsToAdd = aiResponse.suggestedBudget.items.map(item => ({
            name: item.name,
            unit: item.unit,
            price: item.price,
            quantity: item.quantity,
            category: item.category,
            manualPrice: item.price
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
        <div className="w-full mb-6" ref={containerRef}>
            <div className="relative group">
                <form onSubmit={handleAiSearch} className="relative">
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => {
                            setQuery(e.target.value);
                            if (aiResponse) setAiResponse(null);
                        }}
                        onFocus={() => query && !aiResponse && setIsOpen(true)}
                        placeholder="✨ Descreva sua obra ou item para a IA (ex: 'Reboco de parede 20m2')..."
                        className="w-full pl-5 pr-12 py-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-blue-300 dark:hover:border-gray-600 focus:border-blue-500 dark:focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all text-base text-gray-700 dark:text-gray-300 placeholder-gray-400 dark:placeholder-gray-500 shadow-sm hover:shadow-md"
                    />

                    <button
                        type="submit"
                        disabled={isAiLoading || !query.trim()}
                        className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
                    >
                        {isAiLoading ? <Loader2 size={18} className="animate-spin" /> : <Sparkles size={18} />}
                    </button>
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
                        <div className="mt-0.5 bg-indigo-100 dark:bg-indigo-900/30 p-1 rounded h-fit text-indigo-600 dark:text-indigo-400 shrink-0">
                            <Bot size={12} />
                        </div>
                        <div className="space-y-3 w-full">
                            <div className="text-[11px] text-gray-700 dark:text-gray-300 whitespace-pre-line leading-relaxed">
                                {aiResponse.text}
                            </div>

                            {aiResponse.suggestedBudget && (
                                <div className="bg-indigo-50/50 dark:bg-indigo-900/10 rounded border border-indigo-200 dark:border-indigo-800/30 p-3">
                                    <div className="flex items-center justify-between mb-2">
                                        <h4 className="font-semibold text-indigo-900 dark:text-indigo-300 text-[11px]">Sugestão de Itens</h4>
                                        <span className="text-[9px] text-indigo-600 dark:text-indigo-400 bg-indigo-100 dark:bg-indigo-900/50 px-1.5 py-0.5 rounded-full font-medium">
                                            {aiResponse.suggestedBudget.items.length} itens
                                        </span>
                                    </div>

                                    <ul className="space-y-1 mb-3 max-h-60 overflow-y-auto">
                                        {aiResponse.suggestedBudget.items.map((item, idx) => (
                                            <li key={idx} className="text-[11px] text-gray-700 dark:text-gray-300 flex justify-between items-center border-b border-indigo-100 dark:border-indigo-800/30 last:border-0 pb-1 last:pb-0">
                                                <div className="flex-1 min-w-0">
                                                    <span className="font-medium">{item.name}</span>
                                                    <div className="text-[9px] text-gray-500 dark:text-gray-500">{item.category}</div>
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
                                        className="w-full py-1.5 bg-indigo-600 dark:bg-indigo-500 hover:bg-indigo-700 dark:hover:bg-indigo-600 text-white rounded text-[11px] font-medium transition-colors flex items-center justify-center gap-1.5"
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
