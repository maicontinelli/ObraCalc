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
    Plus,
    Sparkles
} from 'lucide-react';
import Link from 'next/link';
import { BudgetChart } from '@/components/BudgetChart';

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
    const [showOnboardingMessage, setShowOnboardingMessage] = useState(false);
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

                let currentProfileData = {
                    full_name: '',
                    company_name: '',
                    phone: '',
                    city: '',
                    state: '',
                    profession: '',
                    registration_number: '',
                    team_size: ''
                };

                if (profile) {
                    currentProfileData = {
                        full_name: profile.full_name || '',
                        company_name: profile.company_name || '',
                        phone: profile.phone || '',
                        city: profile.city || '',
                        state: profile.state || '',
                        profession: profile.profession || '',
                        registration_number: profile.registration_number || '',
                        team_size: profile.team_size || ''
                    };
                } else if (user.user_metadata) {
                    // Fallback to auth metadata if profile is empty (migration)
                    currentProfileData = {
                        full_name: user.user_metadata.full_name || '',
                        company_name: user.user_metadata.company_name || '',
                        phone: user.user_metadata.phone || '',
                        city: user.user_metadata.city || '',
                        state: user.user_metadata.state || '',
                        profession: '',
                        registration_number: '',
                        team_size: ''
                    };
                }

                setProfileData(currentProfileData);

                // Check if profile is incomplete (using full_name as proxy)
                if (!currentProfileData.full_name) {
                    setIsProfileExpanded(true);
                    setShowOnboardingMessage(true);
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
        setShowOnboardingMessage(false); // Hide message on save attempt

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
            <div className="max-w-7xl mx-auto space-y-8">

                {/* Welcome Header Section */}
                <div className="relative bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden group">
                    {/* Decorative Background */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-orange-50 dark:bg-orange-900/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none transition-transform duration-700 group-hover:scale-110"></div>

                    <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                        <div className="flex-1 max-w-lg">
                            <div className="flex items-center gap-3 mb-2">
                                <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">
                                    Olá, {profileData.full_name?.split(' ')[0] || 'Parceiro'}!
                                </h1>
                                <span className="text-3xl animate-wave origin-bottom-right inline-block">👋</span>
                            </div>
                            <p className="text-lg text-gray-500 dark:text-gray-400 font-medium leading-relaxed">
                                É bom te ver aqui novamente. Preparei um resumo dos seus orçamentos para hoje.
                            </p>

                            <div className="mt-6">
                                <button
                                    onClick={handleNewBudget}
                                    className="inline-flex items-center gap-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-6 py-3 rounded-xl font-bold hover:scale-105 active:scale-95 transition-all shadow-lg hover:shadow-xl"
                                >
                                    <Plus size={20} />
                                    Novo Orçamento
                                </button>
                            </div>
                        </div>

                        {/* Doodle Illustration - Standing Person */}
                        <div className="hidden md:block absolute right-10 bottom-4 pointer-events-none">
                            <svg width="180" height="140" viewBox="0 0 180 140" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-sm" style={{ transform: 'scaleX(-1)' }}>
                                {/* Branch */}
                                <path d="M20 130Q90 128 160 132" stroke="#A67C52" strokeWidth="4" strokeLinecap="round" className="dark:stroke-amber-800" />
                                <path d="M160 132Q170 125 175 110" stroke="#22c55e" strokeWidth="3" strokeLinecap="round" className="dark:stroke-green-700" /> {/* Leaf */}
                                <path d="M175 110Q180 120 170 130" stroke="#22c55e" strokeWidth="3" strokeLinecap="round" className="dark:stroke-green-700" />

                                {/* Feet */}
                                <path d="M80 130L80 120" stroke="currentColor" strokeWidth="3" className="text-gray-800 dark:text-gray-200" />
                                <path d="M95 130L95 120" stroke="currentColor" strokeWidth="3" className="text-gray-800 dark:text-gray-200" />

                                {/* Body Main */}
                                <path d="M100 120C100 120 110 50 80 40C60 30 40 50 45 120H100Z" fill="currentColor" className="text-gray-900 dark:text-white" />

                                {/* Wing */}
                                <path d="M55 70C55 70 45 100 65 110" stroke="white" strokeWidth="1.5" strokeOpacity="0.3" fill="none" />

                                {/* White Throat Patch */}
                                <path d="M85 45C85 45 95 60 95 80C95 95 85 100 70 100" fill="#F3F4F6" className="dark:fill-gray-300" />

                                {/* Beak (Big Gradient Orange) */}
                                <defs>
                                    <linearGradient id="beakGradient" x1="0" y1="0" x2="1" y2="0">
                                        <stop offset="0%" stopColor="#FBbf24" /> {/* Amber */}
                                        <stop offset="100%" stopColor="#f97316" /> {/* Orange */}
                                    </linearGradient>
                                </defs>
                                <path d="M88 45Q170 10 170 55Q160 85 95 70" fill="url(#beakGradient)" stroke="currentColor" strokeWidth="1.5" className="text-gray-900 dark:text-white" />
                                <path d="M150 55L95 60" stroke="black" strokeWidth="1" strokeOpacity="0.1" /> {/* Beak line */}

                                {/* Eye */}
                                <circle cx="75" cy="55" r="8" fill="white" />
                                <circle cx="77" cy="55" r="3" fill="black" />
                                <path d="M72 48Q78 45 82 48" stroke="black" strokeWidth="1" fill="none" opacity="0.3" /> {/* Eyebrow */}
                            </svg>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">

                    {/* LEFT COLUMN: Main Content (Stats & List) */}
                    <div className="lg:col-span-2 space-y-8">

                        {/* Chart Section */}
                        <BudgetChart budgets={budgets} />

                        {/* Stats Grid */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                            <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                                <div className="p-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 rounded-lg w-fit mb-3">
                                    <FileText size={18} />
                                </div>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalBudgets}</p>
                                <span className="text-xs font-medium text-gray-400 uppercase tracking-wide">Orçamentos</span>
                            </div>

                            <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                                <div className="p-2 bg-green-50 dark:bg-green-900/20 text-green-600 rounded-lg w-fit mb-3">
                                    <DollarSign size={18} />
                                </div>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', notation: 'compact' }).format(stats.totalValue)}
                                </p>
                                <span className="text-xs font-medium text-gray-400 uppercase tracking-wide">Total</span>
                            </div>

                            <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                                <div className="p-2 bg-purple-50 dark:bg-purple-900/20 text-purple-600 rounded-lg w-fit mb-3">
                                    <TrendingUp size={18} />
                                </div>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', notation: 'compact' }).format(stats.avgTicket)}
                                </p>
                                <span className="text-xs font-medium text-gray-400 uppercase tracking-wide">Médio</span>
                            </div>

                            <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                                <div className="p-2 bg-orange-50 dark:bg-orange-900/20 text-orange-600 rounded-lg w-fit mb-3">
                                    <Calendar size={18} />
                                </div>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.thisMonth}</p>
                                <span className="text-xs font-medium text-gray-400 uppercase tracking-wide">Mês</span>
                            </div>
                        </div>

                        {/* Recent Budgets List */}
                        <div className="space-y-4">
                            <div className="flex items-center justify-between px-1">
                                <h2 className="text-lg font-bold text-gray-900 dark:text-white">Orçamentos Recentes</h2>
                                {/* Search bar placeholder - visual only for now */}
                                <div className="relative hidden sm:block w-64">
                                    <Search size={14} className="absolute left-3 top-2.5 text-gray-400" />
                                    <input
                                        type="text"
                                        placeholder="Buscar..."
                                        className="w-full pl-9 pr-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full text-xs outline-none focus:ring-2 focus:ring-primary/20 transition-all"
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
                                        <div className="hidden md:grid grid-cols-12 gap-4 p-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider bg-gray-50/50 dark:bg-gray-900/50">
                                            <div className="col-span-6">Cliente / Obra</div>
                                            <div className="col-span-3">Valor Total</div>
                                            <div className="col-span-3 text-right">Ações</div>
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
                                                    <div className="col-span-6 hidden md:block">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                                                                <FileText size={14} />
                                                            </div>
                                                            <div>
                                                                <h3 className="font-bold text-gray-900 dark:text-white text-sm truncate">{budget.title || 'Sem título'}</h3>
                                                                <p className="text-[10px] text-gray-400 uppercase tracking-wide">
                                                                    {new Date(budget.updated_at).toLocaleDateString('pt-BR')} • {budget.content?.projectType || 'Projeto'}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="col-span-3 hidden md:block">
                                                        <span className="font-bold text-gray-700 dark:text-gray-300 text-sm">
                                                            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalValue)}
                                                        </span>
                                                    </div>

                                                    {/* Actions */}
                                                    <div className="col-span-3 flex items-center justify-end gap-2 mt-2 md:mt-0 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <Link
                                                            href={`/report/${budget.id}`}
                                                            className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                            title="Ver Relatório"
                                                        >
                                                            <FileText size={16} />
                                                        </Link>
                                                        <Link
                                                            href={`/editor/${budget.id}`}
                                                            className="p-1.5 text-gray-400 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                                                            title="Editar"
                                                        >
                                                            <Edit3 size={16} />
                                                        </Link>
                                                        <button
                                                            onClick={() => handleDeleteBudget(budget.id)}
                                                            className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                            title="Excluir"
                                                        >
                                                            <Trash2 size={16} />
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

                    {/* RIGHT COLUMN: Profile Sidebar */}
                    <div className="lg:col-span-1 lg:sticky lg:top-6">
                        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden transition-all duration-300">
                            <div
                                className="p-4 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center cursor-pointer hover:bg-gray-50 transition-colors"
                                onClick={() => setIsProfileExpanded(!isProfileExpanded)}
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-orange-100 dark:bg-orange-900/20 flex items-center justify-center text-orange-600">
                                        <UserIcon size={16} />
                                    </div>
                                    <h3 className="font-bold text-gray-900 dark:text-white text-sm">Seus Dados</h3>
                                </div>
                                {isProfileExpanded ? <ChevronUp size={16} className="text-gray-400" /> : <ChevronDown size={16} className="text-gray-400" />}
                            </div>

                            {isProfileExpanded && (
                                <div className="bg-white dark:bg-gray-800">
                                    {showOnboardingMessage && (
                                        <div className="mx-4 mt-4 p-3 bg-blue-50 border border-blue-100 rounded-lg flex items-start gap-2 animate-in fade-in slide-in-from-top-2">
                                            <TrendingUp size={14} className="text-blue-600 shrink-0 mt-0.5" />
                                            <div>
                                                <p className="text-blue-700 text-xs leading-relaxed">
                                                    Preencha seus dados para seus orçamentos saírem profissionais!
                                                </p>
                                            </div>
                                        </div>
                                    )}

                                    {/* List Style Inputs */}
                                    <div className="divide-y divide-gray-50 dark:divide-gray-700/50">
                                        {/* Name */}
                                        <div className="flex items-center px-4 py-2 group hover:bg-gray-50 transition-colors">
                                            <UserIcon size={14} className="text-gray-300 mr-3 shrink-0" />
                                            <div className="flex-1">
                                                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Nome Completo</label>
                                                <input
                                                    type="text"
                                                    value={profileData.full_name}
                                                    onChange={(e) => setProfileData({ ...profileData, full_name: e.target.value })}
                                                    className="w-full bg-transparent border-none p-0 text-sm font-medium text-gray-700 focus:ring-0 placeholder-gray-300"
                                                    placeholder="Digite seu nome..."
                                                />
                                            </div>
                                        </div>

                                        {/* Phone */}
                                        <div className="flex items-center px-4 py-2 group hover:bg-gray-50 transition-colors">
                                            <Phone size={14} className="text-gray-300 mr-3 shrink-0" />
                                            <div className="flex-1">
                                                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Telefone / WhatsApp</label>
                                                <input
                                                    type="text"
                                                    value={profileData.phone}
                                                    onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                                                    className="w-full bg-transparent border-none p-0 text-sm font-medium text-gray-700 focus:ring-0 placeholder-gray-300"
                                                    placeholder="(00) 00000-0000"
                                                />
                                            </div>
                                        </div>

                                        {/* City/State Row */}
                                        <div className="flex items-center px-4 py-2 group hover:bg-gray-50 transition-colors">
                                            <MapPin size={14} className="text-gray-300 mr-3 shrink-0" />
                                            <div className="flex gap-4 w-full">
                                                <div className="flex-1">
                                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Cidade</label>
                                                    <input
                                                        type="text"
                                                        value={profileData.city}
                                                        onChange={(e) => setProfileData({ ...profileData, city: e.target.value })}
                                                        className="w-full bg-transparent border-none p-0 text-sm font-medium text-gray-700 focus:ring-0 placeholder-gray-300"
                                                        placeholder="Cidade..."
                                                    />
                                                </div>
                                                <div className="w-16">
                                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">UF</label>
                                                    <input
                                                        type="text"
                                                        maxLength={2}
                                                        value={profileData.state}
                                                        onChange={(e) => setProfileData({ ...profileData, state: e.target.value.toUpperCase() })}
                                                        className="w-full bg-transparent border-none p-0 text-sm font-medium text-gray-700 focus:ring-0 placeholder-gray-300 uppercase"
                                                        placeholder="UF"
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        {/* Profession */}
                                        <div className="flex items-center px-4 py-2 group hover:bg-gray-50 transition-colors">
                                            <FileText size={14} className="text-gray-300 mr-3 shrink-0" />
                                            <div className="flex-1 relative">
                                                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Profissão</label>
                                                <select
                                                    value={profileData.profession}
                                                    onChange={(e) => setProfileData({ ...profileData, profession: e.target.value })}
                                                    className="w-full bg-transparent border-none p-0 text-sm font-medium text-gray-700 focus:ring-0 appearance-none cursor-pointer"
                                                >
                                                    <option value="">Selecione...</option>
                                                    <option value="Engenheiro">Engenheiro</option>
                                                    <option value="Arquiteto">Arquiteto</option>
                                                    <option value="Empreiteiro">Empreiteiro</option>
                                                    <option value="Orçamentista">Orçamentista</option>
                                                    <option value="Outros">Outros</option>
                                                </select>
                                            </div>
                                        </div>

                                        {/* Company */}
                                        <div className="flex items-center px-4 py-2 group hover:bg-gray-50 transition-colors">
                                            <Building2 size={14} className="text-gray-300 mr-3 shrink-0" />
                                            <div className="flex-1">
                                                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Empresa</label>
                                                <input
                                                    type="text"
                                                    value={profileData.company_name}
                                                    onChange={(e) => setProfileData({ ...profileData, company_name: e.target.value })}
                                                    className="w-full bg-transparent border-none p-0 text-sm font-medium text-gray-700 focus:ring-0 placeholder-gray-300"
                                                    placeholder="Nome da empresa..."
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="p-4 bg-gray-50/50">
                                        <button
                                            onClick={handleSaveProfile}
                                            disabled={isSavingProfile}
                                            className="w-full flex items-center justify-center gap-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-4 py-2.5 rounded-lg font-medium text-sm hover:bg-gray-800 dark:hover:bg-gray-100 transition-all shadow-sm active:scale-[0.98]"
                                        >
                                            {isSavingProfile ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                                            Salvar Dados
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Tip Widget */}
                        <div className="mt-4 p-4 rounded-2xl bg-gradient-to-br from-orange-50 to-orange-100/50 border border-orange-100 dark:from-orange-900/10 dark:to-orange-900/5 dark:border-orange-800/30">
                            <h4 className="flex items-center gap-2 text-xs font-bold text-orange-800 dark:text-orange-300 uppercase tracking-wider mb-2">
                                <Sparkles size={12} /> Dica Pro
                            </h4>
                            <p className="text-xs text-orange-700 dark:text-orange-400 leading-relaxed">
                                Use a busca com IA para adicionar pacotes completos de serviços, como "Reforma de Banheiro" ou "Construção de Muro".
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
