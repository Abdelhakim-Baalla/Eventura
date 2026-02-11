'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { authService } from '@/lib/auth';

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            await authService.login(email, password);
            const user = authService.getUser();
            if (user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN') router.push('/admin');
            else router.push('/');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Identifiants invalides');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-site-bg p-6 selection:bg-site-accent selection:text-white">
            <div className="max-w-md w-full bg-site-card p-10 md:p-12 rounded-[2.5rem] border border-site-border shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-site-accent opacity-5 blur-[40px] -mr-16 -mt-16"></div>

                <div className="text-center mb-10">
                    <div className="inline-block w-12 h-12 bg-site-accent rounded-xl flex items-center justify-center text-white font-black text-xl mb-6 shadow-lg shadow-site-accent/20">E</div>
                    <h1 className="text-3xl font-black text-white tracking-tight uppercase italic leading-none">Connexion</h1>
                    <p className="text-site-text-muted text-[10px] uppercase font-black tracking-widest mt-2 opacity-40">Accès au réseau Eventura</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-site-text-muted uppercase tracking-widest px-2 opacity-60">Email Protocol</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-site-inner border border-site-border rounded-xl py-4 px-6 text-sm font-bold text-white focus:border-site-accent transition-all outline-none shadow-inner"
                            placeholder="nom@exemple.com"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-site-text-muted uppercase tracking-widest px-2 opacity-60">Code d'accès</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-site-inner border border-site-border rounded-xl py-4 px-6 text-sm font-bold text-white focus:border-site-accent transition-all outline-none shadow-inner"
                            placeholder="••••••••"
                            required
                        />
                    </div>

                    {error && (
                        <div className="p-4 bg-status-error/10 border border-status-error/20 rounded-xl text-center">
                            <p className="text-status-error text-[10px] font-black uppercase tracking-widest leading-none">{error}</p>
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-site-accent text-white py-4 rounded-xl font-black text-xs uppercase tracking-widest hover:brightness-110 shadow-xl shadow-site-accent/20 transition-all disabled:opacity-50 mt-4 active:scale-95"
                    >
                        {loading ? 'SYNCHRONISATION...' : 'S\'IDENTIFIER'}
                    </button>
                </form>

                <div className="mt-10 pt-8 border-t border-site-border text-center">
                    <p className="text-[10px] font-black text-site-text-muted uppercase tracking-widest">
                        Nouveau sur le réseau ?{' '}
                        <Link href="/register" className="text-site-accent hover:underline decoration-2 underline-offset-4 transition-all">
                            CRÉER UN COMPTE
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
