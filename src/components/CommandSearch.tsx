'use client';

import { useState, useEffect, useRef } from 'react';
import { Search, Plus, Sparkles, Loader2, Check, Bot, Send, AlertTriangle, FilePlus } from 'lucide-react';

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
        aiContext?: { query: string, guidance: string }
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
            guidance: aiResponse.text
        });

        // Reset state
        setQuery('');
        setAiResponse(null);
    };

    return (
        <div className="w-full max-w-2xl mx-auto mb-8" ref={containerRef}>
            <div className="relative group">
                <form onSubmit={handleAiSearch} className="relative">
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => {
                            setQuery(e.target.value);
                            if (aiResponse) setAiResponse(null); // Reset AI response if user types again
                        }}
                        onFocus={() => query && !aiResponse && setIsOpen(true)}
                        placeholder="Buscar item ou pergunte à IA (ex: 'Reboco de parede 20m2')..."
                        className="w-full pl-4 pr-12 py-4 rounded-xl border border-blue-200 dark:border-blue-800 bg-white dark:bg-gray-800 focus:border-[var(--color-primary)] dark:focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/20 outline-none transition-all shadow-sm text-sm text-gray-800 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
                    />

                    <button
                        type="submit"
                        disabled={isAiLoading || !query.trim()}
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-[var(--color-primary)] text-white rounded-lg hover:bg-[var(--color-primary)]/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
                    >
                        {isAiLoading ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
                    </button>
                </form>
            </div>

            {/* Local Search Results Dropdown */}
            {isOpen && filteredItems.length > 0 && !aiResponse && (
                <div className="absolute z-50 mt-2 w-full bg-white dark:bg-gray-800 rounded-xl shadow-2xl ring-1 ring-black ring-opacity-5 overflow-hidden animate-in fade-in zoom-in-95 duration-100">
                    <ul className="max-h-[60vh] overflow-auto py-2">
                        <li className="px-4 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Encontrados na lista atual
                        </li>
                        {filteredItems.map((item) => (
                            <li
                                key={item.id}
                                className="group flex items-center justify-between px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer transition-colors"
                                onClick={() => {
                                    onSelect(item);
                                    setQuery('');
                                    setIsOpen(false);
                                }}
                            >
                                <div className="flex items-center gap-3">
                                    <div className={`p-2 rounded-lg ${item.included ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400' : 'bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400'}`}>
                                        {item.included ? <Check size={16} /> : <Plus size={16} />}
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-900 dark:text-gray-100 text-sm">{item.name}</p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">{item.category}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.manualPrice ?? item.price)}
                                    </p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">{item.unit}</p>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {/* AI Error Message */}
            {aiError && (
                <div className="mt-4 p-3 bg-red-50/80 dark:bg-red-900/20 backdrop-blur-sm text-red-600 dark:text-red-400 rounded-lg text-sm flex items-center gap-2 border border-red-100 dark:border-red-800/50 animate-in fade-in slide-in-from-top-2">
                    <AlertTriangle size={16} />
                    {aiError.includes("Chave de API") ? (
                        <span>
                            Configure sua chave de API do Groq no arquivo <code>.env.local</code>.
                        </span>
                    ) : (
                        <span>{aiError}</span>
                    )}
                </div>
            )}

            {/* AI Response Preview */}
            {aiResponse && (
                <div className="mt-4 bg-white dark:bg-gray-800 rounded-xl p-4 border border-blue-100 dark:border-gray-700 shadow-lg animate-in fade-in slide-in-from-top-2 relative z-40">
                    <div className="flex gap-3">
                        <div className="mt-1 bg-indigo-100 dark:bg-indigo-900/30 p-1.5 rounded-lg h-fit text-indigo-600 dark:text-indigo-400 shrink-0">
                            <Bot size={16} />
                        </div>
                        <div className="space-y-4 w-full">
                            <div className="text-sm text-gray-800 dark:text-gray-200 whitespace-pre-line leading-relaxed font-medium">
                                {aiResponse.text}
                            </div>

                            {aiResponse.suggestedBudget && (
                                <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-lg p-4 border border-indigo-100 dark:border-indigo-800/30">
                                    <div className="flex items-center justify-between mb-3">
                                        <h4 className="font-semibold text-indigo-900 dark:text-indigo-300 text-sm">Sugestão de Itens</h4>
                                        <span className="text-xs text-indigo-600 dark:text-indigo-300 bg-indigo-100 dark:bg-indigo-900/50 px-2 py-1 rounded-full">
                                            {aiResponse.suggestedBudget.items.length} itens
                                        </span>
                                    </div>

                                    <ul className="space-y-2 mb-4 max-h-60 overflow-y-auto">
                                        {aiResponse.suggestedBudget.items.map((item, idx) => (
                                            <li key={idx} className="text-xs text-gray-700 dark:text-gray-300 flex justify-between items-center border-b border-indigo-100 dark:border-indigo-800/30 last:border-0 pb-1 last:pb-0">
                                                <div className="flex-1">
                                                    <span className="font-medium">{item.name}</span>
                                                    <div className="text-[10px] opacity-70">{item.category}</div>
                                                </div>
                                                <div className="text-right ml-2">
                                                    <div className="font-medium">~R$ {item.price}</div>
                                                    <div className="text-[10px] opacity-70">{item.quantity} {item.unit}</div>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>

                                    <button
                                        onClick={handleAddSuggestedItems}
                                        className="w-full py-2 bg-indigo-600 dark:bg-indigo-500 hover:bg-indigo-700 dark:hover:bg-indigo-600 text-white rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2 shadow-sm"
                                    >
                                        <FilePlus size={16} />
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
