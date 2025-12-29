'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { Gem, Info, Mail, Heart, LogIn, User, LogOut, LayoutDashboard, Map, Camera, MoreHorizontal } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { useEffect, useState } from 'react';
import { User as SupabaseUser } from '@supabase/supabase-js';

export default function SimpleNav() {
    const pathname = usePathname();
    const router = useRouter();
    const [user, setUser] = useState<SupabaseUser | null>(null);
    const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);
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
        <nav className="bg-gray-100/40 backdrop-blur-sm sticky top-0 z-50 border-b border-gray-200/50 dark:bg-gray-900/80 dark:border-gray-700/50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex items-center">
                        <Link href="/" className="flex-shrink-0 flex items-center gap-2">
                            <Image
                                src="/logo-toucan-v2.png"
                                alt="ObraCalc Logo"
                                width={32}
                                height={32}
                                className="h-8 w-auto"
                                priority
                            />
                            <span className="font-heading font-bold text-xl text-black dark:text-white tracking-tight">ObraCalc</span>
                        </Link>
                    </div>

                    <div className="flex items-center gap-2 md:gap-6">
                        <Link
                            href="/topografia"
                            title="Topografia"
                            className={`transition-all p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 ${pathname === '/topografia'
                                ? 'text-[#C2410C] bg-gray-50 dark:bg-gray-800/50'
                                : 'text-gray-500 dark:text-gray-400'
                                } hover:text-[#C2410C] group`}
                        >
                            <Map
                                size={20}
                                className={`transition-all duration-300 group-hover:drop-shadow-[0_0_5px_rgba(194,65,12,0.6)] ${pathname === '/topografia' ? 'fill-[#C2410C]' : 'fill-transparent'
                                    }`}
                            />
                            <span className="sr-only">Topografia</span>
                        </Link>

                        <Link
                            href="/relatorio-fotografico"
                            title="Relatório Fotográfico"
                            className={`transition-all p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 ${pathname === '/relatorio-fotografico'
                                ? 'text-[#6366F1] bg-gray-50 dark:bg-gray-800/50'
                                : 'text-gray-500 dark:text-gray-400'
                                } hover:text-[#6366F1] group`}
                        >
                            <Camera
                                size={20}
                                className={`transition-all duration-300 group-hover:drop-shadow-[0_0_5px_rgba(99,102,241,0.6)] ${pathname === '/relatorio-fotografico' ? 'fill-[#6366F1]' : 'fill-transparent'
                                    }`}
                            />
                            <span className="sr-only">Relatório Fotográfico</span>
                        </Link>



                        {/* Dropdown for More Items */}
                        <div className="relative group">
                            <button
                                className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors focus:outline-none"
                                title="Mais Opções"
                                onClick={() => setIsMoreMenuOpen(!isMoreMenuOpen)}
                            >
                                <MoreHorizontal size={20} />
                            </button>

                            <div className={`absolute right-0 top-full mt-2 w-48 bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-100 dark:border-gray-800 p-2 transition-all duration-200 transform origin-top-right z-50 flex flex-col gap-1 ${isMoreMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible group-hover:opacity-100 group-hover:visible'}`}>
                                <Link
                                    href="/sobre"
                                    className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-[#3B82F6] transition-colors group/item"
                                    onClick={() => setIsMoreMenuOpen(false)}
                                >
                                    <Info size={16} className="text-gray-400 group-hover/item:text-[#3B82F6]" />
                                    Sobre
                                </Link>
                                <Link
                                    href="/contato"
                                    className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-[#F97316] transition-colors group/item"
                                    onClick={() => setIsMoreMenuOpen(false)}
                                >
                                    <Mail size={16} className="text-gray-400 group-hover/item:text-[#F97316]" />
                                    Contato
                                </Link>
                                <Link
                                    href="/apoie"
                                    className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-[#EC4899] transition-colors group/item"
                                    onClick={() => setIsMoreMenuOpen(false)}
                                >
                                    <Heart size={16} className="text-gray-400 group-hover/item:text-[#EC4899]" />
                                    Apoie
                                </Link>
                            </div>
                        </div>

                        <div className="h-6 w-px bg-gray-200 dark:bg-gray-700 mx-2" />

                        <Link
                            href="/planos"
                            title="Planos"
                            className={`transition-all p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 ${pathname === '/planos'
                                ? 'text-[#74D2E7] bg-gray-50 dark:bg-gray-800/50'
                                : 'text-gray-500 dark:text-gray-400'
                                } hover:text-[#74D2E7] group mr-1`}
                        >
                            <Gem
                                size={20}
                                className={`transition-all duration-300 group-hover:drop-shadow-[0_0_5px_rgba(116,210,231,0.6)] ${pathname === '/planos' ? 'fill-[#74D2E7]' : 'fill-transparent'
                                    }`}
                            />
                            <span className="sr-only">Planos</span>
                        </Link>

                        {user ? (
                            <div className="flex items-center gap-2">
                                <Link
                                    href="/dashboard"
                                    title="Painel"
                                    className={`transition-all p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 ${pathname === '/dashboard'
                                        ? 'text-[#E89E37] bg-gray-50 dark:bg-gray-800/50'
                                        : 'text-gray-500 dark:text-gray-400'
                                        } hover:text-[#E89E37] group`}
                                >
                                    <User
                                        size={20}
                                        className={`transition-all duration-300 group-hover:drop-shadow-[0_0_5px_rgba(232,158,55,0.6)] ${pathname === '/dashboard' ? 'fill-[#E89E37]' : 'fill-transparent'
                                            }`}
                                    />
                                    <span className="sr-only">Painel</span>
                                </Link>

                                <button
                                    onClick={handleSignOut}
                                    className="p-2 text-gray-400 hover:text-red-600 transition-colors rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
                                    title="Sair"
                                >
                                    <LogOut size={20} />
                                </button>
                            </div>
                        ) : (
                            <Link
                                href="/login"
                                className="flex items-center gap-2 bg-[#E89E37] hover:bg-[#E89E37]/90 text-white px-4 py-2 rounded-full font-medium text-sm transition-all shadow-sm hover:shadow-md"
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
