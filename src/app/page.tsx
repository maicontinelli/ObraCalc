'use client';

import { useRouter } from 'next/navigation';
import { Sparkles, ArrowRight } from 'lucide-react';
import AiAssistant from '@/components/AiAssistant';
import { useTheme } from '@/contexts/ThemeContext';

export default function Home() {
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();

  const handleStart = (type: 'obra_nova') => {
    const newId = crypto.randomUUID();
    router.push(`/editor/${newId}?type=${type}`);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#191919] transition-colors">
      {/* Navbar - Ultra minimal */}
      <nav className="border-b border-gray-100 dark:border-gray-800">
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
      <main className="max-w-3xl mx-auto px-6 pt-20 pb-16">

        {/* Hero Section - Minimal */}
        <div className="mb-16">
          <h1 className="text-4xl sm:text-5xl font-normal text-gray-900 dark:text-gray-100 mb-4 tracking-tight leading-tight">
            Orçamentos de obra,<br />simplificados
          </h1>
          <p className="text-base text-gray-600 dark:text-gray-400 max-w-xl leading-relaxed">
            Crie estimativas profissionais em segundos. Sem planilhas complexas, sem cadastro.
          </p>
        </div>

        {/* AI Assistant */}
        <div className="mb-12">
          <AiAssistant />
        </div>

        {/* CTA Button - Clean */}
        <div className="mb-16">
          <button
            onClick={() => handleStart('obra_nova')}
            className="group inline-flex items-center gap-2 px-6 py-3 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 rounded-lg hover:bg-gray-800 dark:hover:bg-gray-200 transition-all text-sm font-medium"
          >
            Começar orçamento manual
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Features - Minimal list */}
        <div className="border-t border-gray-100 dark:border-gray-800 pt-12">
          <ul className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
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
