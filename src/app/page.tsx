'use client';

import { useRouter } from 'next/navigation';
import { Building2, Hammer, ArrowRight, CheckCircle2, Moon, Sun } from 'lucide-react';
import AiAssistant from '@/components/AiAssistant';
import { useTheme } from '@/contexts/ThemeContext';

export default function Home() {
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();

  const handleStart = (type: 'obra_nova' | 'reforma') => {
    const newId = crypto.randomUUID();
    router.push(`/editor/${newId}?type=${type}`);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 flex flex-col font-sans transition-colors">
      {/* Navbar */}
      <nav className="w-full border-b border-gray-100 dark:border-gray-800 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-primary/10 dark:bg-primary/20 p-2 rounded-lg">
              <Building2 className="text-primary" size={24} />
            </div>
            <span className="text-xl font-bold text-gray-900 dark:text-gray-100 tracking-tight">Orça<span className="text-primary">Civil</span></span>
          </div>
          <button
            onClick={toggleTheme}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full text-gray-500 dark:text-gray-400 transition-colors"
            title={theme === 'dark' ? 'Modo Claro' : 'Modo Escuro'}
          >
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-8 sm:py-20">
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-16">
          <h1 className="text-3xl sm:text-5xl font-extrabold text-gray-900 dark:text-gray-100 mb-4 sm:mb-6 tracking-tight leading-tight">
            Orçamentos de obra, <br className="hidden sm:block" />
            <span className="text-primary">simplificados.</span>
          </h1>
          <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400 mb-6 sm:mb-8 max-w-2xl mx-auto leading-relaxed">
            Crie estimativas profissionais para construção ou reforma em segundos.
            Sem planilhas complexas, sem cadastro.
          </p>
        </div>

        {/* Selection Cards */}
        <div className="grid md:grid-cols-2 gap-4 sm:gap-6 w-full max-w-4xl mx-auto">

          {/* Card: Obra Nova */}
          <button
            onClick={() => handleStart('obra_nova')}
            className="group relative bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 sm:p-8 hover:border-primary/50 dark:hover:border-primary/50 hover:shadow-xl hover:shadow-primary/1 transition-all duration-300 text-left flex flex-col h-full"
          >
            <div className="absolute top-0 right-0 p-4 sm:p-6 opacity-10 group-hover:opacity-20 transition-opacity">
              <Building2 size={80} className="sm:w-[120px] sm:h-[120px]" />
            </div>

            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary/10 dark:bg-primary/20 rounded-xl flex items-center justify-center text-primary mb-4 sm:mb-6 group-hover:scale-110 transition-transform duration-300">
              <Building2 size={20} className="sm:w-6 sm:h-6" />
            </div>

            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2 sm:mb-3">Construção Nova</h2>
            <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400 mb-6 sm:mb-8 leading-relaxed">
              Ideal para obras do zero. Inclui etapas de fundação, estrutura, alvenaria, cobertura e acabamentos.
            </p>

            <div className="mt-auto flex items-center text-primary font-semibold text-sm sm:text-base group-hover:translate-x-2 transition-transform">
              Começar Projeto <ArrowRight size={16} className="ml-2 sm:w-[18px] sm:h-[18px]" />
            </div>
          </button>

          {/* Card: Reforma */}
          <button
            onClick={() => handleStart('reforma')}
            className="group relative bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 sm:p-8 hover:border-orange-500/50 dark:hover:border-orange-500/50 hover:shadow-xl hover:shadow-orange-500/5 transition-all duration-300 text-left flex flex-col h-full"
          >
            <div className="absolute top-0 right-0 p-4 sm:p-6 opacity-10 group-hover:opacity-20 transition-opacity">
              <Hammer size={80} className="sm:w-[120px] sm:h-[120px]" />
            </div>

            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-orange-50 dark:bg-orange-900/20 rounded-xl flex items-center justify-center text-orange-600 dark:text-orange-400 mb-4 sm:mb-6 group-hover:scale-110 transition-transform duration-300">
              <Hammer size={20} className="sm:w-6 sm:h-6" />
            </div>

            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2 sm:mb-3">Reforma & Reparos</h2>
            <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400 mb-6 sm:mb-8 leading-relaxed">
              Perfeito para renovações. Focado em demolição, troca de revestimentos, pintura e instalações.
            </p>

            <div className="mt-auto flex items-center text-orange-600 dark:text-orange-400 font-semibold text-sm sm:text-base group-hover:translate-x-2 transition-transform">
              Iniciar Reforma <ArrowRight size={16} className="ml-2 sm:w-[18px] sm:h-[18px]" />
            </div>
          </button>

        </div>

        {/* AI Assistant */}
        <AiAssistant />

        {/* Trust Indicators */}
        <div className="mt-8 sm:mt-12 flex flex-wrap justify-center gap-4 sm:gap-8 text-xs sm:text-sm text-gray-500 dark:text-gray-400">
          <div className="flex items-center gap-2">
            <CheckCircle2 size={14} className="text-primary sm:w-4 sm:h-4" />
            <span>Base SINAPI Atualizada</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 size={14} className="text-primary sm:w-4 sm:h-4" />
            <span>Exportação em PDF/HTML</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 size={14} className="text-primary sm:w-4 sm:h-4" />
            <span>Totalmente Gratuito</span>
          </div>
        </div>
      </main>
    </div>
  );
}
