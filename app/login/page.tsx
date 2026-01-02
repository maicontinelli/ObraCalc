'use client';

import { useState, useEffect, Suspense } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { useRouter, useSearchParams } from 'next/navigation';
import { Loader2, CheckCircle2, XCircle } from 'lucide-react';

function LoginForm() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [fullName, setFullName] = useState('');
    const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
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

    const handleEmailLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);

        const { error } = await supabase.auth.signInWithOtp({
            email,
            options: {
                emailRedirectTo: redirectUrl,
            },
        });

        if (error) {
            setMessage({ type: 'error', text: error.message });
        } else {
            setMessage({
                type: 'success',
                text: 'Enviamos um link mágico para seu email! Verifique sua caixa de entrada.'
            });
        }
        setLoading(false);
    };

    const handlePasswordAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);

        if (authMode === 'signup') {
            const { error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        full_name: fullName,
                    },
                    emailRedirectTo: redirectUrl,
                },
            });

            if (error) {
                setMessage({ type: 'error', text: error.message });
            } else {
                setMessage({
                    type: 'success',
                    text: 'Cadastro realizado! Verifique seu email para confirmar a conta.'
                });
            }
        } else {
            const { error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) {
                setMessage({ type: 'error', text: 'Email ou senha inválidos.' });
            } else {
                router.push(next ? decodeURIComponent(next) : '/dashboard');
                router.refresh();
            }
        }
        setLoading(false);
    };

    return (
        <div className="min-h-[calc(100vh-64px)] bg-background flex flex-col justify-center items-center p-4 py-12">

            {/* Ilha 1: Acesso Rápido (Google + Magic Link) */}
            <div className="w-full max-w-md bg-card rounded-2xl shadow-xl border border-border p-8 mb-6 relative z-10">
                <div className="text-center mb-6">
                    <h1 className="text-2xl font-bold text-foreground mb-2">Acesso Rápido</h1>
                    <p className="text-muted-foreground text-sm">
                        Entre sem senha usando Google ou link mágico.
                    </p>
                </div>

                <div className="space-y-4">
                    <button
                        onClick={handleGoogleLogin}
                        disabled={loading}
                        className="w-full flex items-center justify-center gap-3 bg-card text-foreground border border-input hover:bg-accent hover:text-accent-foreground p-3 rounded-xl transition-all shadow-sm font-medium h-12"
                    >
                        {loading ? (
                            <Loader2 className="animate-spin" />
                        ) : (
                            <>
                                <Image src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" width={20} height={20} />
                                Continuar com Google
                            </>
                        )}
                    </button>

                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t border-border" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-card px-2 text-[#8a8886]">ou link mágico</span>
                        </div>
                    </div>

                    <form onSubmit={handleEmailLogin} className="space-y-4">
                        <div>
                            <label htmlFor="email_magic" className="sr-only">Email</label>
                            <input
                                id="email_magic"
                                type="email"
                                autoComplete="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="seu@email.com"
                                className="w-full px-4 py-3 rounded-xl border border-input bg-background/50 text-foreground placeholder-muted-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600 text-white font-semibold p-3 rounded-xl transition-all shadow-lg hover:shadow-blue-500/20 h-12 flex items-center justify-center"
                        >
                            {loading ? <Loader2 className="animate-spin" /> : 'Entrar com Link Mágico'}
                        </button>
                    </form>
                </div>
            </div>

            {/* Separator */}
            <div className="flex items-center gap-4 text-xs text-muted-foreground uppercase tracking-widest my-2">
                <span className="w-12 h-px bg-border"></span>
                <span>ou use sua senha</span>
                <span className="w-12 h-px bg-border"></span>
            </div>

            {/* Ilha 2: Cadastro / Login com Senha */}
            <div className="w-full max-w-md bg-card/80 backdrop-blur-sm rounded-2xl shadow-lg border border-border p-8 mt-6">

                {/* Tabs */}
                <div className="flex bg-muted/50 p-1 rounded-xl mb-6">
                    <button
                        onClick={() => setAuthMode('login')}
                        className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${authMode === 'login' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                    >
                        Entrar
                    </button>
                    <button
                        onClick={() => setAuthMode('signup')}
                        className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${authMode === 'signup' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                    >
                        Criar Conta
                    </button>
                </div>

                <form onSubmit={handlePasswordAuth} className="space-y-4">
                    {authMode === 'signup' && (
                        <div className="animate-in slide-in-from-top-2 fade-in duration-200">
                            <label className="text-xs font-semibold text-muted-foreground uppercase ml-1 mb-1 block">Nome Completo</label>
                            <input
                                type="text"
                                required
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                placeholder="Seu nome"
                                className="w-full px-4 py-3 rounded-xl border border-input bg-background text-foreground placeholder-muted-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
                            />
                        </div>
                    )}

                    <div>
                        <label className="text-xs font-semibold text-muted-foreground uppercase ml-1 mb-1 block">Email</label>
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="seu@email.com"
                            className="w-full px-4 py-3 rounded-xl border border-input bg-background/50 text-foreground placeholder-muted-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
                        />
                    </div>

                    <div>
                        <label className="text-xs font-semibold text-muted-foreground uppercase ml-1 mb-1 block">Senha</label>
                        <input
                            type="password"
                            required
                            minLength={6}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="******"
                            className="w-full px-4 py-3 rounded-xl border border-input bg-background/50 text-foreground placeholder-muted-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-foreground text-background hover:bg-foreground/90 font-semibold p-3 rounded-xl transition-all h-12 flex items-center justify-center mt-2"
                    >
                        {loading ? <Loader2 className="animate-spin" /> : (authMode === 'login' ? 'Entrar' : 'Cadastrar')}
                    </button>
                </form>

            </div>

            {message && (
                <div className={`mt-6 p-4 rounded-lg flex items-start gap-3 text-sm max-w-md w-full ${message.type === 'success'
                    ? 'bg-green-50 text-green-700 border border-green-200'
                    : 'bg-red-50 text-red-700 border border-red-200'
                    }`}>
                    {message.type === 'success' ? <CheckCircle2 className="shrink-0 mt-0.5" size={16} /> : <XCircle className="shrink-0 mt-0.5" size={16} />}
                    <p>{message.text}</p>
                </div>
            )}

            <p className="mt-8 text-center text-xs text-[#6b6967] max-w-xs mx-auto">
                Ao continuar, você concorda com nossos <Link href="#" className="underline hover:text-foreground">Termos de Serviço</Link> e <Link href="#" className="underline hover:text-foreground">Política de Privacidade</Link>.
            </p>
        </div>
    );
}

export default function LoginPage() {
    return (
        <Suspense fallback={
            <div className="min-h-[calc(100vh-64px)] bg-background flex flex-col justify-center items-center p-4">
                <Loader2 className="animate-spin text-white w-8 h-8" />
            </div>
        }>
            <LoginForm />
        </Suspense>
    );
}
