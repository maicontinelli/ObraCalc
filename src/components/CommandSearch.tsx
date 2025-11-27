'use client';

import { useState, useEffect, useRef } from 'react';
import { Search, Plus, Sparkles, Loader2, Check } from 'lucide-react';

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

interface CommandSearchProps {
    items: BoqItem[];
    onSelect: (item: BoqItem) => void;
    onAddCustom: (item: Omit<BoqItem, 'id' | 'quantity' | 'included' | 'isCustom'>) => void;
}

export default function CommandSearch({ items, onSelect, onAddCustom }: CommandSearchProps) {
    const [query, setQuery] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const [filteredItems, setFilteredItems] = useState<BoqItem[]>([]);
    const [isAiLoading, setIsAiLoading] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        if (query.trim() === '') {
            setFilteredItems([]);
            return;
        }

        const lowerQuery = query.toLowerCase();
        const matches = items.filter(item =>
            item.name.toLowerCase().includes(lowerQuery)
        ).slice(0, 5); // Limit to 5 local results

        setFilteredItems(matches);
        setIsOpen(true);
    }, [query, items]);

    const handleAiCreate = async () => {
        if (!query.trim()) return;

        setIsAiLoading(true);
        try {
            const response = await fetch('/api/suggest-item', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ query }),
            });

            if (!response.ok) throw new Error('Falha na requisição');

            const data = await response.json();

            onAddCustom({
                name: data.name,
                unit: data.unit,
                price: data.price,
                category: data.category || 'Itens Adicionais',
                manualPrice: data.price
            });

            setQuery('');
            setIsOpen(false);
        } catch (error) {
            console.error(error);
            alert('Erro ao gerar item com IA. Tente novamente.');
        } finally {
            setIsAiLoading(false);
        }
    };

    return (
        <div className="relative w-full max-w-2xl mx-auto mb-8" ref={containerRef}>
            <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400 group-focus-within:text-[var(--color-primary)] transition-colors" />
                </div>
                <input
                    type="text"
                    className="block w-full pl-11 pr-4 py-4 bg-white dark:bg-gray-800 border-0 rounded-xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.1)] ring-1 ring-gray-200 dark:ring-gray-700 focus:ring-2 focus:ring-[var(--color-primary)] placeholder:text-gray-400 dark:placeholder-gray-500 text-gray-900 dark:text-gray-100 sm:text-sm sm:leading-6 transition-all"
                    placeholder="Buscar item ou criar com IA..."
                    value={query}
                    onChange={(e) => {
                        setQuery(e.target.value);
                        setIsOpen(true);
                    }}
                    onFocus={() => query && setIsOpen(true)}
                />
                {query && (
                    <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
                        <kbd className="hidden sm:inline-block px-2 py-0.5 text-xs font-medium text-gray-400 bg-gray-100 dark:bg-gray-700 rounded border border-gray-200 dark:border-gray-600">
                            ESC
                        </kbd>
                    </div>
                )}
            </div>

            {isOpen && (query || filteredItems.length > 0) && (
                <div className="absolute z-50 mt-2 w-full bg-white dark:bg-gray-800 rounded-xl shadow-2xl ring-1 ring-black ring-opacity-5 overflow-hidden animate-in fade-in zoom-in-95 duration-100">
                    <ul className="max-h-[60vh] overflow-auto py-2">
                        {filteredItems.length > 0 && (
                            <>
                                <li className="px-4 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    Encontrados na lista
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
                                <li className="h-px bg-gray-100 dark:bg-gray-700 my-2" role="separator" />
                            </>
                        )}

                        {query && (
                            <li
                                className="px-2"
                                onClick={handleAiCreate}
                            >
                                <div className="flex items-center gap-3 px-4 py-3 rounded-lg bg-gradient-to-r from-[var(--color-primary)]/5 to-[var(--color-primary)]/10 hover:from-[var(--color-primary)]/10 hover:to-[var(--color-primary)]/20 cursor-pointer transition-all border border-[var(--color-primary)]/20 group">
                                    <div className="p-2 rounded-lg bg-[var(--color-primary)]/10 text-[var(--color-primary)] group-hover:scale-110 transition-transform">
                                        {isAiLoading ? <Loader2 size={18} className="animate-spin" /> : <Sparkles size={18} />}
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-medium text-[var(--color-primary)] text-sm">
                                            {isAiLoading ? 'Criando sugestão...' : `Criar item "${query}" com IA`}
                                        </p>
                                        <p className="text-xs text-[var(--color-primary)]/70">
                                            Sugere preço e categoria automaticamente
                                        </p>
                                    </div>
                                    {!isAiLoading && (
                                        <div className="text-[var(--color-primary)] opacity-0 group-hover:opacity-100 transition-opacity">
                                            <ArrowRightIcon />
                                        </div>
                                    )}
                                </div>
                            </li>
                        )}
                    </ul>
                </div>
            )}
        </div>
    );
}

function ArrowRightIcon() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14" />
            <path d="m12 5 7 7-7 7" />
        </svg>
    );
}
