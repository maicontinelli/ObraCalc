import { Calculator, FileText, Zap, Camera } from "lucide-react";
import Link from "next/link";

const features = [
    {
        icon: <Calculator className="h-6 w-6 text-primary dark:text-blue-400" />,
        title: "Orçamentos Inteligentes",
        description: "Cálculos precisos baseados na tabela SINAPI atualizada e preços médios de mercado por região."
    },
    {
        icon: <Zap className="h-6 w-6 text-primary dark:text-blue-400" />,
        title: "IA Generativa",
        description: "Descreva sua obra e nossa IA gera automaticamente a lista completa de materiais e serviços."
    },
    {
        icon: <FileText className="h-6 w-6 text-primary dark:text-blue-400" />,
        title: "Memorial de Topografia",
        description: "Gere memorial descritivo técnico + planilha Excel pronta para prefeitura e cartório.",
        link: "/topografia",
        linkText: "Acessar Topografia"
    },
    {
        icon: <Camera className="h-6 w-6 text-primary dark:text-blue-400" />,
        title: "Relatório Fotográfico",
        description: "IA analisa fotos da obra e gera relatório técnico profissional automaticamente.",
        link: "/relatorio-fotografico",
        linkText: "Novo: Relatório com IA"
    }
];

export function Features() {
    return (
        <section className="py-24 bg-white dark:bg-[#191919]">
            <div className="container mx-auto px-4">
                <div className="text-center max-w-2xl mx-auto mb-16">
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                        Fluxo Completo de Documentação com IA
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 text-lg">
                        Do orçamento ao relatório técnico — automatize seu processo com inteligência artificial.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {features.map((feature, index) => {
                        const content = (
                            <>
                                <div className="w-12 h-12 bg-white dark:bg-gray-700 rounded-xl flex items-center justify-center shadow-sm mb-4">
                                    {feature.icon}
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                                    {feature.title}
                                </h3>
                                <p className="text-gray-600 dark:text-gray-400 leading-relaxed flex-grow">
                                    {feature.description}
                                </p>
                            </>
                        );

                        const className = "p-6 rounded-2xl bg-gray-50 dark:bg-gray-800/50 hover:bg-indigo-50 dark:hover:bg-gray-800 transition-colors border border-gray-100 dark:border-gray-700/50 flex flex-col h-full";

                        if ((feature as any).link) {
                            return (
                                <Link key={index} href={(feature as any).link} className={className}>
                                    {content}
                                </Link>
                            );
                        }

                        return (
                            <div key={index} className={className}>
                                {content}
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
