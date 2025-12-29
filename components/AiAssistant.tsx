'use client';

import { useState, useRef, useEffect } from 'react';
import { Sparkles, Send, Bot, Loader2, FilePlus, AlertTriangle, BrainCircuit, Map, Camera, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { BOQ_TEMPLATES } from '@/lib/constants';

type SuggestedItem = {
    name: string;
    unit: string;
    quantity: number;
    price: number;
    category: string;
    included?: boolean;
    type?: 'material' | 'service' | 'equipment';
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
                    <form onSubmit={handleSearch} className="relative group z-20">
                        <div className="relative flex items-center w-full rounded-full transition-all duration-300
                            bg-white/70 dark:bg-gray-900/60 
                            backdrop-blur-xl 
                            border border-white/50 dark:border-gray-700/50
                            shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)]
                            hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] hover:bg-white/90 dark:hover:bg-gray-900/80
                            focus-within:ring-4 focus-within:ring-[#FF6600]/10 focus-within:border-[#FF6600]/50"
                        >
                            <div className="pl-6 text-gray-400 dark:text-gray-500">
                                <Sparkles size={20} className="animate-pulse text-[#FF6600]" />
                            </div>
                            <input
                                type="text"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                placeholder="O que vamos orçar hoje? (ex: Pintura de parede 20m2)"
                                className="w-full pl-4 pr-14 py-5 rounded-full border-none outline-none bg-transparent text-lg text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 font-medium"
                            />

                            <button
                                type="submit"
                                disabled={isLoading || !query.trim()}
                                className="absolute right-2 top-1/2 -translate-y-1/2 p-3 bg-gray-100/50 dark:bg-gray-800/50 text-gray-400 dark:text-gray-500 hover:text-[#FF6600] dark:hover:text-[#FF6600] hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-all duration-300"
                            >
                                {isLoading ? <Loader2 size={20} className="animate-spin" /> : <ArrowRight size={20} />}
                            </button>
                        </div>
                    </form>






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
                                                {response.suggestedBudget.items
                                                    .sort((a, b) => (a.type === 'service' ? -1 : 1))
                                                    .map((item, idx) => (
                                                        <li key={idx} className="text-xs text-gray-700 dark:text-gray-300 flex justify-between items-center bg-white/50 dark:bg-black/20 px-2 py-1.5 rounded">
                                                            <div className="flex items-center gap-2 overflow-hidden">
                                                                <span title={item.type === 'service' ? 'Serviço' : 'Material'} className="text-[10px] shrink-0 opacity-70">
                                                                    {item.type === 'service' ? '🔨' : '🧱'}
                                                                </span>
                                                                <span className="truncate">{item.name}</span>
                                                            </div>
                                                            <span className="font-medium shrink-0 ml-2">~R$ {item.price}</span>
                                                        </li>
                                                    ))}
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
