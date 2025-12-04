'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/components/AuthProvider';

export interface UserProfile {
    id: string;
    full_name: string | null;
    email: string | null;
    phone: string | null;
    address: string | null;
    city: string | null;
    state: string | null;
    postal_code: string | null;
    plan: 'free' | 'pro' | 'premium';
    created_at: string;
    updated_at: string;
}

export function useProfile() {
    const { user } = useAuth();
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (user) {
            loadProfile();
        } else {
            setProfile(null);
            setLoading(false);
        }
    }, [user]);

    const loadProfile = async () => {
        try {
            setLoading(true);
            setError(null);

            const { data, error: fetchError } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', user?.id)
                .single();

            if (fetchError) {
                // Se o perfil não existe, criar um novo
                if (fetchError.code === 'PGRST116') {
                    await createProfile();
                } else {
                    throw fetchError;
                }
            } else {
                setProfile(data);
            }
        } catch (err: any) {
            console.error('Error loading profile:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const createProfile = async () => {
        try {
            const { data, error: insertError } = await supabase
                .from('profiles')
                .insert({
                    id: user?.id,
                    email: user?.email,
                    full_name: user?.user_metadata?.full_name || user?.user_metadata?.name || user?.email?.split('@')[0],
                    plan: 'free'
                })
                .select()
                .single();

            if (insertError) throw insertError;
            setProfile(data);
        } catch (err: any) {
            console.error('Error creating profile:', err);
            setError(err.message);
        }
    };

    const updateProfile = async (updates: Partial<UserProfile>) => {
        try {
            setError(null);

            const { data, error: updateError } = await supabase
                .from('profiles')
                .update(updates)
                .eq('id', user?.id)
                .select()
                .single();

            if (updateError) throw updateError;
            setProfile(data);
            return { success: true };
        } catch (err: any) {
            console.error('Error updating profile:', err);
            setError(err.message);
            return { success: false, error: err.message };
        }
    };

    return {
        profile,
        loading,
        error,
        updateProfile,
        refreshProfile: loadProfile
    };
}
