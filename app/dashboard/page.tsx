'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { User } from '@supabase/supabase-js';
import {
    LayoutDashboard,
    User as UserIcon,
    Building2,
    Phone,
    MapPin,
    ChevronDown,
    ChevronUp,
    Save,
    Loader2,
    FileText,
    Calendar,
    DollarSign,
    TrendingUp,
    Search,
    Edit3,
    Trash2,
    Plus
} from 'lucide-react';
import Link from 'next/link';

interface Budget {
    id: string;
    title: string;
    updated_at: string;
    content: any; // JSONB content
}

export default function DashboardPage() {
    const router = useRouter();
    const supabase = createClient();

    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [budgets, setBudgets] = useState<Budget[]>([]);

    // Stats State
    const [stats, setStats] = useState({
        totalBudgets: 0,
        totalValue: 0,
        avgTicket: 0,
        thisMonth: 0
    });

    // Profile State
    const [isProfileExpanded, setIsProfileExpanded] = useState(false);
    const [isSavingProfile, setIsSavingProfile] = useState(false);
    const [profileData, setProfileData] = useState({
        full_name: '',
        company_name: '',
        phone: '',
        city: '',
        state: '',
        profession: '',
        registration_number: '',
        team_size: ''
    });

    // Load Data
    useEffect(() => {
        const loadDashboardData = async () => {
            try {
                setLoading(true);
                const { data: { user } } = await supabase.auth.getUser();

                if (!user) {
                    router.push('/login');
                    return;
                }

                setUser(user);

                // 1. Fetch Profile Data from public.profiles table (Single Source of Truth)
                const { data: profile } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('id', user.id)
                    .single();

                if (profile) {
                    setProfileData({
                        full_name: profile.full_name || '',
                        company_name: profile.company_name || '',
                        phone: profile.phone || '',
                        city: profile.city || '',
                        state: profile.state || '',
                        profession: profile.profession || '',
                        registration_number: profile.registration_number || '',
                        team_size: profile.team_size || ''
                    });
                } else if (user.user_metadata) {
                    // Fallback to auth metadata if profile is empty (migration)
                    setProfileData({
                        full_name: user.user_metadata.full_name || '',
                        company_name: user.user_metadata.company_name || '',
                        phone: user.user_metadata.phone || '',
                        city: user.user_metadata.city || '',
                        state: user.user_metadata.state || '',
                        profession: '',
                        registration_number: '',
                        team_size: ''
                    });
                }

                // 2. Fetch Budgets
                const { data: budgetsData, error } = await supabase
                    .from('budgets')
                    .select('*')
                    .eq('user_id', user.id)
                    .order('updated_at', { ascending: false });

                if (budgetsData) {
                    setBudgets(budgetsData);

                    // Calculate Stats
                    const totalVal = budgetsData.reduce((acc, curr) => {
                        const val = curr.content?.items?.filter((i: any) => i.included).reduce((sum: number, item: any) => sum + ((item.manualPrice ?? item.price) * item.quantity), 0) * (1 + (curr.content?.bdi || 0) / 100) || 0;
                        return acc + val;
                    }, 0);

                    // Count this month
                    const now = new Date();
                    const thisMonthCount = budgetsData.filter(b => {
                        const d = new Date(b.created_at);
                        return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
                    }).length;

                    setStats({
                        totalBudgets: budgetsData.length,
                        totalValue: totalVal,
                        avgTicket: budgetsData.length > 0 ? totalVal / budgetsData.length : 0,
                        thisMonth: thisMonthCount
                    });
                }

            } catch (error) {
                console.error('Error loading dashboard:', error);
            } finally {
                setLoading(false);
            }
        };

        loadDashboardData();
    }, [router, supabase]);

    const handleSaveProfile = async () => {
        if (!user) return;
        setIsSavingProfile(true);

        try {
            // Update public.profiles (Source of Truth)
            const { error } = await supabase
                .from('profiles')
                .upsert({
                    id: user.id,
                    email: user.email,
                    full_name: profileData.full_name,
                    company_name: profileData.company_name,
                    phone: profileData.phone,
                    city: profileData.city,
                    state: profileData.state,
                    profession: profileData.profession,
                    registration_number: profileData.registration_number,
                    team_size: profileData.team_size,
                    updated_at: new Date().toISOString()
                });

            if (error) {
                console.error('Error updating profile:', error);
                alert(`Erro ao salvar: ${error.message || 'Verifique sua conexão.'}`);
            } else {
                alert('Perfil atualizado com sucesso!');
                setIsProfileExpanded(false);
            }
        } catch (e) {
            console.error(e);
        } finally {
            setIsSavingProfile(false);
        }
    };

    const handleDeleteBudget = async (id: string) => {
        if (!confirm('Tem certeza que deseja excluir este orçamento?')) return;

        const { error } = await supabase.from('budgets').delete().eq('id', id);

        if (!error) {
            setBudgets(prev => prev.filter(b => b.id !== id));
            // Also clean local storage
            localStorage.removeItem(`estimate_${id}`);
        }
    };

    const handleNewBudget = () => {
        const id = crypto.randomUUID();
        router.push(`/editor/${id}`);
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
                <Loader2 className="w-8 h-8 text-primary animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 font-sans p-6 lg:p-12">
            <div className="max-w-5xl mx-auto space-y-8">

                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">Dashboard</h1>
                        <p className="text-gray-500 dark:text-gray-400">Bem-vindo de volta, {profileData.full_name || user?.email?.split('@')[0]}.</p>
                    </div>
                    <button
                        onClick={handleNewBudget}
                        className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-5 py-2.5 rounded-xl font-medium transition-all shadow-lg hover:shadow-primary/25"
                    >
                        <Plus size={18} />
                        Novo Orçamento
                    </button>
                </div>

                {/* Profile Card (Expandable) */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden transition-all duration-300">
                    <div
                        className="p-6 flex justify-between items-center cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-750"
                        onClick={() => setIsProfileExpanded(!isProfileExpanded)}
                    >
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-600 dark:text-blue-400">
                                <UserIcon size={20} />
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-900 dark:text-white">Seus Dados Pessoais</h3>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                    {isProfileExpanded ? 'Edite suas informações para usar nos orçamentos' : `${profileData.full_name || 'Preencher dados'} • ${profileData.company_name || 'Sem empresa'}`}
                                </p>
                            </div>
                        </div>
                        {isProfileExpanded ? <ChevronUp size={20} className="text-gray-400" /> : <ChevronDown size={20} className="text-gray-400" />}
                    </div>

                    {isProfileExpanded && (
                        <div className="p-6 pt-0 border-t border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50 space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                                {/* 1. Dados Pessoais */}
                                <div className="md:col-span-2">
                                    <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                                        <UserIcon size={16} className="text-primary" />
                                        Dados Pessoais
                                    </h4>
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5 block">Nome Completo</label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            value={profileData.full_name}
                                            onChange={(e) => setProfileData({ ...profileData, full_name: e.target.value })}
                                            className="w-full px-4 py-2.5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                                            placeholder="Seu nome"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5 block">Telefone / WhatsApp</label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            value={profileData.phone}
                                            onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                                            className="w-full px-4 py-2.5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                                            placeholder="(00) 00000-0000"
                                        />
                                    </div>
                                </div>

                                {/* 2. Localização */}
                                <div className="md:col-span-2 mt-4">
                                    <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                                        <MapPin size={16} className="text-primary" />
                                        Localização
                                    </h4>
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5 block">Cidade</label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            value={profileData.city}
                                            onChange={(e) => setProfileData({ ...profileData, city: e.target.value })}
                                            className="w-full px-4 py-2.5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                                            placeholder="Sua cidade"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5 block">Estado (UF)</label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            maxLength={2}
                                            value={profileData.state}
                                            onChange={(e) => setProfileData({ ...profileData, state: e.target.value.toUpperCase() })}
                                            className="w-full px-4 py-2.5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all uppercase"
                                            placeholder="UF"
                                        />
                                    </div>
                                </div>

                                {/* 3. Qualificação */}
                                <div className="md:col-span-2 mt-4">
                                    <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                                        <FileText size={16} className="text-primary" />
                                        Qualificação Profissional
                                    </h4>
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5 block">Profissão *</label>
                                    <div className="relative">
                                        <select
                                            value={profileData.profession}
                                            onChange={(e) => setProfileData({ ...profileData, profession: e.target.value })}
                                            className="w-full px-4 py-2.5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all appearance-none"
                                        >
                                            <option value="">Selecione...</option>
                                            <option value="Engenheiro">Engenheiro</option>
                                            <option value="Arquiteto">Arquiteto</option>
                                            <option value="Empreiteiro">Empreiteiro</option>
                                            <option value="Orçamentista">Orçamentista</option>
                                            <option value="Designer de Interiores">Designer de Interiores</option>
                                            <option value="Mestre de Obras">Mestre de Obras</option>
                                            <option value="Outros">Outros</option>
                                        </select>
                                        <ChevronDown size={16} className="absolute right-4 top-3.5 text-gray-400 pointer-events-none" />
                                    </div>
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5 block">Nº Registro (CREA/CAU/Outro)</label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            value={profileData.registration_number}
                                            onChange={(e) => setProfileData({ ...profileData, registration_number: e.target.value })}
                                            className="w-full px-4 py-2.5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                                            placeholder="Opcional"
                                        />
                                    </div>
                                </div>

                                {/* 4. Dados Empresariais */}
                                <div className="md:col-span-2 mt-4">
                                    <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                                        <Building2 size={16} className="text-primary" />
                                        Dados Empresariais
                                    </h4>
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5 block">Nome da Empresa</label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            value={profileData.company_name}
                                            onChange={(e) => setProfileData({ ...profileData, company_name: e.target.value })}
                                            className="w-full px-4 py-2.5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                                            placeholder="Ex: Construções Silva"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5 block">Tamanho da Equipe</label>
                                    <div className="relative">
                                        <select
                                            value={profileData.team_size}
                                            onChange={(e) => setProfileData({ ...profileData, team_size: e.target.value })}
                                            className="w-full px-4 py-2.5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all appearance-none"
                                        >
                                            <option value="">Selecione...</option>
                                            <option value="Autônomo">Trabalho sozinho (Autônomo)</option>
                                            <option value="Pequena">Pequena (2 a 5 pessoas)</option>
                                            <option value="Média">Média (6 a 10 pessoas)</option>
                                            <option value="Grande">Grande (Mais de 10 pessoas)</option>
                                        </select>
                                        <ChevronDown size={16} className="absolute right-4 top-3.5 text-gray-400 pointer-events-none" />
                                    </div>
                                </div>
                            </div>
                            <div className="flex justify-end pt-2">
                                <button
                                    onClick={handleSaveProfile}
                                    disabled={isSavingProfile}
                                    className="flex items-center gap-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-6 py-2 rounded-lg font-medium text-sm hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors"
                                >
                                    {isSavingProfile ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                                    Salvar Alterações
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 rounded-lg">
                                <FileText size={18} />
                            </div>
                            <span className="text-sm font-medium text-gray-500">Total de Orçamentos</span>
                        </div>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalBudgets}</p>
                    </div>

                    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-green-50 dark:bg-green-900/20 text-green-600 rounded-lg">
                                <DollarSign size={18} />
                            </div>
                            <span className="text-sm font-medium text-gray-500">Valor Total Orçado</span>
                        </div>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">
                            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(stats.totalValue)}
                        </p>
                    </div>

                    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-purple-50 dark:bg-purple-900/20 text-purple-600 rounded-lg">
                                <TrendingUp size={18} />
                            </div>
                            <span className="text-sm font-medium text-gray-500">Ticket Médio</span>
                        </div>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">
                            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(stats.avgTicket)}
                        </p>
                    </div>

                    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-orange-50 dark:bg-orange-900/20 text-orange-600 rounded-lg">
                                <Calendar size={18} />
                            </div>
                            <span className="text-sm font-medium text-gray-500">Este Mês</span>
                        </div>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.thisMonth}</p>
                    </div>
                </div>

                {/* Recent Budgets List */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-bold text-gray-900 dark:text-white">Orçamentos Recentes</h2>
                        {/* Search bar placeholder - visual only for now */}
                        <div className="relative hidden sm:block">
                            <Search size={16} className="absolute left-3 top-2.5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Buscar orçamento..."
                                className="pl-9 pr-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary/20"
                            />
                        </div>
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
                        {budgets.length === 0 ? (
                            <div className="p-12 text-center text-gray-500">
                                <div className="w-16 h-16 bg-gray-50 dark:bg-gray-900 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
                                    <FileText size={32} />
                                </div>
                                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Nenhum orçamento encontrado</h3>
                                <p className="mb-6">Crie seu primeiro orçamento profissional agora mesmo.</p>
                                <button
                                    onClick={handleNewBudget}
                                    className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-5 py-2.5 rounded-xl font-medium transition-colors"
                                >
                                    <Plus size={18} />
                                    Novo Orçamento
                                </button>
                            </div>
                        ) : (
                            <div className="divide-y divide-gray-100 dark:divide-gray-700">
                                {/* Table Header (Desktop) */}
                                <div className="hidden md:grid grid-cols-12 gap-4 p-4 text-xs font-bold text-gray-400 uppercase tracking-wider bg-gray-50/50 dark:bg-gray-900/50">
                                    <div className="col-span-5">Cliente / Obra</div>
                                    <div className="col-span-3">Valor Total</div>
                                    <div className="col-span-2">Data</div>
                                    <div className="col-span-2 text-right">Ações</div>
                                </div>

                                {budgets.map((budget) => {
                                    const totalValue = budget.content?.items?.filter((i: any) => i.included).reduce((sum: number, item: any) => {
                                        return sum + ((item.manualPrice ?? item.price) * item.quantity);
                                    }, 0) * (1 + (budget.content?.bdi || 0) / 100) || 0;

                                    return (
                                        <div key={budget.id} className="p-4 md:grid md:grid-cols-12 md:gap-4 md:items-center hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors group">

                                            {/* Mobile: Top Row with Title & Value */}
                                            <div className="flex justify-between items-start md:hidden mb-2">
                                                <div>
                                                    <h3 className="font-bold text-gray-900 dark:text-white text-sm">{budget.title || 'Sem título'}</h3>
                                                    <span className="text-xs text-gray-500">{new Date(budget.updated_at).toLocaleDateString('pt-BR')}</span>
                                                </div>
                                                <span className="font-bold text-green-600 text-sm">
                                                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalValue)}
                                                </span>
                                            </div>

                                            {/* Desktop Cols */}
                                            <div className="col-span-5 hidden md:block">
                                                <h3 className="font-bold text-gray-900 dark:text-white text-sm">{budget.title || 'Sem título'}</h3>
                                                <p className="text-xs text-gray-500 truncate">{budget.content?.projectType || 'Projeto'}</p>
                                            </div>

                                            <div className="col-span-3 hidden md:block">
                                                <span className="font-bold text-gray-700 dark:text-gray-300 text-sm">
                                                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalValue)}
                                                </span>
                                            </div>

                                            <div className="col-span-2 hidden md:block text-xs text-gray-500">
                                                {new Date(budget.updated_at).toLocaleDateString('pt-BR')}
                                            </div>

                                            {/* Actions */}
                                            <div className="col-span-2 flex items-center justify-end gap-2 mt-2 md:mt-0">
                                                <Link
                                                    href={`/report/${budget.id}`}
                                                    className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                    title="Ver Relatório"
                                                >
                                                    <FileText size={18} />
                                                </Link>
                                                <Link
                                                    href={`/editor/${budget.id}`}
                                                    className="p-2 text-gray-400 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                                                    title="Editar"
                                                >
                                                    <Edit3 size={18} />
                                                </Link>
                                                <button
                                                    onClick={() => handleDeleteBudget(budget.id)}
                                                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                    title="Excluir"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
}
