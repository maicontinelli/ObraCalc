'use client';

import { useAuth } from '@/components/AuthProvider';
import { LogOut, User as UserIcon } from 'lucide-react';

export default function Header() {
    const { user, signOut } = useAuth();

    return (
        <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
            <div className="container mx-auto h-14 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-[var(--color-primary)] rounded-md flex items-center justify-center text-white font-bold">
                        OC
                    </div>
                    <span className="font-semibold text-lg text-gray-900 tracking-tight">
                        Orçamentos Civil
                    </span>
                </div>

                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                        <span className="hidden sm:inline">{user?.email}</span>
                    </div>

                    <button
                        onClick={signOut}
                        className="p-2 hover:bg-gray-100 rounded-md text-gray-500 transition-colors"
                        title="Sair"
                    >
                        <LogOut size={18} />
                    </button>
                </div>
            </div>
        </header>
    );
}
