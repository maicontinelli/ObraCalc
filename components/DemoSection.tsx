import Image from "next/image";

export function DemoSection() {
    return (
        <section className="py-24 bg-gray-50 dark:bg-gray-900/30 overflow-hidden">
            <div className="container mx-auto px-4">
                <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
                    <div className="lg:w-1/2">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
                            Veja como é simples criar um orçamento
                        </h2>
                        <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
                            Nossa interface intuitiva permite que você adicione itens, ajuste preços e gere relatórios em poucos cliques. A IA sugere materiais baseados no tipo de obra.
                        </p>
                        <ul className="space-y-4 mb-8">
                            {['Cadastro rápido de itens', 'Integração com SINAPI', 'Exportação em 1 clique'].map((item, i) => (
                                <li key={i} className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                                    <div className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="lg:w-1/2 relative flex justify-center">
                        <div className="absolute -inset-4 bg-gradient-to-r from-primary to-blue-500 rounded-full blur-3xl opacity-20 animate-pulse" />
                        <div className="relative w-full max-w-sm">
                            <Image
                                src="/iphone-preview-v2.webp"
                                alt="Demonstração do App"
                                width={600}
                                height={800}
                                className="w-full h-auto drop-shadow-2xl hover:scale-105 transition-transform duration-500"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
