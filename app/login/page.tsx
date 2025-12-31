'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { Loader2, CheckCircle2, XCircle } from 'lucide-react';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
    const router = useRouter();

    useEffect(() => {
        // Force Dark Mode for Login Page to match Home theme
        document.documentElement.classList.add('dark');
        return () => {
            document.documentElement.classList.remove('dark');
        };
    }, []);

    const supabase = createClient();

    const handleGoogleLogin = async () => {
        setLoading(true);
        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: `${window.location.origin}/auth/callback`,
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
                emailRedirectTo: `${window.location.origin}/auth/callback`,
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

    return (
        <div className="min-h-[calc(100vh-64px)] bg-[#262423] flex flex-col justify-center items-center p-4">

            <div className="w-full max-w-md bg-[#2C2A29] rounded-2xl shadow-xl border border-white/5 p-8">

                <div className="text-center mb-8">
                    <h1 className="text-2xl font-bold text-[#E8E8E6] mb-2">Acesse ou Crie sua Conta</h1>
                    <p className="text-[#B5B5B5] text-sm">
                        Use seu e-mail ou Google para entrar. Se ainda não tem cadastro, sua conta será criada automaticamente.
                    </p>
                </div>

                <div className="space-y-4">
                    <button
                        onClick={handleGoogleLogin}
                        disabled={loading}
                        className="w-full flex items-center justify-center gap-3 bg-[#222120] text-[#E8E8E6] border border-white/10 hover:bg-[#333130] p-3 rounded-xl transition-all shadow-sm font-medium h-12"
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
                            <span className="w-full border-t border-white/10" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-[#2C2A29] px-2 text-[#8a8886]">ou entre com email</span>
                        </div>
                    </div>

                    <form onSubmit={handleEmailLogin} className="space-y-4">
                        <div>
                            <label htmlFor="email" className="sr-only">Email</label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="seu@email.com"
                                className="w-full px-4 py-3 rounded-xl border border-white/10 bg-[#222120] text-[#E8E8E6] placeholder-[#6b6967] focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-[#E89129] hover:bg-[#E89129]/90 text-white font-semibold p-3 rounded-xl transition-all shadow-lg hover:shadow-[#E89129]/20 h-12 flex items-center justify-center"
                        >
                            {loading ? <Loader2 className="animate-spin" /> : 'Entrar com Link Mágico'}
                        </button>
                    </form>
                </div>

                {message && (
                    <div className={`mt-6 p-4 rounded-lg flex items-start gap-3 text-sm ${message.type === 'success'
                        ? 'bg-green-50 text-green-700 border border-green-200'
                        : 'bg-red-50 text-red-700 border border-red-200'
                        }`}>
                        {message.type === 'success' ? <CheckCircle2 className="shrink-0 mt-0.5" size={16} /> : <XCircle className="shrink-0 mt-0.5" size={16} />}
                        <p>{message.text}</p>
                    </div>
                )}
            </div>

            <p className="mt-8 text-center text-xs text-[#6b6967] max-w-xs mx-auto">
                Ao continuar, você concorda com nossos <Link href="#" className="underline hover:text-[#E8E8E6]">Termos de Serviço</Link> e <Link href="#" className="underline hover:text-[#E8E8E6]">Política de Privacidade</Link>.
            </p>
        </div>
    );
}
