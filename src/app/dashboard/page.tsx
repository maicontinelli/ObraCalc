'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Plus, FileText, DollarSign, Calendar, TrendingUp, Crown, Eye, Edit, Trash2, User, Save, X } from 'lucide-react';

interface Estimate {
    id: string;
    title: string;
    date: string;
    total: number;
}

interface UserData {
    fullName: string;
    address: string;
    city: string;
    state: string;
    phone: string;
    email: string;
    userType: string;
}

export default function Dashboard() {
    const router = useRouter();
    const [estimates, setEstimates] = useState<Estimate[]>([]);
    const [stats, setStats] = useState({
        total: 0,
        value: 0,
        thisMonth: 0
    });
    const [activityData] = useState(() => [
        { label: 'Segunda', value: Math.floor(Math.random() * 10) },
        { label: 'Terça', value: Math.floor(Math.random() * 10) },
        { label: 'Quarta', value: Math.floor(Math.random() * 10) },
        { label: 'Quinta', value: Math.floor(Math.random() * 10) },
        { label: 'Sexta', value: Math.floor(Math.random() * 10) }
    ]);
    const [growthRate] = useState(() => Math.floor(Math.random() * 30));

    const [userData, setUserData] = useState<UserData>({
        fullName: '',
        address: '',
        city: '',
        state: '',
        phone: '',
        email: '',
        userType: ''
    });
    const [isEditingProfile, setIsEditingProfile] = useState(false);
    const [tempUserData, setTempUserData] = useState<UserData>(userData);

    const loadUserData = () => {
        const saved = localStorage.getItem('user_profile_data');
        if (saved) {
            const data = JSON.parse(saved);
            setUserData(data);
            setTempUserData(data);
        }
    };

    const saveUserData = () => {
        localStorage.setItem('user_profile_data', JSON.stringify(tempUserData));
        setUserData(tempUserData);
        setIsEditingProfile(false);
    };

    const cancelEdit = () => {
        setTempUserData(userData);
        setIsEditingProfile(false);
    };

    const loadEstimates = () => {
        const allEstimates: Estimate[] = [];
        let totalValue = 0;
        let thisMonthCount = 0;
        const currentMonth = new Date().getMonth();

        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key?.startsWith('estimate_')) {
                const data = localStorage.getItem(key);
                if (data) {
                    const parsed = JSON.parse(data);
                    const estimateDate = new Date(parsed.date);

                    let subtotal = 0;
                    parsed.items?.forEach((item: { included: boolean; manualPrice?: number; price: number; quantity: number }) => {
                        if (item.included) {
                            const price = item.manualPrice ?? item.price;
                            subtotal += price * item.quantity;
                        }
                    });
                    const total = subtotal + (subtotal * (parsed.bdi / 100));

                    allEstimates.push({
                        id: parsed.id,
                        title: parsed.title || 'Sem título',
                        date: parsed.date,
                        total
                    });

                    totalValue += total;
                    if (estimateDate.getMonth() === currentMonth) thisMonthCount++;
                }
            }
        }

        allEstimates.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        setEstimates(allEstimates);
        setStats({
            total: allEstimates.length,
            value: totalValue,
            thisMonth: thisMonthCount
        });
    };

    useEffect(() => {
        // Initial data load from localStorage is a valid use case
        // eslint-disable-next-line
        loadEstimates();
        loadUserData();
    }, []);

    const handleNew = () => {
        const id = crypto.randomUUID();
        router.push(`/editor/${id}?type=obra_nova`);
    };

    const handleDelete = (id: string) => {
        if (confirm('Excluir este orçamento?')) {
            localStorage.removeItem(`estimate_${id}`);
            loadEstimates();
        }
    };

    return (
        <div className="min-h-screen bg-white dark:bg-[#191919]">
            <div className="max-w-6xl mx-auto px-6 py-12">
                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white">
                        <div className="flex items-center gap-3 mb-2">
                            <FileText size={24} />
                            <h3 className="text-sm font-medium opacity-90">Total de Orçamentos</h3>
                        </div>
                        <p className="text-4xl font-bold">{stats.total}</p>
                    </div>

                    <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white">
                        <div className="flex items-center gap-3 mb-2">
                            <DollarSign size={24} />
                            <h3 className="text-sm font-medium opacity-90">Valor Total</h3>
                        </div>
                        <p className="text-4xl font-bold">
                            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(stats.value)}
                        </p>
                    </div>

                    <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white">
                        <div className="flex items-center gap-3 mb-2">
                            <Calendar size={24} />
                            <h3 className="text-sm font-medium opacity-90">Este Mês</h3>
                        </div>
                        <p className="text-4xl font-bold">{stats.thisMonth}</p>
                    </div>
                </div>

                {/* Charts Section */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
                    {/* Chart 1 - Activity */}
                    <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                            <TrendingUp size={20} className="text-primary" />
                            Atividade
                        </h3>
                        <div className="space-y-3">
                            {activityData.map((day, i) => (
                                <div key={i}>
                                    <div className="flex justify-between text-sm mb-1">
                                        <span className="text-gray-600 dark:text-gray-400">{day.label}</span>
                                        <span className="font-semibold text-gray-900 dark:text-white">{day.value}</span>
                                    </div>
                                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                        <div className="bg-primary h-2 rounded-full" style={{ width: `${day.value * 10}%` }}></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Chart 2 - Performance */}
                    <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Performance</h3>
                        <div className="space-y-4">
                            <div>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Valor Médio</p>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(stats.total > 0 ? stats.value / stats.total : 0)}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Taxa de Crescimento</p>
                                <p className="text-2xl font-bold text-green-600">+{growthRate}%</p>
                            </div>
                        </div>
                    </div>

                    {/* Chart 3 - Plan */}
                    <div className="bg-gradient-to-br from-gray-500 to-gray-600 rounded-xl p-6 text-white">
                        <div className="flex items-center gap-3 mb-4">
                            <Crown size={32} />
                            <div>
                                <p className="text-sm opacity-90">Plano Atual</p>
                                <h3 className="text-2xl font-bold">Gratuito</h3>
                            </div>
                        </div>
                        <div className="mb-4">
                            <div className="flex justify-between text-sm mb-2">
                                <span>Uso mensal</span>
                                <span>{stats.thisMonth} / 30</span>
                            </div>
                            <div className="w-full bg-white/20 rounded-full h-2">
                                <div className="bg-white h-2 rounded-full" style={{ width: `${Math.min((stats.thisMonth / 30) * 100, 100)}%` }}></div>
                            </div>
                        </div>
                        <Link
                            href="/planos"
                            className="block text-center px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg font-semibold transition-all"
                        >
                            Fazer Upgrade
                        </Link>
                    </div>
                </div>

                {/* User Profile Section */}
                <div className="bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden mb-12">
                    <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                            <User size={24} className="text-primary" />
                            Meus Dados
                        </h2>
                        {!isEditingProfile && (
                            <button
                                onClick={() => setIsEditingProfile(true)}
                                className="flex items-center gap-2 px-4 py-2 text-primary hover:bg-primary/10 rounded-lg transition-colors font-semibold"
                            >
                                <Edit size={18} />
                                Editar
                            </button>
                        )}
                    </div>

                    <div className="p-6">
                        {isEditingProfile ? (
                            <div className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Nome Completo *
                                        </label>
                                        <input
                                            type="text"
                                            value={tempUserData.fullName}
                                            onChange={(e) => setTempUserData({ ...tempUserData, fullName: e.target.value })}
                                            className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
                                            placeholder="Seu nome completo"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Email *
                                        </label>
                                        <input
                                            type="email"
                                            value={tempUserData.email}
                                            onChange={(e) => setTempUserData({ ...tempUserData, email: e.target.value })}
                                            className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
                                            placeholder="seu@email.com"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Tipo de Usuário *
                                        </label>
                                        <select
                                            value={tempUserData.userType}
                                            onChange={(e) => setTempUserData({ ...tempUserData, userType: e.target.value })}
                                            className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
                                            aria-label="Tipo de Usuário"
                                        >
                                            <option value="">Selecione...</option>
                                            <option value="cliente">Cliente</option>
                                            <option value="engenheiro">Engenheiro</option>
                                            <option value="arquiteto">Arquiteto</option>
                                            <option value="construtor">Construtor</option>
                                            <option value="orcamentista">Orçamentista</option>
                                            <option value="outros">Outros</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Telefone
                                        </label>
                                        <input
                                            type="tel"
                                            value={tempUserData.phone}
                                            onChange={(e) => setTempUserData({ ...tempUserData, phone: e.target.value })}
                                            className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
                                            placeholder="(00) 00000-0000"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Endereço
                                        </label>
                                        <input
                                            type="text"
                                            value={tempUserData.address}
                                            onChange={(e) => setTempUserData({ ...tempUserData, address: e.target.value })}
                                            className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
                                            placeholder="Rua, número, complemento"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Cidade
                                        </label>
                                        <input
                                            type="text"
                                            value={tempUserData.city}
                                            onChange={(e) => setTempUserData({ ...tempUserData, city: e.target.value })}
                                            className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
                                            placeholder="Sua cidade"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Estado (UF)
                                        </label>
                                        <input
                                            type="text"
                                            value={tempUserData.state}
                                            onChange={(e) => setTempUserData({ ...tempUserData, state: e.target.value.toUpperCase() })}
                                            className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
                                            placeholder="SP"
                                            maxLength={2}
                                        />
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 pt-4">
                                    <button
                                        onClick={saveUserData}
                                        className="flex items-center gap-2 px-6 py-3 bg-primary hover:bg-primary-hover text-white font-semibold rounded-lg transition-all"
                                    >
                                        <Save size={18} />
                                        Salvar Dados
                                    </button>
                                    <button
                                        onClick={cancelEdit}
                                        className="flex items-center gap-2 px-6 py-3 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-white font-semibold rounded-lg transition-all"
                                    >
                                        <X size={18} />
                                        Cancelar
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                <div>
                                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Nome Completo</p>
                                    <p className="font-semibold text-gray-900 dark:text-white">
                                        {userData.fullName || 'Não informado'}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Email</p>
                                    <p className="font-semibold text-gray-900 dark:text-white break-all">
                                        {userData.email || 'Não informado'}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Tipo de Usuário</p>
                                    <p className="font-semibold text-gray-900 dark:text-white capitalize">
                                        {userData.userType ? (
                                            userData.userType === 'orcamentista' ? 'Orçamentista' :
                                                userData.userType.charAt(0).toUpperCase() + userData.userType.slice(1)
                                        ) : 'Não informado'}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Telefone</p>
                                    <p className="font-semibold text-gray-900 dark:text-white">
                                        {userData.phone || 'Não informado'}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Endereço</p>
                                    <p className="font-semibold text-gray-900 dark:text-white">
                                        {userData.address || 'Não informado'}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Cidade</p>
                                    <p className="font-semibold text-gray-900 dark:text-white">
                                        {userData.city || 'Não informado'}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Estado</p>
                                    <p className="font-semibold text-gray-900 dark:text-white">
                                        {userData.state || 'Não informado'}
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Estimates List */}
                <div className="bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                    <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Meus Orçamentos</h2>
                    </div>

                    {estimates.length > 0 ? (
                        <div className="divide-y divide-gray-200 dark:divide-gray-700">
                            {estimates.map((est) => (
                                <div key={est.id} className="p-6 hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors group">
                                    <div className="flex items-center justify-between">
                                        <div className="flex-1">
                                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">{est.title}</h3>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                                {new Date(est.date).toLocaleDateString('pt-BR')}
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <p className="text-2xl font-bold text-primary">
                                                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(est.total)}
                                            </p>
                                            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button
                                                    onClick={() => router.push(`/report/${est.id}`)}
                                                    className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg"
                                                    title="Visualizar"
                                                >
                                                    <Eye size={18} />
                                                </button>
                                                <button
                                                    onClick={() => router.push(`/editor/${est.id}`)}
                                                    className="p-2 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/30 rounded-lg"
                                                    title="Editar"
                                                >
                                                    <Edit size={18} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(est.id)}
                                                    className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg"
                                                    title="Excluir"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="p-12 text-center">
                            <FileText className="mx-auto text-gray-400 mb-4" size={48} />
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Nenhum orçamento ainda</h3>
                            <p className="text-gray-600 dark:text-gray-400 mb-6">Comece criando seu primeiro orçamento</p>
                            <button
                                onClick={handleNew}
                                className="inline-flex items-center gap-2 px-6 py-3 bg-primary hover:bg-primary-hover text-white font-semibold rounded-lg transition-all"
                            >
                                <Plus size={20} />
                                Criar Primeiro Orçamento
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
