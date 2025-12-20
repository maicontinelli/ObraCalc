import Link from "next/link";
import Image from "next/image";
import { Github, Twitter, Linkedin } from "lucide-react";

export function Footer() {
    return (
        <footer className="bg-white dark:bg-[#191919] border-t border-gray-100 dark:border-gray-800 pt-16 pb-8">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
                    <div className="col-span-2 md:col-span-1">
                        <Link href="/" className="mb-4 block">
                            <Image
                                src="/logo-custom.png"
                                alt="ObraFlow Logo"
                                width={120}
                                height={40}
                                className="h-10 w-auto"
                            />
                        </Link>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 max-w-xs">
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
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Produto</h4>
                        <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                            <li><Link href="#" className="hover:text-primary">Funcionalidades</Link></li>
                            <li><Link href="#" className="hover:text-primary">Preços</Link></li>
                            <li><Link href="#" className="hover:text-primary">Integrações</Link></li>
                            <li><Link href="#" className="hover:text-primary">Updates</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Recursos</h4>
                        <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                            <li><Link href="#" className="hover:text-primary">Documentação</Link></li>
                            <li><Link href="#" className="hover:text-primary">API</Link></li>
                            <li><Link href="#" className="hover:text-primary">Comunidade</Link></li>
                            <li><Link href="#" className="hover:text-primary">Blog</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Legal</h4>
                        <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                            <li><Link href="#" className="hover:text-primary">Privacidade</Link></li>
                            <li><Link href="#" className="hover:text-primary">Termos</Link></li>
                            <li><Link href="#" className="hover:text-primary">Segurança</Link></li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-gray-100 dark:border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-xs text-gray-500 dark:text-gray-500">
                        © 2024 ObraFlow. Todos os direitos reservados.
                    </p>
                    <div className="flex gap-6 text-xs text-gray-500 dark:text-gray-500">
                        <span>Feito com ❤️ para engenheiros</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}
