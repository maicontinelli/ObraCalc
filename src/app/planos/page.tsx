'use client';

import { Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Footer } from '@/components/Footer';

export default function PlansPage() {
    const plans = [
        {
            name: 'Grátis',
            price: 'R$ 0',
            period: '/mês',
            description: 'Para quem quer testar e criar orçamentos simples.',
            features: [
                'Acesso básico a recursos',
                'Criação de orçamentos',
                'Exportação em PDF simples',
            ],
            limitations: [
                'Não salva orçamentos permanentemente',
                'Sem painel de gerenciamento',
                'Apenas 1 usuário',
            ],
            cta: 'Começar Grátis',
            popular: false,
        },
        {
            name: 'Mais',
            price: 'R$ 20,00',
            period: '/mês',
            description: 'Para profissionais que precisam de organização e histórico.',
            features: [
                'Tudo do plano Grátis',
                'Salva todos os orçamentos',
                'Gerenciamento por cliente e serviço',
                'Funções extras de cálculo',
                'Acesso para até 5 usuários',
            ],
            limitations: [],
            cta: 'Assinar Plano Mais',
            popular: true,
        },
        {
            name: 'Negócio',
            price: 'R$ 70,00',
            period: '/mês',
            description: 'Para empresas que precisam de colaboração e controle total.',
            features: [
                'Tudo do plano Mais',
                'Gerenciamento compartilhável',
                'Painel administrativo avançado',
                'Suporte prioritário',
                'Acesso para até 20 usuários',
            ],
            limitations: [],
            cta: 'Falar com Vendas',
            popular: false,
        },
    ];

    return (
        <div className="min-h-screen flex flex-col bg-white dark:bg-[#191919]">
            <main className="flex-grow pt-20 pb-24">
                <div className="container mx-auto px-4">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900 dark:text-white mb-6">
                            Escolha o plano ideal para sua obra
                        </h1>
                        <p className="text-xl text-gray-600 dark:text-gray-300">
                            Comece gratuitamente e evolua conforme suas necessidades de gerenciamento e equipe.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
                        {plans.map((plan) => (
                            <div
                                key={plan.name}
                                className={`relative flex flex-col p-8 rounded-2xl border ${plan.popular
                                    ? 'border-primary shadow-lg ring-1 ring-primary'
                                    : 'border-gray-200 dark:border-gray-800'
                                    } bg-white dark:bg-[#191919] transition-shadow hover:shadow-xl`}
                            >
                                {plan.popular && (
                                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-primary text-white text-sm font-medium rounded-full">
                                        Mais Popular
                                    </div>
                                )}

                                <div className="mb-8">
                                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                                        {plan.name}
                                    </h3>
                                    <div className="flex items-baseline gap-1 mb-4">
                                        <span className="text-4xl font-bold text-gray-900 dark:text-white">
                                            {plan.price}
                                        </span>
                                        <span className="text-gray-500 dark:text-gray-400">
                                            {plan.period}
                                        </span>
                                    </div>
                                    <p className="text-gray-600 dark:text-gray-300">
                                        {plan.description}
                                    </p>
                                </div>

                                <div className="flex-grow mb-8">
                                    <ul className="space-y-4">
                                        {plan.features.map((feature) => (
                                            <li key={feature} className="flex items-start gap-3">
                                                <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                                                <span className="text-gray-600 dark:text-gray-300 text-sm">
                                                    {feature}
                                                </span>
                                            </li>
                                        ))}
                                        {plan.limitations.map((limitation) => (
                                            <li key={limitation} className="flex items-start gap-3 opacity-60">
                                                <X className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                                                <span className="text-gray-500 dark:text-gray-400 text-sm">
                                                    {limitation}
                                                </span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <Button
                                    className={`w-full h-12 text-lg font-medium ${plan.popular
                                        ? 'bg-primary hover:bg-primary/90 text-white'
                                        : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700'
                                        }`}
                                    variant={plan.popular ? 'default' : 'outline'}
                                >
                                    {plan.cta}
                                </Button>
                            </div>
                        ))}
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
