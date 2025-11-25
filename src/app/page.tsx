'use client';

import { useRouter } from 'next/navigation';
import { Sparkles, ArrowRight } from 'lucide-react';
import AiAssistant from '@/components/AiAssistant';
import { useTheme } from '@/contexts/ThemeContext';

import Image from 'next/image';

export default function Home() {
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();

  const handleStart = (type: 'obra_nova') => {
    const newId = crypto.randomUUID();
    router.push(`/editor/${newId}?type=${type}`);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#191919] transition-colors relative isolate">
      {/* Full Page Background Image */}
      <div className="fixed inset-0 w-full h-full -z-10 opacity-30 pointer-events-none select-none overflow-hidden">
        <Image
          src="/hero-bg.png"
          alt="Background"
          fill
          className="object-cover w-full h-full dark:invert"
          priority
        />
        {/* Gradient overlay to fade edges/blend with bg */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/50 via-transparent to-white dark:from-[#191919]/50 dark:via-transparent dark:to-[#191919]" />
      </div>
      {/* Navbar - Ultra minimal */}
      <nav className="border-b border-gray-100 dark:border-gray-800 relative z-20 bg-white/80 dark:bg-[#191919]/80 backdrop-blur-sm">
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
          <span className="text-sm font-medium text-gray-900 dark:text-gray-100">OrçaCivil</span>
          <button
            onClick={toggleTheme}
            className="text-xs text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
          >
            {theme === 'dark' ? 'Claro' : 'Escuro'}
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-3xl mx-auto px-6 pt-20 pb-16 relative">

        {/* Hero Section - Minimal */}
        <div className="mb-16 relative isolate text-center">
          {/* Background Image */}


          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-gray-100 mb-4 tracking-tight leading-tight relative z-10">
            Orçamento de obra
          </h1>
          <p className="text-base text-gray-600 dark:text-gray-400 max-w-xl mx-auto leading-relaxed relative z-10">
            Crie estimativas profissionais em segundos. Sem planilhas complexas, sem cadastro.
          </p>
        </div>

        {/* AI Assistant */}
        <div className="mb-12">
          <AiAssistant />
        </div>

        {/* CTA Button - Clean */}
        <div className="mb-16 flex justify-center">
          <button
            onClick={() => handleStart('obra_nova')}
            className="w-full max-w-2xl group inline-flex items-center justify-center gap-2 px-6 py-3 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 rounded-lg hover:bg-gray-800 dark:hover:bg-gray-200 transition-all text-sm font-medium"
          >
            Começar orçamento manual
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Features - Minimal list */}
        <div className="border-t border-gray-100 dark:border-gray-800 pt-12">
          <ul className="flex flex-wrap justify-center gap-6 sm:gap-12 text-sm text-gray-600 dark:text-gray-400">
            <li className="flex items-center gap-3">
              <div className="w-1 h-1 rounded-full bg-gray-400" />
              Base SINAPI atualizada
            </li>
            <li className="flex items-center gap-3">
              <div className="w-1 h-1 rounded-full bg-gray-400" />
              Exportação em PDF e HTML
            </li>
            <li className="flex items-center gap-3">
              <div className="w-1 h-1 rounded-full bg-gray-400" />
              Totalmente gratuito
            </li>
          </ul>
        </div>

      </main>

      {/* Footer - Minimal */}
      <footer className="border-t border-gray-100 dark:border-gray-800 mt-20">
        <div className="max-w-5xl mx-auto px-6 py-8">
          <p className="text-xs text-gray-400 dark:text-gray-600">
            © 2024 OrçaCivil. Ferramenta gratuita para orçamentos de construção.
          </p>
        </div>
      </footer>
    </div>
  );
}
