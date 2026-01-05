import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2024-12-18.acacia' as any,
});

// Initialize Supabase Admin Client (needed to write to protected tables/fields)
// We need SERVICE_ROLE_KEY to bypass RLS and update user tiers securely
const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
    const body = await req.text();
    const signature = (await headers()).get('Stripe-Signature') as string;

    let event: Stripe.Event;

    try {
        if (!process.env.STRIPE_WEBHOOK_SECRET) {
            throw new Error('STRIPE_WEBHOOK_SECRET is not set');
        }
        event = stripe.webhooks.constructEvent(
            body,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET
        );
    } catch (error: any) {
        console.error(`Webhook Error: ${error.message}`);
        return new NextResponse(`Webhook Error: ${error.message}`, { status: 400 });
    }

    const session = event.data.object as Stripe.Checkout.Session;

    // Handle the event
    if (event.type === 'checkout.session.completed') {
        const userId = session.metadata?.userId || session.client_reference_id;

        // Retrieve subscription details to verify which product was bought
        const subscriptionId = session.subscription as string;
        const subscription = await stripe.subscriptions.retrieve(subscriptionId);
        const priceId = subscription.items.data[0].price.id;

        // Map price IDs to Tiers (This should match what is in app/planos/page.tsx)
        let newTier = 'free';
        if (priceId === 'price_1Sl8fkGZfnvqYwvYTdmFAUM4') {
            newTier = 'pro';
        } else if (priceId === 'price_1Sl8gZGZfnvqYwvYSqt716Vm') {
            newTier = 'business';
        }

        if (userId) {
            console.log(`✅ Payment received for user ${userId}. Updating tier to ${newTier}...`);

            // Update User Profile in Supabase
            const { error } = await supabaseAdmin
                .from('profiles')
                .update({
                    tier: newTier,
                    subscription_status: 'active',
                    subscription_id: subscriptionId,
                    updated_at: new Date().toISOString()
                })
                .eq('id', userId);

            if (error) {
                console.error('❌ Error updating profile:', error);
                return new NextResponse('Error updating profile', { status: 500 });
            }
            console.log(`🎉 User ${userId} upgraded to ${newTier} successfully!`);
        } else {
            console.error('❌ No user ID found in session metadata');
        }
    }

    return new NextResponse(null, { status: 200 });
}
