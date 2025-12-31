'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { Gem, Info, Mail, Heart, LogIn, User, LogOut, LayoutDashboard, Map, Camera, MoreHorizontal, Sparkles } from 'lucide-react';
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

    const isReportPage = pathname?.startsWith('/report/');
    const isDarkPage = pathname?.startsWith('/report/') ||
        pathname === '/topografia' ||
        pathname === '/relatorio-fotografico' ||
        pathname === '/apoie' ||
        pathname === '/sobre' ||
        pathname === '/contato' ||
        pathname === '/dashboard' ||
        pathname === '/planos';

    return (
        <nav className={`sticky top-0 z-50 border-b ${isDarkPage
            ? 'bg-[#262423] border-white/5'
            : 'bg-gray-100/40 backdrop-blur-sm border-gray-200/50 dark:bg-[#262423]/80 dark:border-white/5'
            }`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex items-center">
                        <Link href="/" className="flex-shrink-0 flex items-center gap-2">
                            <Image
                                src="/logo-v4.png"
                                alt="ObraCalc Logo"
                                width={32}
                                height={32}
                                className="h-8 w-auto"
                                priority
                            />
                        </Link>
                    </div>

                    <div className="flex items-center gap-2 md:gap-6">
                        <Link
                            href="/topografia"
                            title="Topografia"
                            className={`transition-all p-2 rounded-full ${isDarkPage ? 'hover:bg-gray-800' : 'hover:bg-gray-100 dark:hover:bg-gray-800'} ${pathname === '/topografia'
                                ? `text-[#C2410C] ${isDarkPage ? 'bg-gray-800/50' : 'bg-gray-50 dark:bg-gray-800/50'}`
                                : isDarkPage ? 'text-gray-400' : 'text-gray-500 dark:text-gray-400'
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
                            className={`transition-all p-2 rounded-full ${isDarkPage ? 'hover:bg-gray-800' : 'hover:bg-gray-100 dark:hover:bg-gray-800'} ${pathname === '/relatorio-fotografico'
                                ? `text-[#6366F1] ${isDarkPage ? 'bg-gray-800/50' : 'bg-gray-50 dark:bg-gray-800/50'}`
                                : isDarkPage ? 'text-gray-400' : 'text-gray-500 dark:text-gray-400'
                                } hover:text-[#6366F1] group`}
                        >
                            <Camera
                                size={20}
                                className={`transition-all duration-300 group-hover:drop-shadow-[0_0_5px_rgba(99,102,241,0.6)] ${pathname === '/relatorio-fotografico' ? 'fill-[#6366F1]' : 'fill-transparent'
                                    }`}
                            />
                            <span className="sr-only">Relatório Fotográfico</span>
                        </Link>



                        <Link
                            href="/sobre"
                            title="Sobre"
                            className={`transition-all p-2 rounded-full ${isDarkPage ? 'hover:bg-gray-800' : 'hover:bg-gray-100 dark:hover:bg-gray-800'} ${pathname === '/sobre'
                                ? `text-[#3B82F6] ${isDarkPage ? 'bg-gray-800/50' : 'bg-gray-50 dark:bg-gray-800/50'}`
                                : isDarkPage ? 'text-gray-400' : 'text-gray-500 dark:text-gray-400'
                                } hover:text-[#3B82F6] group`}
                        >
                            <Info
                                size={20}
                                className={`transition-all duration-300 group-hover:drop-shadow-[0_0_5px_rgba(59,130,246,0.6)] ${pathname === '/sobre' ? 'fill-[#3B82F6]' : 'fill-transparent'}`}
                            />
                            <span className="sr-only">Sobre</span>
                        </Link>

                        <Link
                            href="/contato"
                            title="Contato"
                            className={`transition-all p-2 rounded-full ${isDarkPage ? 'hover:bg-gray-800' : 'hover:bg-gray-100 dark:hover:bg-gray-800'} ${pathname === '/contato'
                                ? `text-[#F97316] ${isDarkPage ? 'bg-gray-800/50' : 'bg-gray-50 dark:bg-gray-800/50'}`
                                : isDarkPage ? 'text-gray-400' : 'text-gray-500 dark:text-gray-400'
                                } hover:text-[#F97316] group`}
                        >
                            <Mail
                                size={20}
                                className={`transition-all duration-300 group-hover:drop-shadow-[0_0_5px_rgba(249,115,22,0.6)] ${pathname === '/contato' ? 'fill-[#F97316]' : 'fill-transparent'}`}
                            />
                            <span className="sr-only">Contato</span>
                        </Link>

                        <Link
                            href="/apoie"
                            title="Apoie"
                            className={`transition-all p-2 rounded-full ${isDarkPage ? 'hover:bg-gray-800' : 'hover:bg-gray-100 dark:hover:bg-gray-800'} ${pathname === '/apoie'
                                ? `text-[#EC4899] ${isDarkPage ? 'bg-gray-800/50' : 'bg-gray-50 dark:bg-gray-800/50'}`
                                : isDarkPage ? 'text-gray-400' : 'text-gray-500 dark:text-gray-400'
                                } hover:text-[#EC4899] group`}
                        >
                            <Heart
                                size={20}
                                className={`transition-all duration-300 group-hover:drop-shadow-[0_0_5px_rgba(236,72,153,0.6)] ${pathname === '/apoie' ? 'fill-[#EC4899]' : 'fill-transparent'}`}
                            />
                            <span className="sr-only">Apoie</span>
                        </Link>

                        <div className={`h-6 w-px mx-2 ${isDarkPage ? 'bg-gray-700' : 'bg-gray-200 dark:bg-gray-700'}`} />

                        <Link
                            href="/planos"
                            title="Planos"
                            className={`transition-all p-2 rounded-full ${isDarkPage ? 'hover:bg-gray-800' : 'hover:bg-gray-100 dark:hover:bg-gray-800'} ${pathname === '/planos'
                                ? `text-[#74D2E7] ${isDarkPage ? 'bg-gray-800/50' : 'bg-gray-50 dark:bg-gray-800/50'}`
                                : isDarkPage ? 'text-gray-400' : 'text-gray-500 dark:text-gray-400'
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
                                    className={`transition-all p-2 rounded-full ${isDarkPage ? 'hover:bg-gray-800' : 'hover:bg-gray-100 dark:hover:bg-gray-800'} ${pathname === '/dashboard'
                                        ? `text-[#E89E37] ${isDarkPage ? 'bg-gray-800/50' : 'bg-gray-50 dark:bg-gray-800/50'}`
                                        : isDarkPage ? 'text-gray-400' : 'text-gray-500 dark:text-gray-400'
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
                                    className={`p-2 text-gray-400 hover:text-red-600 transition-colors rounded-full ${isDarkPage ? 'hover:bg-gray-800' : 'hover:bg-gray-100 dark:hover:bg-gray-800'}`}
                                    title="Sair"
                                >
                                    <LogOut size={20} />
                                </button>
                            </div>
                        ) : (
                            <Link
                                href="/login"
                                className="flex items-center gap-2 bg-[#E89129] hover:bg-[#E89129]/90 text-white px-4 py-2 rounded-full font-medium text-sm transition-all shadow-sm hover:shadow-md"
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
