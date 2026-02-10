'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { authService } from '@/lib/auth';
import api from '@/lib/api';

export default function LoginPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(false);

    const validate = () => {
        const newErrors: Record<string, string> = {};
        if (!formData.email) newErrors.email = 'Requis';
        if (!formData.password) newErrors.password = 'Requis';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;
        setLoading(true);
        try {
            const response = await api.post('/auth/login', formData);
            const { access_token, user } = response.data;
            authService.setToken(access_token);
            authService.setUser(user);
            if (user.role === 'ADMIN' || user.role === 'SUPER_ADMIN') router.push('/admin');
            else router.push('/');
        } catch (error: any) {
            setErrors({ submit: error.response?.data?.message || 'Identifiants invalides' });
        } finally { setLoading(false); }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-admin-bg p-8">
            <div className="max-w-md w-full bg-admin-card p-16 rounded-[4rem] border border-admin-border shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-64 h-64 bg-admin-accent opacity-[0.03] blur-[60px] -mr-32 -mt-32"></div>

                <div className="text-center mb-16">
                    <div className="w-20 h-20 bg-admin-accent rounded-[2rem] flex items-center justify-center text-admin-bg font-black text-3xl mx-auto mb-8 shadow-2xl shadow-admin-accent/30 rotate-3 group-hover:rotate-0 transition-transform duration-500">E</div>
                    <h1 className="text-5xl font-black text-admin-text-main tracking-tighter uppercase italic leading-none">Connexion</h1>
                    <p className="text-admin-text-dim text-[10px] uppercase font-black tracking-[0.4em] mt-4 italic opacity-50">Protocole Console Authentification</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="space-y-3">
                        <label className="text-[10px] font-black text-admin-text-dim uppercase tracking-[0.4em] px-4 italic">Identifiant Email</label>
                        <input
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className="w-full bg-admin-inner border border-admin-border rounded-2xl py-6 px-8 text-sm font-black text-admin-text-main focus:border-admin-accent/50 transition-all outline-none shadow-inner placeholder:opacity-10"
                            placeholder="admin@eventura.net"
                        />
                        {errors.email && <p className="text-status-error text-[10px] font-black uppercase mt-3 px-4 tracking-widest italic">{errors.email}</p>}
                    </div>

                    <div className="space-y-3">
                        <label className="text-[10px] font-black text-admin-text-dim uppercase tracking-[0.4em] px-4 italic">Code d'accès</label>
                        <input
                            type="password"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            className="w-full bg-admin-inner border border-admin-border rounded-2xl py-6 px-8 text-sm font-black text-admin-text-main focus:border-admin-accent/50 transition-all outline-none shadow-inner placeholder:opacity-10"
                            placeholder="••••••••"
                        />
                        {errors.password && <p className="text-status-error text-[10px] font-black uppercase mt-3 px-4 tracking-widest italic">{errors.password}</p>}
                    </div>

                    {errors.submit && (
                        <div className="p-5 bg-status-error/5 border border-status-error/10 rounded-2xl">
                            <p className="text-status-error text-[10px] font-black uppercase text-center tracking-widest italic">{errors.submit}</p>
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-admin-accent text-admin-bg py-6 rounded-2xl font-black text-xs uppercase tracking-[0.4em] hover:brightness-110 shadow-2xl shadow-admin-accent/20 transition-all disabled:opacity-50 mt-4 active:scale-95"
                    >
                        {loading ? 'AUTHENTIFICATION...' : 'S\'IDENTIFIER'}
                    </button>
                </form>

                <div className="mt-16 pt-10 border-t border-admin-border text-center">
                    <p className="text-[10px] font-black text-admin-text-dim uppercase tracking-[0.3em]">
                        Nouveau prototype ?{' '}
                        <Link href="/register" className="text-admin-accent hover:underline decoration-2 underline-offset-8 transition-all">
                            S'INSCRIRE
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
