'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';

export default function ForgotPasswordPage() {
    const router = useRouter();
    const { forgotPassword } = useAuth();
    const toast = useToast();

    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            toast.info('Enviando e-mail', 'Aguarde...');

            const success = await forgotPassword(email);

            if (success) {
                toast.success('E-mail enviado!', 'Verifique sua caixa de entrada para redefinir sua senha.');
                setTimeout(() => {
                    router.push('/auth/login');
                }, 2000);
            } else {
                toast.error('Erro', 'Não foi possível enviar o e-mail. Tente novamente.');
            }
        } catch {
            toast.error('Erro', 'Não foi possível enviar o e-mail. Tente novamente.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-white dark:bg-[#191919] flex items-center justify-center p-4 relative overflow-hidden">
            {/* Background Blobs */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 pointer-events-none">
                <div className="absolute top-20 left-1/4 w-72 h-72 bg-primary/10 rounded-full blur-3xl mix-blend-multiply animate-blob" />
                <div className="absolute top-20 right-1/4 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl mix-blend-multiply animate-blob animation-delay-2000" />
                <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl mix-blend-multiply animate-blob animation-delay-4000" />
            </div>

            {/* Card */}
            <div className="w-full max-w-md relative z-10">
                {/* Logo */}
                <div className="text-center mb-8">
                    <div className="flex justify-center mb-6">
                        <Image
                            src="/obracalc-logo.png"
                            alt="ObraCalc Logo"
                            width={80}
                            height={80}
                            className="drop-shadow-xl"
                        />
                    </div>
                    <h1 className="text-4xl font-bold text-[#1a1a1a] dark:text-gray-100 mb-2">
                        Recuperar senha
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400">
                        Enviaremos um link para redefinir sua senha
                    </p>
                </div>

                {/* Form Card */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 p-8">
                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Email */}
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                E-mail
                            </label>
                            <input
                                type="email"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="seu@email.com"
                                required
                                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                            />
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-primary hover:bg-primary-hover text-white font-semibold py-3 px-6 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-primary/20"
                        >
                            {isLoading ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                    <span>Enviando...</span>
                                </>
                            ) : (
                                <span>Enviar link de recuperação</span>
                            )}
                        </button>
                    </form>

                    {/* Footer */}
                    <div className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
                        Lembrou sua senha?{' '}
                        <Link href="/auth/login" className="font-semibold text-primary hover:text-primary-hover transition-colors">
                            Fazer login
                        </Link>
                    </div>
                </div>

                {/* Back to Home */}
                <div className="mt-6 text-center">
                    <Link href="/" className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors inline-flex items-center gap-2">
                        <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M10 18l-8-8 8-8 1.41 1.41L5.83 9H20v2H5.83l5.58 5.59L10 18z" />
                        </svg>
                        Voltar para página inicial
                    </Link>
                </div>
            </div>
        </div>
    );
}
