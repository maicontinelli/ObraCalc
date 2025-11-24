'use client';

import { useState } from 'react';
import { Search, Sparkles, X } from 'lucide-react';

interface SmartSearchProps {
    onAddItem: (item: { name: string; unit: string; price: number; quantity: number }) => void;
}

export default function SmartSearch({ onAddItem }: SmartSearchProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [query, setQuery] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [suggestions, setSuggestions] = useState<any[]>([]);

    const handleSearch = async () => {
        if (!query.trim()) return;
        setIsLoading(true);
        setError('');
        setSuggestions([]);
        try {
            const response = await fetch('/api/search-services', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ query }),
            });
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data?.error ?? 'Erro ao buscar serviços');
            }
            setSuggestions(data.suggestions || []);
        } catch (err: any) {
            setError(err.message || 'Erro ao processar busca');
        } finally {
            setIsLoading(false);
        }
    };

    const handleAddSuggestion = (suggestion: any) => {
        onAddItem({
            name: suggestion.name,
            unit: suggestion.unit,
            price: suggestion.price,
            quantity: suggestion.quantity || 1,
        });
        setQuery('');
        setSuggestions([]);
        setIsOpen(false);
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    return (
        <div className="relative">
            {/* Trigger Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all shadow-md hover:shadow-lg"
            >
                <Sparkles size={18} />
                <span className="font-medium">Busca Inteligente</span>
            </button>

            {/* Search Modal */}
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
                        {/* Header */}
                        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-2">
                                    <div className="p-2 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg">
                                        <Sparkles size={20} className="text-white" />
                                    </div>
                                    <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                                        Busca Inteligente com IA
                                    </h2>
                                </div>
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
                                >
                                    <X size={20} className="text-gray-500 dark:text-gray-400" />
                                </button>
                            </div>

                            {/* Search Input */}
                            <div className="relative">
                                <input
                                    type="text"
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                    onKeyPress={handleKeyPress}
                                    placeholder="Ex: preciso de serviços para construir uma piscina"
                                    className="w-full px-4 py-3 pr-12 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-gray-100 placeholder-gray-400"
                                    autoFocus
                                />
                                <button
                                    onClick={handleSearch}
                                    disabled={isLoading || !query.trim()}
                                    className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                                >
                                    <Search size={18} />
                                </button>
                            </div>

                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                                Descreva o que você precisa e a IA sugerirá serviços com preços de referência
                            </p>
                        </div>

                        {/* Results */}
                        <div className="flex-1 overflow-y-auto p-6">
                            {isLoading && (
                                <div className="flex flex-col items-center justify-center py-12">
                                    <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-600 border-t-transparent" />
                                    <p className="mt-4 text-gray-600 dark:text-gray-400">Analisando sua solicitação...</p>
                                </div>
                            )}

                            {error && (
                                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                                    <p className="text-red-800 dark:text-red-300">{error}</p>
                                </div>
                            )}

                            {suggestions.length > 0 && (
                                <div className="space-y-3">
                                    <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-4">
                                        Serviços Sugeridos:
                                    </h3>
                                    {suggestions.map((suggestion, index) => (
                                        <div
                                            key={index}
                                            className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 border border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors cursor-pointer"
                                            onClick={() => handleAddSuggestion(suggestion)}
                                        >
                                            <div className="flex justify-between items-start mb-2">
                                                <h4 className="font-medium text-gray-900 dark:text-gray-100">
                                                    {suggestion.name}
                                                </h4>
                                                <span className="text-lg font-bold text-purple-600 dark:text-purple-400">
                                                    {new Intl.NumberFormat('pt-BR', {
                                                        style: 'currency',
                                                        currency: 'BRL',
                                                    }).format(suggestion.price)}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                                                <span>Unidade: {suggestion.unit}</span>
                                                {suggestion.description && (
                                                    <span className="text-xs">• {suggestion.description}</span>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {!isLoading && !error && suggestions.length === 0 && query && (
                                <div className="text-center py-12">
                                    <Sparkles size={48} className="mx-auto text-gray-300 dark:text-gray-600 mb-4" />
                                    <p className="text-gray-500 dark:text-gray-400">
                                        Nenhum resultado encontrado. Tente reformular sua busca.
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
