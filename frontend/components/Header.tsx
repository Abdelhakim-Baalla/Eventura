'use client';

import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';

export default function Header() {
    const { user, isAuthenticated, logout } = useAuth();

    const isAdmin = user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN';

    return (
        <header className="bg-white shadow">
            <div className="container mx-auto px-4 py-4 flex justify-between">
                <Link href="/" className="text-xl font-bold">Eventura</Link>

                <nav className="flex gap-4">
                    {isAuthenticated ? (
                        <>
                            <Link href="/events">Événements</Link>
                            {isAdmin && <Link href="/admin">Admin</Link>}
                            <button onClick={logout} className="text-red-600">
                                Déconnexion
                            </button>
                        </>
                    ) : (
                        <>
                            <Link href="/login">Connexion</Link>
                            <Link href="/register">Inscription</Link>
                        </>
                    )}
                </nav>
            </div>
        </header>
    );
}
