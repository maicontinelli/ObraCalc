import AiAssistant from './AiAssistant';
import MathParticles from './MathParticles';
import Image from 'next/image';

export function Hero() {
    return (
        <section className="relative pt-20 pb-40 bg-transparent">
            {/* Background elements removed */}

            <div className="container mx-auto px-4 relative z-30">
                <div className="flex flex-col md:flex-row items-center justify-center gap-6 mb-2">
                    <Image
                        src="/logo-test.webp"
                        alt="ObraCalc Logo"
                        width={100}
                        height={100}
                        className="drop-shadow-xl"
                    />
                    <h1 className="text-5xl md:text-7xl font-heading font-bold tracking-tight leading-tight">
                        <span className="text-[#3D3A36] dark:text-foreground">
                            Obra Plana
                        </span>
                    </h1>
                </div>

                <h2 className="text-base md:text-lg text-muted-foreground font-medium text-center mb-6 max-w-2xl mx-auto leading-relaxed">
                    A forma mais simples de calcular custos de construção e reforma — orçamento em minutos
                </h2>

                {/* AI Assistant Container (Search Bar) */}
                <div className="max-w-3xl mx-auto relative z-20 mb-8 mt-28">
                    <AiAssistant />
                </div>

                {/* Footer Features */}
                <div className="flex flex-wrap items-center justify-center gap-3 md:gap-6 text-xs md:text-sm text-gray-500 dark:text-gray-400 font-medium -mt-4">
                    <span>Sem cadastro</span>
                    <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                    <span>Linguagem simples</span>
                    <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                    <span>IA avançada</span>
                </div>
            </div>
        </section>
    );
}
