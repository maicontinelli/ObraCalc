'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/components/AuthProvider';
import Header from '@/components/Header';
import { DEFAULT_BOQ_CATEGORIES } from '@/lib/constants';
import { Save, Search } from 'lucide-react';

export default function AdminPage() {
    const { user, loading } = useAuth();
    const [catalog, setCatalog] = useState<any[]>([]);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        // Flatten default categories for editing
        const flat = DEFAULT_BOQ_CATEGORIES.flatMap(c => c.items.map(i => ({ ...i, category: c.name })));
        setCatalog(flat);
    }, []);

    const handlePriceChange = (id: string, val: string) => {
        const num = parseFloat(val) || 0;
        setCatalog(prev => prev.map(item => item.id === id ? { ...item, price: num } : item));
    };

    const filteredCatalog = catalog.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading || !user) return null;

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />

            <main className="container mx-auto py-8">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-2xl font-bold text-[var(--color-text)]">Catálogo de Preços</h1>
                        <p className="text-gray-500">Gerencie os valores médios de mercado (Referência)</p>
                    </div>
                    <button className="btn btn-primary">
                        <Save size={16} /> Salvar Alterações
                    </button>
                </div>

                <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                    <div className="p-4 border-b border-gray-200">
                        <div className="relative max-w-md">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            <input
                                type="text"
                                placeholder="Buscar serviço..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                            />
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-gray-50 text-gray-500 font-medium border-b border-gray-200">
                                <tr>
                                    <th className="px-4 py-3">Categoria</th>
                                    <th className="px-4 py-3">Serviço</th>
                                    <th className="px-4 py-3 text-center">Unidade</th>
                                    <th className="px-4 py-3 text-right">Preço Médio (R$)</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {filteredCatalog.map((item) => (
                                    <tr key={item.id} className="hover:bg-gray-50">
                                        <td className="px-4 py-3 text-gray-500">{item.category}</td>
                                        <td className="px-4 py-3 font-medium text-gray-900">{item.name}</td>
                                        <td className="px-4 py-3 text-center text-gray-500">{item.unit}</td>
                                        <td className="px-4 py-3 text-right">
                                            <input
                                                type="number"
                                                value={item.price}
                                                onChange={(e) => handlePriceChange(item.id, e.target.value)}
                                                className="w-24 text-right border border-gray-300 rounded px-2 py-1 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)]"
                                            />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>
        </div>
    );
}
