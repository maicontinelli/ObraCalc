import { NextResponse } from 'next/server';
import Stripe from 'stripe';

// Helper to initialize Stripe lazily
const getStripe = () => {
    const secretKey = process.env.STRIPE_SECRET_KEY;
    if (!secretKey) {
        throw new Error('STRIPE_SECRET_KEY is not defined');
    }
    return new Stripe(secretKey, {
        apiVersion: '2023-10-16',
    });
};

export async function POST(request: Request) {
    try {
        const { priceId, userId } = await request.json();

        if (!priceId) {
            return NextResponse.json(
                { error: 'Price ID is required' },
                { status: 400 }
            );
        }

        if (!userId) {
            return NextResponse.json(
                { error: 'User ID is required' },
                { status: 400 }
            );
        }

        // Create Checkout Session
        const stripe = getStripe();
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price: priceId,
                    quantity: 1,
                },
            ],
            mode: 'subscription',
            allow_promotion_codes: true,
            billing_address_collection: 'required',
            success_url: `${request.headers.get('origin')}/dashboard?success=true`,
            cancel_url: `${request.headers.get('origin')}/planos?canceled=true`,
            client_reference_id: userId,
            metadata: {
                userId: userId,
            },
            // Force Brazilian Portuguese
            locale: 'pt-BR',
            // Enable tax ID collection (CPF/CNPJ) - Important for Boleto/Pix compliance in Brazil
            tax_id_collection: {
                enabled: true,
            },
        });

        return NextResponse.json({ url: session.url });
    } catch (err: any) {
        console.error('Stripe Error:', err);
        return NextResponse.json(
            { error: err.message || 'Internal Server Error' },
            { status: 500 }
        );
    }
}
