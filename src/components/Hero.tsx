import AiAssistant from './AiAssistant';
import Image from 'next/image';

export function Hero() {
    return (
        <section className="relative pt-20 pb-32 overflow-hidden">
            <div className="container mx-auto px-4 relative z-10">
                <div className="text-center max-w-4xl mx-auto mb-12">
                    <div className="flex justify-center mb-6">
                        <Image
                            src="/obracalc-logo.png"
                            alt="ObraCalc Logo"
                            width={120}
                            height={120}
                            className="drop-shadow-xl"
                        />
                    </div>
                    <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-gray-900 dark:text-white mb-6 leading-tight">
                        Orçamento de obra <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-600 dark:from-blue-400 dark:to-primary">
                            em segundos com IA
                        </span>
                    </h1>
                    <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed">
                        Escreva de forma breve o que deseja fazer  e receba o orçamento imediato.
                    </p>
                </div>

                {/* AI Assistant Container */}
                <div className="max-w-3xl mx-auto relative z-20">
                    <AiAssistant />
                </div>

                {/* Background Elements */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 pointer-events-none">
                    <div className="absolute top-20 left-1/4 w-72 h-72 bg-primary/10 rounded-full blur-3xl mix-blend-multiply animate-blob" />
                    <div className="absolute top-20 right-1/4 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl mix-blend-multiply animate-blob animation-delay-2000" />
                    <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl mix-blend-multiply animate-blob animation-delay-4000" />
                </div>
            </div>
        </section>
    );
}
