'use client';

import Link from "next/link";
import Image from "next/image";
import { Github, Twitter, Linkedin } from "lucide-react";
import { usePathname } from "next/navigation";

export function Footer() {
    const pathname = usePathname();
    const isReportPage = pathname?.startsWith('/report/');

    return (
        <footer className={`border-t pt-16 pb-8 ${isReportPage
            ? 'bg-white dark:bg-[#262423] border-gray-100 dark:border-white/5'
            : 'bg-[#262423] border-white/5'
            }`}>
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
                    <div className="col-span-2 md:col-span-1">
                        <Link href="/" className="mb-4 block">
                            <Image
                                src="/logo-v4.png"
                                alt="ObraCalc Logo"
                                width={120}
                                height={40}
                                className="h-10 w-auto"
                            />
                        </Link>
                        <p className={`text-sm mb-6 max-w-xs ${isReportPage ? 'text-gray-500 dark:text-[#B5B5B5]' : 'text-[#B5B5B5]'}`}>
                            Fluxo completo de documentação por IA — do orçamento ao relatório técnico.
                        </p>
                        <div className="flex gap-4">
                            <a href="#" className="text-gray-400 hover:text-primary transition-colors" aria-label="Github">
                                <Github className="w-5 h-5" />
                            </a>
                            <a href="#" className="text-gray-400 hover:text-primary transition-colors" aria-label="Twitter">
                                <Twitter className="w-5 h-5" />
                            </a>
                            <a href="#" className="text-gray-400 hover:text-primary transition-colors" aria-label="LinkedIn">
                                <Linkedin className="w-5 h-5" />
                            </a>
                        </div>
                    </div>

                    <div>
                        <h4 className={`font-semibold mb-4 ${isReportPage ? 'text-gray-900 dark:text-[#E8E8E6]' : 'text-[#E8E8E6]'}`}>Produto</h4>
                        <ul className={`space-y-2 text-sm ${isReportPage ? 'text-gray-600 dark:text-[#B5B5B5]' : 'text-[#B5B5B5]'}`}>
                            <li><Link href="#" className="hover:text-primary">Funcionalidades</Link></li>
                            <li><Link href="#" className="hover:text-primary">Preços</Link></li>
                            <li><Link href="#" className="hover:text-primary">Integrações</Link></li>
                            <li><Link href="#" className="hover:text-primary">Updates</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className={`font-semibold mb-4 ${isReportPage ? 'text-gray-900 dark:text-[#E8E8E6]' : 'text-[#E8E8E6]'}`}>Recursos</h4>
                        <ul className={`space-y-2 text-sm ${isReportPage ? 'text-gray-600 dark:text-[#B5B5B5]' : 'text-[#B5B5B5]'}`}>
                            <li><Link href="#" className="hover:text-primary">Documentação</Link></li>
                            <li><Link href="#" className="hover:text-primary">API</Link></li>
                            <li><Link href="#" className="hover:text-primary">Comunidade</Link></li>
                            <li><Link href="#" className="hover:text-primary">Blog</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className={`font-semibold mb-4 ${isReportPage ? 'text-gray-900 dark:text-[#E8E8E6]' : 'text-[#E8E8E6]'}`}>Legal</h4>
                        <ul className={`space-y-2 text-sm ${isReportPage ? 'text-gray-600 dark:text-[#B5B5B5]' : 'text-[#B5B5B5]'}`}>
                            <li><Link href="#" className="hover:text-primary">Privacidade</Link></li>
                            <li><Link href="#" className="hover:text-primary">Termos</Link></li>
                            <li><Link href="#" className="hover:text-primary">Segurança</Link></li>
                        </ul>
                    </div>
                </div>

                <div className={`border-t pt-8 flex flex-col md:flex-row justify-between items-center gap-4 ${isReportPage ? 'border-gray-100 dark:border-white/5' : 'border-white/5'}`}>
                    <p className={`text-xs ${isReportPage ? 'text-gray-500 dark:text-[#6b6967]' : 'text-[#6b6967]'}`}>
                        © 2024 ObraCalc. Todos os direitos reservados.
                    </p>
                    <div className={`flex gap-6 text-xs ${isReportPage ? 'text-gray-500 dark:text-[#6b6967]' : 'text-[#6b6967]'}`}>
                        <span>Feito com ❤️ para engenheiros</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}
