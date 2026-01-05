'use client';

import { useState } from 'react';
import { Check, X } from 'lucide-react';
import { Button } from '@/components/Button';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';

export default function PlansPage() {
    const [loading, setLoading] = useState<string | null>(null);
    const supabase = createClient();

    const handleSubscribe = async (priceId: string) => {
        setLoading(priceId);
        try {
            const { data: { user } } = await supabase.auth.getUser();

            if (!user) {
                if (typeof window !== 'undefined') {
                    window.location.href = `/login?next=${encodeURIComponent(window.location.pathname)}`;
                }
                return;
            }

            const response = await fetch('/api/stripe/checkout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    priceId,
                    userId: user.id
                }),
            });

            const data = await response.json();

            if (data.url) {
                window.location.href = data.url;
            } else {
                console.error('Erro ao criar sessão de checkout:', data.error);
                alert(`Erro ao iniciar pagamento: ${data.error}`);
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
            description: 'Perfeito para testar e para pequenas reformas.',
            features: [
                'Até 5 orçamentos salvos',
                'Exportação PDF e HTML',
                'Painel de Controle (Dashboard)',
                'Acesso à IA de Orçamentos',
            ],
            limitations: [
                'Máximo de 20 itens por obra',
                'Marca d\'água nos relatórios',
                'Sem acesso a Leads de clientes',
            ],
            cta: 'Criar Conta Grátis',
            href: '/login',
            priceId: null,
            popular: false,
        },
        {
            name: 'Profissional',
            price: 'R$ 29,90',
            period: '/mês',
            description: 'Para engenheiros e arquitetos que querem liberdade total.',
            features: [
                'Orçamentos e itens ilimitados',
                'Sem marca d\'água',
                'Personalize com sua logo',
                'Histórico completo de obras',
                'Visualização de Leads (Clientes)',
                'Suporte prioritário via WhatsApp',
            ],
            limitations: [
                'Sem contato direto com Leads',
            ],
            cta: 'Assinar Profissional',
            href: null,
            priceId: 'price_1Sl8fkGZfnvqYwvYTdmFAUM4',
            popular: true,
        },
        {
            name: 'Empresarial',
            price: 'R$ 149,90',
            period: '/mês',
            description: 'Para construtoras que precisam de escala e novos clientes.',
            features: [
                'Tudo do plano Profissional',
                'Contato liberado com Leads',
                'Destaque no buscador de profissionais',
                'Badge de Conta Verificada',
                'Até 5 usuários (Equipe)',
            ],
            limitations: [],
            cta: 'Assinar Empresarial',
            href: null,
            priceId: 'price_1Sl8gZGZfnvqYwvYSqt716Vm',
            popular: false,
        },
    ];

    return (
        <div className="min-h-screen flex flex-col bg-background">
            <main className="flex-grow pb-24">
                <section className="relative overflow-hidden bg-gradient-to-br from-[#FF6600]/5 via-background to-[#FF6600]/5 py-20 border-b border-white/5 mb-16">
                    <div className="absolute inset-0 overflow-hidden">
                        <div className="absolute -top-40 -right-40 w-80 h-80 bg-[#FF6600]/10 rounded-full blur-3xl"></div>
                        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-[#FF6600]/10 rounded-full blur-3xl"></div>
                    </div>

                    <div className="container mx-auto px-4 relative z-10">
                        <div className="text-center max-w-3xl mx-auto">
                            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground mb-6">
                                Escolha o plano ideal para começar
                            </h1>
                            <p className="text-xl text-muted-foreground">
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
                                className={`relative flex flex-col p-8 rounded-2xl border bg-card transition-shadow hover:shadow-xl ${plan.popular
                                    ? 'border-[#FF6600] shadow-lg ring-1 ring-[#FF6600]'
                                    : 'border-border'
                                    }`}
                            >
                                {plan.popular && (
                                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-[#FF6600] text-white text-sm font-medium rounded-full">
                                        Mais Popular
                                    </div>
                                )}

                                <div className="mb-8">
                                    <h3 className="text-2xl font-bold text-foreground mb-2">
                                        {plan.name}
                                    </h3>
                                    <div className="flex items-baseline gap-1 mb-4">
                                        <span className="text-4xl font-bold text-foreground">
                                            {plan.price}
                                        </span>
                                        <span className="text-muted-foreground">
                                            {plan.period}
                                        </span>
                                    </div>
                                    <p className="text-muted-foreground">
                                        {plan.description}
                                    </p>
                                </div>

                                <div className="flex-grow mb-8">
                                    <ul className="space-y-4">
                                        {plan.features.map((feature) => (
                                            <li key={feature} className="flex items-start gap-3">
                                                <Check className={`w-5 h-5 flex-shrink-0 mt-0.5 ${plan.popular ? 'text-[#FF6600]' : 'text-[#74D2E7]'
                                                    }`} />
                                                <span className="text-foreground text-sm">
                                                    {feature}
                                                </span>
                                            </li>
                                        ))}
                                        {plan.limitations.map((limitation) => (
                                            <li key={limitation} className="flex items-start gap-3">
                                                <X className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                                                <span className="text-muted-foreground text-sm line-through">
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
                                                ? 'bg-[#FF6600] hover:bg-[#FF6600]/90 text-white'
                                                : 'bg-card border border-input text-foreground hover:bg-accent hover:text-accent-foreground'
                                                }`}
                                            variant={plan.popular ? 'default' : 'outline'}
                                        >
                                            {plan.cta}
                                        </Button>
                                    </Link>
                                ) : (
                                    <Button
                                        className={`w-full h-12 text-lg font-medium ${plan.popular
                                            ? 'bg-[#FF6600] hover:bg-[#FF6600]/90 text-white'
                                            : 'bg-card border border-input text-foreground hover:bg-accent hover:text-accent-foreground'
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
