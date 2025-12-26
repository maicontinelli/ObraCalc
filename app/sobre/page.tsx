'use client';

import Link from 'next/link';

import { Button } from '@/components/Button';
import { Brain, Database, Users, TrendingUp, ShieldCheck, Lightbulb } from 'lucide-react';

export default function AboutPage() {
    return (
        <div className="min-h-screen flex flex-col bg-white dark:bg-[#191919]">
            <main className="flex-grow pt-20 pb-24">
                {/* Hero Section */}
                <div className="container mx-auto px-4 mb-24">
                    <div className="max-w-4xl mx-auto text-center">
                        <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-gray-900 dark:text-white mb-8 leading-tight">
                            Transformando a engenharia de custos com <span className="text-primary">inteligência e precisão</span>
                        </h1>
                        <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 leading-relaxed max-w-3xl mx-auto">
                            Nascemos da experiência de quem vive o canteiro de obras e da visão de que orçar não precisa ser complexo, demorado ou impreciso.
                        </p>
                    </div>
                </div>

                {/* The Story Section */}
                <div className="container mx-auto px-4 mb-32">
                    <div className="grid md:grid-cols-2 gap-16 items-center max-w-6xl mx-auto">
                        <div className="relative">
                            <div className="absolute -top-4 -left-4 w-24 h-24 bg-primary/10 rounded-full blur-2xl"></div>
                            <div className="relative bg-gray-50 dark:bg-gray-800/50 p-8 rounded-3xl border border-gray-100 dark:border-gray-800">
                                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                                    De Engenheiro para Engenheiro
                                </h3>
                                <p className="text-lg text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                                    &quot;Após anos gerenciando obras e lidando com a complexidade das tabelas SINAPI, ORSE e SICRO, percebi que a maior dor do nosso setor não era a falta de dados, mas a dificuldade em acessá-los e conectá-los de forma inteligente.&quot;
                                </p>
                                <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                                    O Obraflow nasceu dessa necessidade: unir a solidez da engenharia civil sênior com a agilidade da Inteligência Artificial moderna. Não é apenas uma calculadora, é um assistente que entende de obra.
                                </p>
                            </div>
                        </div>
                        <div>
                            <div className="grid grid-cols-2 gap-6">
                                <div className="bg-white dark:bg-[#191919] p-6 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm">
                                    <Database className="w-8 h-8 text-primary mb-4" />
                                    <h4 className="font-bold text-gray-900 dark:text-white mb-2">Bases Oficiais</h4>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">SINAPI, ORSE e SICRO integrados e atualizados.</p>
                                </div>
                                <div className="bg-white dark:bg-[#191919] p-6 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm mt-8">
                                    <Brain className="w-8 h-8 text-purple-600 mb-4" />
                                    <h4 className="font-bold text-gray-900 dark:text-white mb-2">IA Generativa</h4>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">Analisa, sugere e completa composições automaticamente.</p>
                                </div>
                                <div className="bg-white dark:bg-[#191919] p-6 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm">
                                    <ShieldCheck className="w-8 h-8 text-green-600 mb-4" />
                                    <h4 className="font-bold text-gray-900 dark:text-white mb-2">Confiabilidade</h4>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">Dados auditáveis e transparentes para seus clientes.</p>
                                </div>
                                <div className="bg-white dark:bg-[#191919] p-6 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm mt-8">
                                    <TrendingUp className="w-8 h-8 text-blue-600 mb-4" />
                                    <h4 className="font-bold text-gray-900 dark:text-white mb-2">Produtividade</h4>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">Redução de até 80% no tempo de orçamentação.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Mission Section */}
                <div className="bg-gray-50 dark:bg-gray-800/30 py-24 mb-24">
                    <div className="container mx-auto px-4">
                        <div className="max-w-3xl mx-auto text-center">
                            <Lightbulb className="w-12 h-12 text-yellow-500 mx-auto mb-6" />
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-8">
                                Nossa Missão
                            </h2>
                            <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed mb-12">
                                Democratizar o acesso a orçamentos profissionais de alta precisão. Queremos que desde o recém-formado até a grande construtora tenham em mãos o poder de precificar com segurança, velocidade e inteligência.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Team/Community Section */}
                <div className="container mx-auto px-4 mb-24">
                    <div className="max-w-5xl mx-auto bg-primary text-white rounded-3xl p-12 md:p-20 text-center relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-full opacity-10">
                            <div className="absolute top-10 left-10 w-32 h-32 bg-white rounded-full blur-3xl"></div>
                            <div className="absolute bottom-10 right-10 w-48 h-48 bg-white rounded-full blur-3xl"></div>
                        </div>

                        <div className="relative z-10">
                            <Users className="w-16 h-16 mx-auto mb-8 text-white/90" />
                            <h2 className="text-3xl md:text-5xl font-bold mb-6">
                                Construído para a comunidade
                            </h2>
                            <p className="text-xl opacity-90 mb-10 max-w-2xl mx-auto">
                                O Obraflow é uma ferramenta viva, que evolui com o feedback de milhares de profissionais que a utilizam diariamente.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <Link href="/auth/cadastro">
                                    <Button size="lg" className="bg-white text-primary hover:bg-white/90 border-0 text-lg h-12 px-8 font-semibold">
                                        Começar Agora
                                    </Button>
                                </Link>
                                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 text-lg h-12 px-8 font-semibold bg-transparent">
                                    Falar com o Fundador
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

        </div>
    );
}
