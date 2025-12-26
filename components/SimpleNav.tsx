import Link from 'next/link';
import Image from 'next/image';

export default function SimpleNav() {
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
                    <div className="flex items-center space-x-6">
                        <Link href="/planos" className="text-gray-700 dark:text-gray-300 hover:text-primary transition-colors">Planos</Link>
                        <Link href="/sobre" className="text-gray-700 dark:text-gray-300 hover:text-primary transition-colors">Sobre</Link>
                        <Link href="/contato" className="text-gray-700 dark:text-gray-300 hover:text-primary transition-colors">Contato</Link>
                        <Link href="/apoie" className="text-gray-700 dark:text-gray-300 hover:text-primary transition-colors">Apoie</Link>
                    </div>
                </div>
            </div>
        </nav>
    );
}
