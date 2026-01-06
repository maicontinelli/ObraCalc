import AiAssistant from './AiAssistant';
import MathParticles from './MathParticles';
import Image from 'next/image';

export function Hero() {
    return (
        <section className="relative pt-28 pb-40 bg-transparent">
            {/* Background elements removed */}

            <div className="container mx-auto px-4 relative z-30 max-w-5xl">
                <div className="flex flex-col items-center justify-center gap-6 mb-8 text-center">
                    <h1 className="text-2xl md:text-4xl font-heading font-medium tracking-tight leading-tight text-[#3D3A36] dark:text-foreground">
                        Calcule custos de obra <br className="block md:hidden" /> em minutos
                    </h1>
                </div>

                {/* AI Assistant Container (Search Bar) */}
                <div className="max-w-3xl mx-auto relative z-20 mb-8 mt-6">
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
