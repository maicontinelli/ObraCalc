'use client';

import { useState, useRef, useEffect } from 'react';
import { Sparkles, Send, Bot, Loader2, FilePlus, AlertTriangle, BrainCircuit } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { BOQ_TEMPLATES } from '@/lib/constants';

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

export default function AiAssistant() {
    const router = useRouter();
    const [query, setQuery] = useState('');
    const [response, setResponse] = useState<AiResponse | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const responseRef = useRef<HTMLDivElement>(null);

    // Scroll to response when it appears (only halfway)
    useEffect(() => {
        if (response && responseRef.current) {
            setTimeout(() => {
                const element = responseRef.current;
                if (element) {
                    const elementRect = element.getBoundingClientRect();
                    const absoluteElementTop = elementRect.top + window.pageYOffset;
                    const scrollDistance = absoluteElementTop - window.pageYOffset;
                    const halfwayScroll = scrollDistance / 2;

                    window.scrollBy({
                        top: halfwayScroll,
                        behavior: 'smooth'
                    });
                }
            }, 100);
        }
    }, [response]);

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
        const aiRequestId = crypto.randomUUID();

        // Load default template items
        const template = BOQ_TEMPLATES.obra_nova;

        // Create default items from template (all unchecked)
        const defaultItems = template.flatMap((cat: any) =>
            cat.items.map((item: any) => ({
                id: crypto.randomUUID(),
                ...item,
                category: cat.name,
                included: false,
                quantity: 0,
            }))
        );

        // Create target category name from title or query (Single Group Logic)
        const targetCategory = (response.suggestedBudget.title || query || 'ORÇAMENTO PERSONALIZADO').toUpperCase();

        // Create AI-suggested items
        const aiItems = response.suggestedBudget.items.map(item => ({
            id: crypto.randomUUID(),
            ...item,
            included: item.included !== undefined ? item.included : true, // Use AI suggestion or default to true
            isCustom: true,
            category: targetCategory, // Force single group
            aiRequestId: aiRequestId // Link items to this AI request
        }));

        // Merge: AI items first, then default items
        const allItems = [...aiItems, ...defaultItems];

        const budgetData = {
            id: newId,
            title: response.suggestedBudget.title,
            client: '',
            phone: '',
            date: new Date().toISOString(),
            items: allItems,
            bdi: 20,
            aiRequests: [{
                id: aiRequestId,
                query: query, // Save the original user query
                guidance: response.text, // Save the AI response as guidance
                timestamp: new Date().toISOString()
            }]
        };

        localStorage.setItem(`estimate_${newId}`, JSON.stringify(budgetData));
        router.push(`/editor/${newId}?type=obra_nova`); // Default to obra_nova layout but with custom items
    };

    return (
        <div className="w-full max-w-2xl mx-auto mt-0 mb-8">
            <div className="bg-transparent border border-white/20 dark:border-gray-700/30 rounded-2xl p-6 relative overflow-hidden transition-colors">
                {/* Decorative background element removed */}

                <div className="relative z-10">
                    <form onSubmit={handleSearch} className="relative">
                        {/* Animated border wrapper for search bar */}
                        <div className="relative inline-flex overflow-hidden rounded-xl p-[2px] w-full">
                            <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#F3F4F6_0%,#00BCD4_50%,#F3F4F6_100%)] dark:bg-[conic-gradient(from_90deg_at_50%_50%,#111827_0%,#00BCD4_50%,#111827_100%)]" />
                            <input
                                type="text"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                placeholder="Descreva seu serviço (ex: construir muro de 15m, reformar cozinha, pintar casa)..."
                                className="relative z-10 w-full pl-4 pr-12 py-4 rounded-xl border-0 bg-white dark:bg-gray-950 focus:ring-2 focus:ring-[#00BCD4]/20 dark:focus:ring-[#00BCD4]/20 outline-none transition-all text-sm text-gray-800 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400" />
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading || !query.trim()}
                            className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-[#00BCD4] text-white rounded-lg hover:bg-[#00ACC1] disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm z-20"
                        >
                            {isLoading ? <Loader2 size={18} className="animate-spin" /> : <BrainCircuit size={18} />}
                        </button>
                    </form>




                    <div className="flex flex-wrap justify-center gap-2 mb-6 mt-8">
                        <button
                            type="button"
                            onClick={() => {
                                const newId = crypto.randomUUID();
                                router.push(`/editor/${newId}?type=obra_nova`);
                            }}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#00BCD4]/10 dark:bg-[#00BCD4]/20 text-[#00BCD4] dark:text-[#00BCD4] text-xs font-semibold uppercase tracking-wide hover:bg-[#00BCD4]/20 dark:hover:bg-[#00BCD4]/30 transition-all border border-[#00BCD4]/30"
                        >
                            <FilePlus size={14} />
                            Orçamento
                        </button>
                        <button
                            type="button"
                            onClick={() => router.push('/topografia')}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-500/10 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 text-xs font-semibold uppercase tracking-wide hover:bg-blue-500/20 dark:hover:bg-blue-500/30 transition-all border border-blue-500/30"
                        >
                            <Sparkles size={14} />
                            Topografia
                        </button>
                        <button
                            type="button"
                            onClick={() => router.push('/relatorio-fotografico')}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-purple-500/10 dark:bg-purple-500/20 text-purple-600 dark:text-purple-400 text-xs font-semibold uppercase tracking-wide hover:bg-purple-500/20 dark:hover:bg-purple-500/30 transition-all border border-purple-500/30"
                        >
                            <Bot size={14} />
                            Relatório Foto
                        </button>
                    </div>

                    {error && (
                        <div className="mt-4 p-3 bg-red-50/80 dark:bg-red-900/20 backdrop-blur-sm text-red-600 dark:text-red-400 rounded-lg text-sm flex items-center gap-2 border border-red-100 dark:border-red-800/50">
                            <AlertTriangle size={16} />
                            {error.includes("Chave de API") ? (
                                <span>
                                    Configure sua chave de API do Groq no arquivo <code>.env.local</code> como <code>GROQ_API_KEY=sua_chave</code>.
                                </span>
                            ) : (
                                <span>{error}</span>
                            )}
                        </div>
                    )}

                    {response && (
                        <div ref={responseRef} className="mt-6 bg-white/40 dark:bg-gray-800/40 backdrop-blur-md rounded-xl p-4 border border-white/20 dark:border-gray-700/30 animate-in fade-in slide-in-from-bottom-2 shadow-sm">
                            <div className="flex gap-3">
                                <div className="mt-1 bg-orange-100/80 dark:bg-orange-900/30 p-1.5 rounded-lg h-fit text-orange-600 dark:text-orange-400 shrink-0 backdrop-blur-sm">
                                    <Bot size={16} />
                                </div>
                                <div className="space-y-4 w-full">
                                    <div className="text-sm text-gray-800 dark:text-gray-200 whitespace-pre-line leading-relaxed font-medium">
                                        {response.text}
                                    </div>

                                    {response.suggestedBudget && (
                                        <div className="bg-orange-50/40 dark:bg-orange-900/20 rounded-lg p-4 border border-orange-100/50 dark:border-orange-800/30 backdrop-blur-sm">
                                            <div className="flex items-center justify-between mb-3">
                                                <h4 className="font-semibold text-orange-900 dark:text-orange-300 text-sm">Orçamento Sugerido</h4>
                                                <span className="text-xs text-orange-600 dark:text-orange-300 bg-orange-100/50 dark:bg-orange-900/50 px-2 py-1 rounded-full">
                                                    {response.suggestedBudget.items.length} itens identificados
                                                </span>
                                            </div>

                                            <ul className="space-y-2 mb-4">
                                                {response.suggestedBudget.items.slice(0, 3).map((item, idx) => (
                                                    <li key={idx} className="text-xs text-gray-700 dark:text-gray-300 flex justify-between">
                                                        <span>{item.name}</span>
                                                        <span className="font-medium">~R$ {item.price}</span>
                                                    </li>
                                                ))}
                                                {response.suggestedBudget.items.length > 3 && (
                                                    <li className="text-xs text-gray-500 dark:text-gray-400 italic">...e mais {response.suggestedBudget.items.length - 3} itens</li>
                                                )}
                                            </ul>

                                            <button
                                                onClick={handleCreateBudget}
                                                className="w-full py-2 bg-orange-500 dark:bg-orange-600 hover:bg-orange-600 dark:hover:bg-orange-700 text-white rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2 shadow-sm"
                                            >
                                                <FilePlus size={16} />
                                                Criar orçamento com estes itens
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
