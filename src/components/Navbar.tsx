'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useTheme } from '@/contexts/ThemeContext';
import { Moon, Sun, Menu, X, Info, Phone, CreditCard, Heart } from 'lucide-react';
import { useState } from 'react';

export default function Navbar() {
    const { theme, toggleTheme } = useTheme();
    const pathname = usePathname();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const navLinks = [
        { name: 'Planos', href: '/planos', icon: CreditCard },
        { name: 'Apoie o App', href: '/apoie', icon: Heart },
        { name: 'Sobre', href: '/sobre', icon: Info },
        { name: 'Contato', href: '#', icon: Phone },
    ];

    const isActive = (path: string) => pathname === path;



    return (
        <nav className="sticky top-0 z-50 w-full bg-white/80 dark:bg-[#191919]/80 backdrop-blur-md border-b border-gray-100 dark:border-gray-800 transition-colors">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <div className="flex-shrink-0">
                        <Link href="/" className="flex items-center gap-3">
                            <Image
                                src="/obracalc-logo.png"
                                alt="ObraCalc Logo"
                                width={32}
                                height={32}
                                className="w-8 h-8 object-contain"
                            />
                            <span className="font-bold text-xl tracking-tight text-gray-900 dark:text-white">
                                ObraCalc
                            </span>
                        </Link>
                    </div>

                    {/* Desktop Menu */}
                    <div className="hidden md:block">
                        <div className="ml-10 flex items-baseline space-x-4">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.name}
                                    href={link.href}
                                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive(link.href) && link.href !== '#'
                                        ? 'text-[var(--color-primary)] bg-gray-50 dark:bg-gray-800'
                                        : 'text-primary dark:text-primary hover:text-primary dark:hover:text-primary hover:bg-gray-50 dark:hover:bg-gray-800'
                                        }`}
                                >
                                    {link.name}
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Right Side Actions */}
                    <div className="hidden md:flex items-center gap-4">
                        <button
                            onClick={toggleTheme}
                            className="p-2 rounded-full text-primary dark:text-primary hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--color-primary)]"
                            aria-label="Alternar tema"
                        >
                            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                        </button>

                    </div>

                    {/* Mobile menu button */}
                    <div className="md:hidden flex items-center gap-2">
                        <button
                            onClick={toggleTheme}
                            className="p-2 rounded-full text-primary dark:text-primary hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                        >
                            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                        </button>
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[var(--color-primary)]"
                        >
                            <span className="sr-only">Abrir menu</span>
                            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="md:hidden border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-[#191919]">
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                onClick={() => setIsMenuOpen(false)}
                                className={`flex items-center gap-2 block px-3 py-2 rounded-md text-base font-medium ${isActive(link.href) && link.href !== '#'
                                    ? 'text-[var(--color-primary)] bg-gray-50 dark:bg-gray-800'
                                    : 'text-primary dark:text-primary hover:text-primary dark:hover:text-primary hover:bg-gray-50 dark:hover:bg-gray-800'
                                    }`}
                            >
                                <link.icon size={18} />
                                {link.name}
                            </Link>
                        ))}

                    </div>
                </div>
            )}
        </nav>
    );
}
