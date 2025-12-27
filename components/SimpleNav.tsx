'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { Gem, Info, Mail, Heart, LogIn, User, LogOut, LayoutDashboard } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { useEffect, useState } from 'react';
import { User as SupabaseUser } from '@supabase/supabase-js';

export default function SimpleNav() {
    const pathname = usePathname();
    const router = useRouter();
    const [user, setUser] = useState<SupabaseUser | null>(null);
    const supabase = createClient();

    useEffect(() => {
        const getUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            setUser(user);
        };

        getUser();

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
        });

        return () => subscription.unsubscribe();
    }, []);

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        router.refresh();
        setUser(null);
    };

    return (
        <nav className="bg-white/70 backdrop-blur-md sticky top-0 z-50 border-b border-gray-200/50 dark:bg-gray-900/70 dark:border-gray-700/50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex items-center">
                        <Link href="/" className="flex-shrink-0 flex items-center gap-2">
                            <Image
                                src="/logo-custom.png"
                                alt="ObraCalc Logo"
                                width={32}
                                height={32}
                                className="h-8 w-auto"
                                priority
                            />
                            <span className="font-heading font-bold text-xl text-black dark:text-white tracking-tight">ObraCalc</span>
                        </Link>
                    </div>

                    <div className="flex items-center gap-6">
                        <Link href="/planos" title="Planos" className="text-gray-500 hover:text-primary dark:text-gray-400 dark:hover:text-primary transition-colors p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800">
                            <Gem size={20} />
                            <span className="sr-only">Planos</span>
                        </Link>
                        <Link href="/sobre" title="Sobre" className="text-gray-500 hover:text-primary dark:text-gray-400 dark:hover:text-primary transition-colors p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800">
                            <Info size={20} />
                            <span className="sr-only">Sobre</span>
                        </Link>
                        <Link href="/contato" title="Contato" className="text-gray-500 hover:text-primary dark:text-gray-400 dark:hover:text-primary transition-colors p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800">
                            <Mail size={20} />
                            <span className="sr-only">Contato</span>
                        </Link>
                        <Link href="/apoie" title="Apoie o Projeto" className="text-gray-500 hover:text-pink-500 dark:text-gray-400 dark:hover:text-pink-500 transition-colors p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800">
                            <Heart size={20} />
                            <span className="sr-only">Apoie</span>
                        </Link>

                        <div className="h-6 w-px bg-gray-200 dark:bg-gray-700 mx-2" />

                        {user ? (
                            <div className="flex items-center gap-3">
                                <Link
                                    href="/dashboard"
                                    className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-primary dark:text-gray-300 dark:hover:text-primary px-3 py-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                                    title="Ir para Dashboard"
                                >
                                    <LayoutDashboard size={18} />
                                    <span className="hidden md:inline">Dashboard</span>
                                </Link>

                                <div className="h-4 w-px bg-gray-200 dark:bg-gray-700 hidden md:block" />

                                <span className="text-xs text-gray-500 dark:text-gray-400 hidden lg:block max-w-[150px] truncate" title={user.email}>
                                    {user.email}
                                </span>

                                <button
                                    onClick={handleSignOut}
                                    className="p-2 text-gray-400 hover:text-red-600 transition-colors rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
                                    title="Sair"
                                >
                                    <LogOut size={18} />
                                </button>
                            </div>
                        ) : (
                            <Link
                                href="/login"
                                className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-full font-medium text-sm transition-all shadow-sm hover:shadow-md"
                            >
                                <LogIn size={16} />
                                <span>Entrar</span>
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}
