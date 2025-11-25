'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/components/AuthProvider';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import { Plus, FileText, Clock, Search } from 'lucide-react';
import { supabase } from '@/lib/supabase';

// Mock data for now until we have real data
const MOCK_ESTIMATES = [
    { id: '1', title: 'Construção Nova', client: 'Cliente Exemplo', date: '2023-10-25', total: 45000.00, status: 'Em andamento' },
    { id: '2', title: 'Construção Muro', client: 'Maria Oliveira', date: '2023-10-20', total: 12500.00, status: 'Finalizado' },
];

export default function Dashboard() {
    const { user, loading } = useAuth();
    const router = useRouter();
    const [estimates, setEstimates] = useState<any[]>([]);
    const [isLoadingEstimates, setIsLoadingEstimates] = useState(true);

    useEffect(() => {
        if (!loading && !user) {
            router.push('/');
        } else if (user) {
            // Fetch estimates (mock for now, replace with Supabase call later)
            // const { data } = await supabase.from('orcamento').select('*').eq('user_id', user.id);
            setEstimates(MOCK_ESTIMATES);
            setIsLoadingEstimates(false);
        }
    }, [user, loading, router]);

    const handleNewEstimate = async (type: 'obra_nova' = 'obra_nova') => {
        // Logic to create new estimate and redirect to editor
        // For MVP, just redirect to a new ID with type param
        const newId = crypto.randomUUID();
        // In a real app, we would save the type to the DB here
        router.push(`/editor/${newId}?type=${type}`);
    };

    if (loading || !user) return null;

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />

            <main className="container mx-auto py-8">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-[var(--color-text)]">Meus Orçamentos</h1>
                        <p className="text-gray-500">Gerencie seus projetos e propostas</p>
                    </div>

                    <div className="flex gap-2">

                        <button
                            onClick={() => handleNewEstimate('obra_nova')}
                            className="btn btn-primary shadow-md hover:shadow-lg transition-all"
                        >
                            <Plus size={18} />
                            Obra Nova
                        </button>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                    <div className="p-4 border-b border-gray-200 flex gap-4">
                        <div className="relative flex-1 max-w-md">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            <input
                                type="text"
                                placeholder="Buscar orçamentos..."
                                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent"
                            />
                        </div>
                    </div>

                    {isLoadingEstimates ? (
                        <div className="p-8 text-center text-gray-500">Carregando...</div>
                    ) : estimates.length > 0 ? (
                        <table className="w-full text-left text-sm">
                            <thead className="bg-gray-50 text-gray-500 font-medium border-b border-gray-200">
                                <tr>
                                    <th className="px-6 py-3 w-1/2">Projeto / Cliente</th>
                                    <th className="px-6 py-3">Status</th>
                                    <th className="px-6 py-3 text-right">Data</th>
                                    <th className="px-6 py-3 text-right">Total</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {estimates.map((est) => (
                                    <tr
                                        key={est.id}
                                        onClick={() => router.push(`/editor/${est.id}`)}
                                        className="hover:bg-gray-50 cursor-pointer transition-colors group"
                                    >
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="bg-[var(--color-accent)] p-2 rounded-md text-[var(--color-primary)] group-hover:bg-white group-hover:shadow-sm transition-all">
                                                    <FileText size={20} />
                                                </div>
                                                <div>
                                                    <div className="font-medium text-gray-900">{est.title}</div>
                                                    <div className="text-xs text-gray-500">{est.client}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${est.status === 'Finalizado' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                                                }`}>
                                                {est.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right text-gray-500">
                                            {new Date(est.date).toLocaleDateString('pt-BR')}
                                        </td>
                                        <td className="px-6 py-4 text-right font-medium text-gray-900">
                                            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(est.total)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <div className="p-12 text-center flex flex-col items-center text-gray-500">
                            <FileText size={48} className="text-gray-300 mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 mb-1">Nenhum orçamento encontrado</h3>
                            <p className="mb-6">Comece criando seu primeiro orçamento de obra.</p>
                            <div className="flex gap-3">

                                <button onClick={() => handleNewEstimate('obra_nova')} className="btn btn-primary">
                                    Obra Nova
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
