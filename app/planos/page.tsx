'use client';

import { useState } from 'react';
import { Check, X } from 'lucide-react';
import { Button } from '@/components/Button';
import Link from 'next/link';



export default function PlansPage() {
    const [loading, setLoading] = useState<string | null>(null);

    const handleSubscribe = async (priceId: string) => {
        setLoading(priceId);
        try {
            const response = await fetch('/api/stripe/checkout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ priceId }),
            });

            const data = await response.json();

            if (data.url) {
                window.location.href = data.url;
            } else {
                console.error('Erro ao criar sessão de checkout:', data.error);
                alert('Ocorreu um erro ao iniciar o pagamento. Tente novamente.');
            }
        } catch (error) {
            console.error('Erro:', error);
            alert('Erro de conexão. Verifique sua internet.');
        } finally {
            setLoading(null);
        }
    };

    const plans = [
        {
            name: 'Grátis',
            price: 'R$ 0',
            period: '/mês',
            description: 'Ideal para conhecer a ferramenta e criar orçamentos rápidos.',
            features: [
                'Criação de orçamentos (Lim. 20 itens)',
                'Salva até 3 orçamentos na nuvem',
                'Exportação em PDF e HTML',
                'Acesso à IA de Orçamentos',
            ],
            limitations: [
                'Relatórios com marca d\'água',
                'Limite de itens e salvamentos',
                'Sem histórico ilimitado',
            ],
            cta: 'Começar Grátis',
            href: '/login', // Mantém link interno para login
            priceId: null,
            popular: false,
        },
        {
            name: 'Profissional',
            price: 'R$ 18,30',
            period: '/mês',
            description: 'Uso profissional ilimitado. Teste 30 dias grátis.',
            features: [
                'Itens ilimitados por orçamento',
                'Histórico de orçamentos ilimitado',
                'Relatórios limpos (Sem marca d\'água)',
                'Gerenciamento de clientes e serviços',
                'Base de dados ampliada',
                'Acesso para até 2 usuários',
            ],
            limitations: [],
            cta: 'Assinar',
            href: 'https://buy.stripe.com/00w28rbqrgAp10Q51d6g800',
            priceId: null, // Usando Link de Pagamento direto
            popular: true,
        },
        {
            name: 'Negócio',
            price: 'R$ 139,90',
            period: '/mês',
            description: 'Para empresas que precisam de colaboração e controle total.',
            features: [
                'Tudo do plano Profissional',
                'Gerenciamento compartilhável',
                'Painel administrativo avançado',
                'Suporte prioritário',
                'Acesso para até 9 usuários',
                'Personalização de relatórios',
            ],
            limitations: [],
            cta: 'Assinar', // Alterado de "Falar com Vendas" para fluxo direto
            href: null,
            priceId: 'price_PLACEHOLDER_NEGOCIO', // USUÁRIO DEVE SUBSTITUIR ISSO
            popular: false,
        },
    ];

    return (
        <div className="min-h-screen flex flex-col bg-white dark:bg-[#191919]">
            <main className="flex-grow pb-24">
                <section className="relative overflow-hidden bg-gradient-to-br from-[#74D2E7]/5 via-white to-[#74D2E7]/5 dark:from-[#74D2E7]/10 dark:via-gray-900 dark:to-[#74D2E7]/10 py-20 border-b border-gray-100 dark:border-gray-800 mb-16">
                    <div className="absolute inset-0 overflow-hidden">
                        <div className="absolute -top-40 -right-40 w-80 h-80 bg-[#74D2E7]/10 rounded-full blur-3xl"></div>
                        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-[#74D2E7]/10 rounded-full blur-3xl"></div>
                    </div>

                    <div className="container mx-auto px-4 relative z-10">
                        <div className="text-center max-w-3xl mx-auto">
                            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900 dark:text-white mb-6">
                                Escolha o plano ideal para começar
                            </h1>
                            <p className="text-xl text-gray-600 dark:text-gray-300">
                                Comece gratuitamente e evolua conforme suas necessidades de gerenciamento e equipe.
                            </p>
                        </div>
                    </div>
                </section>

                <div className="container mx-auto px-4">
                    <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
                        {plans.map((plan) => (
                            <div
                                key={plan.name}
                                className={`relative flex flex-col p-8 rounded-2xl border ${plan.popular
                                    ? 'border-[#74D2E7] shadow-lg ring-1 ring-[#74D2E7]'
                                    : 'border-gray-200 dark:border-gray-800'
                                    } bg-white dark:bg-[#191919] transition-shadow hover:shadow-xl`}
                            >
                                {plan.popular && (
                                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-[#74D2E7] text-white text-sm font-medium rounded-full">
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
                                                <Check className="w-5 h-5 text-[#74D2E7] flex-shrink-0 mt-0.5" />
                                                <span className="text-gray-600 dark:text-gray-300 text-sm">
                                                    {feature}
                                                </span>
                                            </li>
                                        ))}
                                        {plan.limitations.map((limitation) => (
                                            <li key={limitation} className="flex items-start gap-3">
                                                <X className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                                                <span className="text-gray-900 dark:text-gray-400 text-sm line-through">
                                                    {limitation}
                                                </span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                {plan.href ? (
                                    <Link
                                        href={plan.href}
                                        className="w-full"
                                        target={plan.href.startsWith('http') ? '_blank' : '_self'}
                                    >
                                        <Button
                                            className={`w-full h-12 text-lg font-medium ${plan.popular
                                                ? 'bg-[#74D2E7] hover:bg-[#74D2E7]/90 text-white'
                                                : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700'
                                                }`}
                                            variant={plan.popular ? 'default' : 'outline'}
                                        >
                                            {plan.cta}
                                        </Button>
                                    </Link>
                                ) : (
                                    <Button
                                        className={`w-full h-12 text-lg font-medium ${plan.popular
                                            ? 'bg-[#74D2E7] hover:bg-[#74D2E7]/90 text-white'
                                            : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700'
                                            }`}
                                        variant={plan.popular ? 'default' : 'outline'}
                                        onClick={() => plan.priceId && handleSubscribe(plan.priceId)}
                                        disabled={loading === plan.priceId}
                                    >
                                        {loading === plan.priceId ? 'Processando...' : plan.cta}
                                    </Button>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </main>
        </div>
    );
}
