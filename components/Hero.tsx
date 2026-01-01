import AiAssistant from './AiAssistant';
import MathParticles from './MathParticles';
import Image from 'next/image';

export function Hero() {
    return (
        <section className="relative pt-12 pb-32 overflow-hidden bg-transparent">
            {/* Background elements removed */}

            <div className="container mx-auto px-4 relative z-10">
                <div className="flex flex-col md:flex-row items-center justify-center gap-6 mb-12">
                    <Image
                        src="/logo-v4.png"
                        alt="ObraCalc Logo"
                        width={100}
                        height={100}
                        className="drop-shadow-xl"
                    />
                    <h1 className="text-5xl md:text-7xl font-heading font-bold tracking-tight leading-tight">
                        <span className="text-foreground">
                            ObraCalc
                        </span>
                    </h1>
                </div>

                <h2 className="text-base md:text-lg text-muted-foreground font-medium text-center mb-10 max-w-2xl mx-auto leading-relaxed">
                    Crie orçamentos e relatórios de obra detalhados em segundos usando Inteligência Artificial.
                </h2>

                {/* AI Assistant Container (Search Bar) */}
                <div className="max-w-3xl mx-auto relative z-20 mb-8">
                    <AiAssistant />
                </div>
            </div>
        </section>
    );
}
