'use client';

import { useState, Suspense } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { useRouter, useSearchParams } from 'next/navigation';
import { Loader2, CheckCircle2, XCircle, ArrowRight, Sparkles, Mail, Lock, User, Chrome } from 'lucide-react';

function LoginForm() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [fullName, setFullName] = useState('');
    const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
    const [loginMethod, setLoginMethod] = useState<'password' | 'magic'>('password');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    const router = useRouter();
    const searchParams = useSearchParams();
    const next = searchParams?.get('next');
    const redirectUrl = typeof window !== 'undefined' ? `${window.location.origin}/auth/callback${next ? `?next=${encodeURIComponent(next)}` : ''}` : '';

    const supabase = createClient();

    const handleGoogleLogin = async () => {
        setLoading(true);
        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: redirectUrl,
            },
        });

        if (error) {
            setMessage({ type: 'error', text: error.message });
            setLoading(false);
        }
    };

    const handleEmailAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);

        try {
            if (authMode === 'signup') {
                // SIGN UP FLOW
                const { error } = await supabase.auth.signUp({
                    email,
                    password,
                    options: {
                        data: { full_name: fullName },
                        emailRedirectTo: redirectUrl,
                    },
                });
                if (error) throw error;
                setMessage({ type: 'success', text: 'Cadastro realizado! Verifique seu email para confirmar a conta.' });
            } else {
                // LOGIN FLOW
                if (loginMethod === 'magic') {
                    const { error } = await supabase.auth.signInWithOtp({
                        email,
                        options: { emailRedirectTo: redirectUrl },
                    });
                    if (error) throw error;
                    setMessage({ type: 'success', text: 'Link mágico enviado! Verifique sua caixa de entrada.' });
                } else {
                    const { error } = await supabase.auth.signInWithPassword({
                        email,
                        password,
                    });
                    if (error) throw error;
                    router.push(next ? decodeURIComponent(next) : '/dashboard');
                    router.refresh();
                }
            }
        } catch (error: any) {
            setMessage({ type: 'error', text: error.message || 'Ocorreu um erro durante a autenticação.' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-[calc(100vh-64px)] w-full bg-white dark:bg-[#1a1a1a] relative overflow-hidden">

            {/* BACKGROUND IMAGE - Positioned absolutely to cover left side but blend naturally */}
            {/* BACKGROUND IMAGE */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-0">
                <Image
                    src="/login-bg-v5.webp"
                    alt="Background"
                    fill
                    className="object-contain object-left-bottom opacity-60"
                    priority
                />
            </div>

            {/* LEFT SIDE - Content Only */}
            <div className="hidden lg:flex w-1/2 relative items-start justify-center z-10 p-12 pt-8">
                <div className="relative max-w-lg text-[#222120] dark:text-white space-y-6">
                    <h1 className="text-5xl font-bold leading-tight tracking-tight">
                        Construa o futuro com inteligência.
                    </h1>
                    <p className="text-lg text-[#4B4B4B] dark:text-white/90 leading-relaxed max-w-md">
                        Junte-se a milhares de engenheiros e arquitetos que utilizam o ObraPlana para criar orçamentos precisos em segundos.
                    </p>

                    <div className="flex items-center gap-4 pt-4">
                        <div className="flex -space-x-3">
                            {[1, 2, 3, 4].map(i => (
                                <div key={i} className="w-10 h-10 rounded-full border-2 border-white dark:border-white/50 bg-[#222120]/5 dark:bg-white/20 backdrop-blur-sm" />
                            ))}
                        </div>
                        <div className="text-sm font-medium text-[#222120] dark:text-white">
                            <span className="font-bold">4.9/5</span> de aprovação
                        </div>
                    </div>
                </div>
            </div>

            {/* RIGHT SIDE - Form Island */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-4 lg:p-12 relative z-10">

                <div className="w-full max-w-[420px] bg-transparent p-8 lg:p-10 relative z-10">

                    {/* Header */}
                    <div className="text-center mb-10">
                        <h2 className="text-2xl font-bold text-[#222120] dark:text-white mb-2 drop-shadow-md">
                            {authMode === 'login' ? 'Bem-vindo de volta!' : 'Criar nova conta'}
                        </h2>
                        <p className="text-[#555] dark:text-gray-300 text-sm font-medium">
                            {authMode === 'login'
                                ? 'Acesse seus orçamentos e relatórios'
                                : 'Comece a usar o ObraPlana gratuitamente'}
                        </p>
                    </div>

                    {/* Google Button - Top Placement */}
                    <button
                        onClick={handleGoogleLogin}
                        disabled={loading}
                        className="w-full flex items-center justify-center gap-3 bg-white dark:bg-[#333130] text-[#5f6368] dark:text-[#D3D4D6] border border-[#B6B8BC] dark:border-[#444] hover:bg-[#F8F9FA] dark:hover:bg-[#403e3d] p-3 rounded-xl transition-all duration-200 font-medium text-sm h-12 mb-6 group"
                    >
                        {loading ? (
                            <Loader2 className="animate-spin w-5 h-5" />
                        ) : (
                            <>
                                <Image src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" width={20} height={20} className="group-hover:scale-110 transition-transform" />
                                <span>Continuar com Google</span>
                            </>
                        )}
                    </button>

                    <div className="relative mb-8">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t border-[#D3D4D6] dark:border-[#444]" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase tracking-widest">
                            <span className="bg-white dark:bg-[#222120] px-4 text-[#919599]">ou email</span>
                        </div>
                    </div>

                    {/* Main Form */}
                    <form onSubmit={handleEmailAuth} className="space-y-5">

                        {/* Auth Mode Tabs included in form flow logic somewhat, but functionally separated above */}
                        {authMode === 'signup' && (
                            <div className="space-y-1.5 animate-in slide-in-from-top-2 fade-in">
                                <label className="text-xs font-bold text-[#919599] uppercase ml-1">Nome Completo</label>
                                <div className="relative">
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#B6B8BC]" />
                                    <input
                                        type="text"
                                        required
                                        value={fullName}
                                        onChange={(e) => setFullName(e.target.value)}
                                        placeholder="Ex: Ana Silva"
                                        className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-[#D3D4D6] dark:border-[#444] bg-[#F8F9FA] dark:bg-[#1a1a1a] text-[#222120] dark:text-white placeholder-[#B6B8BC] focus:ring-2 focus:ring-[#F6A24A]/20 focus:border-[#F6A24A] transition-all outline-none text-sm font-medium"
                                    />
                                </div>
                            </div>
                        )}

                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-[#919599] uppercase ml-1">Email Profissional</label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#B6B8BC]" />
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="seu@email.com"
                                    className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-[#D3D4D6] dark:border-[#444] bg-[#F8F9FA] dark:bg-[#1a1a1a] text-[#222120] dark:text-white placeholder-[#B6B8BC] focus:ring-2 focus:ring-[#F6A24A]/20 focus:border-[#F6A24A] transition-all outline-none text-sm font-medium"
                                />
                            </div>
                        </div>

                        {/* Password or Magic Info */}
                        {loginMethod === 'password' ? (
                            <div className="space-y-1.5 animate-in slide-in-from-top-1 fade-in">
                                <label className="text-xs font-bold text-[#919599] uppercase ml-1 flex justify-between">
                                    Senha
                                    {authMode === 'login' && (
                                        <button type="button" className="text-[#F6A24A] hover:text-[#D85B2F] normal-case font-medium transition-colors">
                                            Esqueceu?
                                        </button>
                                    )}
                                </label>
                                <div className="relative">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#B6B8BC]" />
                                    <input
                                        type="password"
                                        required
                                        minLength={6}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="******"
                                        className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-[#D3D4D6] dark:border-[#444] bg-[#F8F9FA] dark:bg-[#1a1a1a] text-[#222120] dark:text-white placeholder-[#B6B8BC] focus:ring-2 focus:ring-[#F6A24A]/20 focus:border-[#F6A24A] transition-all outline-none text-sm font-medium"
                                    />
                                </div>
                            </div>
                        ) : (
                            <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-100 dark:border-blue-800/30 text-xs text-blue-600 dark:text-blue-300 flex items-start gap-2 animate-in fade-in">
                                <Sparkles className="w-4 h-4 shrink-0 mt-0.5" />
                                <p>Enviaremos um link seguro para o seu email. Você poderá entrar sem precisar de senha.</p>
                            </div>
                        )}

                        {/* Primary Action Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-[#D85B2F] hover:bg-[#bf4d26] text-white font-bold p-3.5 rounded-xl transition-all shadow-lg shadow-[#D85B2F]/20 hover:shadow-[#D85B2F]/40 active:scale-[0.98] h-12 flex items-center justify-center gap-2 mt-2"
                        >
                            {loading ? <Loader2 className="animate-spin" /> : (
                                <>
                                    <span>{authMode === 'login' ? (loginMethod === 'magic' ? 'Enviar Link de Acesso' : 'Entrar na Conta') : 'Criar Conta Grátis'}</span>
                                    <ArrowRight size={18} className="opacity-80" />
                                </>
                            )}
                        </button>
                    </form>

                    {/* Toggles */}
                    <div className="mt-8 space-y-4 text-center">
                        {authMode === 'login' && (
                            <button
                                type="button"
                                onClick={() => setLoginMethod(loginMethod === 'password' ? 'magic' : 'password')}
                                className="text-sm font-medium text-[#919599] hover:text-[#222120] dark:hover:text-white transition-colors"
                            >
                                {loginMethod === 'password'
                                    ? <span className="flex items-center justify-center gap-2"><Sparkles size={14} className="text-[#F6A24A]" /> Prefiro entrar com Link Mágico</span>
                                    : <span className="flex items-center justify-center gap-2"><Lock size={14} className="text-[#F6A24A]" /> Prefiro usar minha senha</span>
                                }
                            </button>
                        )}

                        <div className="pt-6 border-t border-[#D3D4D6] dark:border-[#333]">
                            <div className="text-sm text-[#919599]">
                                {authMode === 'login' ? 'Não tem uma conta?' : 'Já tem uma conta?'}
                                <button
                                    onClick={() => {
                                        setAuthMode(authMode === 'login' ? 'signup' : 'login');
                                        setLoginMethod('password'); // Reset to password for signup/login switch
                                        setMessage(null);
                                    }}
                                    className="ml-2 font-bold text-[#D85B2F] hover:text-[#F6A24A] transition-colors"
                                >
                                    {authMode === 'login' ? 'Cadastre-se' : 'Fazer Login'}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Messages */}
                    {message && (
                        <div className={`absolute bottom-4 left-1/2 -translate-x-1/2 w-[90%] p-3 rounded-lg flex items-center gap-2 text-xs font-medium shadow-lg animate-in slide-in-from-bottom-2 ${message.type === 'success'
                            ? 'bg-green-100 text-green-700 border border-green-200'
                            : 'bg-red-50 text-red-600 border border-red-200'
                            }`}>
                            {message.type === 'success' ? <CheckCircle2 size={16} /> : <XCircle size={16} />}
                            <p>{message.text}</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default function LoginPage() {
    return (
        <Suspense fallback={
            <div className="min-h-[calc(100vh-64px)] w-full flex items-center justify-center bg-white dark:bg-[#1a1a1a]">
                <Loader2 className="animate-spin text-[#D85B2F] w-8 h-8" />
            </div>
        }>
            <LoginForm />
        </Suspense>
    );
}
