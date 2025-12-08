'use client';

import { Award, BookOpen, CheckCircle2, Mail, MessageSquare, Phone, Shield, Star, TrendingUp, Users } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

export default function ContatoPage() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        message: ''
    });
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Aqui você pode adicionar integração com API de email
        setIsSubmitted(true);
        setTimeout(() => setIsSubmitted(false), 3000);
    };

    const testimonials = [
        {
            name: "Maria Silva",
            role: "Arquiteta | Construtora MS Arquitetura",
            text: "Trabalho com o Engenheiro há mais de 5 anos. Sua precisão nos orçamentos e conhecimento técnico nos ajudaram a entregar mais de 50 projetos dentro do prazo e orçamento.",
            rating: 5
        },
        {
            name: "João Santos",
            role: "Diretor de Obras | Construtora Horizonte",
            text: "Profissional extremamente competente. Seus orçamentos são detalhados, realistas e sempre nos auxiliam na tomada de decisões estratégicas. Recomendo sem hesitação.",
            rating: 5
        },
        {
            name: "Carlos Mendes",
            role: "Engenheiro Civil | Infraworks Engenharia",
            text: "Parceiro confiável em grandes empreendimentos. Domínio técnico excepcional em cronogramas, custos e normas. Fundamental para o sucesso de nossos projetos.",
            rating: 5
        }
    ];

    const expertise = [
        { icon: BookOpen, title: "25+ Anos de Experiência", description: "Carreira consolidada no mercado de construção civil" },
        { icon: Award, title: "CREA Ativo", description: "Engenheiro Civil registrado e especializado" },
        { icon: Users, title: "500+ Projetos", description: "Orçamentos para obras de pequeno a grande porte" },
        { icon: Shield, title: "Precisão Garantida", description: "Metodologia técnica com base em SINAPI/TCPO" },
        { icon: TrendingUp, title: "Otimização de Custos", description: "Redução média de 15% nos custos de projeto" },
        { icon: CheckCircle2, title: "Conformidade Total", description: "100% de acordo com normas técnicas vigentes" }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-b from-white via-gray-50 to-white dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
            {/* Hero Section */}
            <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-white to-primary/5 dark:from-primary/10 dark:via-gray-900 dark:to-primary/10 py-20 border-b border-gray-100 dark:border-gray-800">
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl"></div>
                    <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl"></div>
                </div>

                <div className="container mx-auto px-4 relative z-10">
                    <div className="max-w-4xl mx-auto text-center">
                        <div className="inline-flex items-center gap-2 bg-primary/10 dark:bg-primary/20 text-primary px-4 py-2 rounded-full mb-6">
                            <Award className="w-4 h-4" />
                            <span className="text-sm font-semibold">Engenheiro Civil • CREA-BA</span>
                        </div>

                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6">
                            Transformando Complexidade em{' '}
                            <span className="text-primary">Clareza</span>
                        </h1>

                        <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
                            Com mais de 25 anos dedicados à engenharia de custos e orçamentação, desenvolvi o <strong>ObraCalc</strong> para democratizar
                            o acesso a orçamentos profissionais. Minha missão é simplificar processos complexos e tornar a construção civil mais acessível e transparente.
                        </p>

                        <div className="flex flex-wrap gap-4 justify-center">
                            <Link
                                href="#formulario"
                                className="btn btn-primary px-8 py-3 text-lg flex items-center gap-2 shadow-lg hover:shadow-xl transition-all"
                            >
                                <MessageSquare className="w-5 h-5" />
                                Entrar em Contato
                            </Link>
                            <Link
                                href="/sobre"
                                className="btn bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 px-8 py-3 text-lg hover:border-primary dark:hover:border-primary transition-all"
                            >
                                Conhecer o ObraCalc
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Expertise Grid */}
            <section className="py-20">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                            Experiência e Especialização
                        </h2>
                        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                            Décadas de atuação resultaram em metodologias consolidadas e resultados comprovados
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
                        {expertise.map((item, idx) => (
                            <div
                                key={idx}
                                className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 hover:border-primary dark:hover:border-primary transition-all hover:shadow-lg group"
                            >
                                <div className="w-12 h-12 bg-primary/10 dark:bg-primary/20 rounded-lg flex items-center justify-center mb-4 group-hover:bg-primary group-hover:scale-110 transition-all">
                                    <item.icon className="w-6 h-6 text-primary group-hover:text-white transition-colors" />
                                </div>
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{item.title}</h3>
                                <p className="text-gray-600 dark:text-gray-300">{item.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Mission Statement */}
            <section className="py-20 bg-gradient-to-br from-primary/5 to-blue-500/5 dark:from-primary/10 dark:to-blue-500/10">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto">
                        <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 md:p-12 border border-gray-200 dark:border-gray-700 shadow-xl">
                            <div className="flex items-start gap-4 mb-6">
                                <div className="w-12 h-12 bg-primary/10 dark:bg-primary/20 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <MessageSquare className="w-6 h-6 text-primary" />
                                </div>
                                <div>
                                    <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-4">
                                        Por que criei o ObraCalc?
                                    </h2>
                                    <div className="space-y-4 text-gray-600 dark:text-gray-300 leading-relaxed">
                                        <p>
                                            Ao longo da minha carreira, vi inúmeros projetos fracassarem por falta de planejamento orçamentário adequado.
                                            Pequenos construtores, arquitetos autônomos e proprietários muitas vezes não têm acesso a ferramentas profissionais de orçamentação.
                                        </p>
                                        <p>
                                            <strong className="text-gray-900 dark:text-white">O ObraCalc nasceu dessa necessidade.</strong> Uma plataforma que combina
                                            inteligência artificial com décadas de conhecimento técnico, tornando orçamentos precisos acessíveis a todos –
                                            desde uma reforma residencial até grandes empreendimentos.
                                        </p>
                                        <p>
                                            Meu compromisso é com a <strong className="text-primary">transparência, precisão e democratização do conhecimento</strong> técnico
                                            na construção civil. Cada orçamento gerado reflete padrões profissionais rigorosos, normas técnicas atualizadas e
                                            preços de mercado reais.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Testimonials */}
            <section className="py-20">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                            Reconhecimento Profissional
                        </h2>
                        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                            O que parceiros e clientes dizem sobre nosso trabalho
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                        {testimonials.map((testimonial, idx) => (
                            <div
                                key={idx}
                                className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all"
                            >
                                <div className="flex gap-1 mb-4">
                                    {[...Array(testimonial.rating)].map((_, i) => (
                                        <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                                    ))}
                                </div>
                                <p className="text-gray-600 dark:text-gray-300 mb-6 italic">
                                    "{testimonial.text}"
                                </p>
                                <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                                    <p className="font-bold text-gray-900 dark:text-white">{testimonial.name}</p>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">{testimonial.role}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Contact Form */}
            <section id="formulario" className="py-20 bg-gradient-to-br from-gray-50 to-white dark:from-gray-800 dark:to-gray-900">
                <div className="container mx-auto px-4">
                    <div className="max-w-2xl mx-auto">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                                Vamos Conversar?
                            </h2>
                            <p className="text-lg text-gray-600 dark:text-gray-300">
                                Entre em contato para dúvidas, parcerias ou suporte técnico
                            </p>
                        </div>

                        <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 border border-gray-200 dark:border-gray-700 shadow-xl">
                            {isSubmitted ? (
                                <div className="text-center py-8">
                                    <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <CheckCircle2 className="w-8 h-8 text-green-600 dark:text-green-400" />
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Mensagem Enviada!</h3>
                                    <p className="text-gray-600 dark:text-gray-300">Retornaremos em breve.</p>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Nome Completo *
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                                            placeholder="Seu nome"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Email *
                                        </label>
                                        <input
                                            type="email"
                                            required
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                                            placeholder="seu@email.com"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Telefone
                                        </label>
                                        <input
                                            type="tel"
                                            value={formData.phone}
                                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                            className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                                            placeholder="(00) 00000-0000"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Mensagem *
                                        </label>
                                        <textarea
                                            required
                                            rows={5}
                                            value={formData.message}
                                            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                            className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent transition-all resize-none"
                                            placeholder="Como podemos ajudar?"
                                        ></textarea>
                                    </div>

                                    <button
                                        type="submit"
                                        className="w-full btn btn-primary py-4 text-lg font-semibold flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition-all"
                                    >
                                        <Mail className="w-5 h-5" />
                                        Enviar Mensagem
                                    </button>
                                </form>
                            )}
                        </div>

                        {/* Direct Contact Info */}
                        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700 flex items-center gap-4">
                                <div className="w-12 h-12 bg-primary/10 dark:bg-primary/20 rounded-lg flex items-center justify-center">
                                    <Mail className="w-6 h-6 text-primary" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Email</p>
                                    <p className="font-semibold text-gray-900 dark:text-white">maicontinelli@gmail.com</p>
                                </div>
                            </div>

                            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700 flex items-center gap-4">
                                <div className="w-12 h-12 bg-primary/10 dark:bg-primary/20 rounded-lg flex items-center justify-center">
                                    <Phone className="w-6 h-6 text-primary" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Telefone</p>
                                    <p className="font-semibold text-gray-900 dark:text-white">(73) 99950-3554</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
