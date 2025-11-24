'use client';

import { useState } from 'react';
import { Sparkles, Send, Bot, Loader2, FilePlus, AlertTriangle } from 'lucide-react';
import { useRouter } from 'next/navigation';

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

export default function AiAssistant() {
    const router = useRouter();
    const [query, setQuery] = useState('');
    const [response, setResponse] = useState<AiResponse | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!query.trim()) return;

        setIsLoading(true);
        setResponse(null);
        setError(null);

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

            setResponse(data);
        } catch (err: any) {
            console.error(err);
            setError(err.message || 'Ocorreu um erro inesperado.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleCreateBudget = () => {
        if (!response?.suggestedBudget) return;

        const newId = crypto.randomUUID();
        const budgetData = {
            id: newId,
            title: response.suggestedBudget.title,
            client: '',
            date: new Date().toISOString(),
            items: response.suggestedBudget.items.map(item => ({
                id: crypto.randomUUID(),
                ...item,
                included: true,
                isCustom: true // Mark as custom so they can be edited/deleted easily
            })),
            bdi: 20,
        };

        localStorage.setItem(`estimate_${newId}`, JSON.stringify(budgetData));
        router.push(`/editor/${newId}?type=obra_nova`); // Default to obra_nova layout but with custom items
    };

    return (
        <div className="w-full max-w-2xl mx-auto mt-12 mb-8">
            <div className="bg-gradient-to-br from-indigo-50 to-white border border-indigo-100 rounded-2xl p-6 shadow-lg relative overflow-hidden">
                {/* Decorative background element */}
                <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                    <Bot size={100} />
                </div>

                <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-4 text-indigo-600 font-semibold">
                        <Sparkles size={20} />
                        <h3>Assistente IA de Construção</h3>
                    </div>

                    <p className="text-gray-600 mb-6 text-sm">
                        Tire suas dúvidas técnicas ou peça uma estimativa (ex: "Quanto custa reformar um banheiro de 5m²?")
                    </p>

                    <form onSubmit={handleSearch} className="relative">
                        <input
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Pergunte sobre materiais, normas ou custos..."
                            className="w-full pl-4 pr-12 py-3 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all shadow-sm text-gray-800 placeholder-gray-400"
                        />
                        <button
                            type="submit"
                            disabled={isLoading || !query.trim()}
                            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            {isLoading ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
                        </button>
                    </form>

                    {error && (
                        <div className="mt-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm flex items-center gap-2">
                            <AlertTriangle size={16} />
                            {error.includes("Chave de API") ? (
                                <span>
                                    Configure sua chave de API do Gemini no arquivo <code>.env.local</code> como <code>GEMINI_API_KEY=sua_chave</code>.
                                </span>
                            ) : (
                                <span>{error}</span>
                            )}
                        </div>
                    )}

                    {response && (
                        <div className="mt-6 bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-indigo-50 animate-in fade-in slide-in-from-bottom-2">
                            <div className="flex gap-3">
                                <div className="mt-1 bg-indigo-100 p-1.5 rounded-lg h-fit text-indigo-600 shrink-0">
                                    <Bot size={16} />
                                </div>
                                <div className="space-y-4 w-full">
                                    <div className="text-sm text-gray-700 whitespace-pre-line leading-relaxed">
                                        {response.text}
                                    </div>

                                    {response.suggestedBudget && (
                                        <div className="bg-indigo-50/50 rounded-lg p-4 border border-indigo-100">
                                            <div className="flex items-center justify-between mb-3">
                                                <h4 className="font-semibold text-indigo-900 text-sm">Orçamento Sugerido</h4>
                                                <span className="text-xs text-indigo-600 bg-indigo-100 px-2 py-1 rounded-full">
                                                    {response.suggestedBudget.items.length} itens identificados
                                                </span>
                                            </div>

                                            <ul className="space-y-2 mb-4">
                                                {response.suggestedBudget.items.slice(0, 3).map((item, idx) => (
                                                    <li key={idx} className="text-xs text-gray-600 flex justify-between">
                                                        <span>{item.name}</span>
                                                        <span className="font-medium">~R$ {item.price}</span>
                                                    </li>
                                                ))}
                                                {response.suggestedBudget.items.length > 3 && (
                                                    <li className="text-xs text-gray-400 italic">...e mais {response.suggestedBudget.items.length - 3} itens</li>
                                                )}
                                            </ul>

                                            <button
                                                onClick={handleCreateBudget}
                                                className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
                                            >
                                                <FilePlus size={16} />
                                                Criar Projeto com estes Itens
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
