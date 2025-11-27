'use client';

import { useRouter } from 'next/navigation';
import { FilePlus } from 'lucide-react';
import AiAssistant from '@/components/AiAssistant';

export default function Home() {
  const router = useRouter();

  const handleStart = (type: 'obra_nova') => {
    const newId = crypto.randomUUID();
    router.push(`/editor/${newId}?type=${type}`);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#191919] transition-colors relative isolate">
      {/* Main Content */}
      <main className="max-w-3xl mx-auto px-6 pt-20 pb-16 relative">

        {/* Hero Section - Minimal */}
        <div className="mb-16 relative isolate text-center">
          {/* Background Image */}


          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-gray-100 mb-4 tracking-tight leading-tight relative z-10">
            ObraCalc
          </h1>
          <p className="text-base text-gray-600 dark:text-gray-400 max-w-xl mx-auto leading-relaxed relative z-10">
            A forma mais rápida de criar orçamentos profissionais.
          </p>
        </div>

        {/* AI Assistant */}
        <div className="mb-12">
          <AiAssistant />
        </div>

        {/* CTA Button - Clean */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full max-w-2xl mx-auto">
          <button
            onClick={() => handleStart('obra_nova')}
            className="w-full py-4 px-8 bg-gray-900 hover:bg-gray-800 dark:bg-white dark:hover:bg-gray-100 text-white dark:text-gray-900 rounded-xl font-medium transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2 group"
          >
            <FilePlus size={20} className="group-hover:scale-110 transition-transform" />
            Começar orçamento gratis
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
            © 2024 ObraCalc. Ferramenta gratuita para orçamentos de construção.
          </p>
        </div>
      </footer>
    </div>
  );
}
