'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function RegisterPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({ email: '', nom: '', prenom: '', password: '', telephone: '', });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(false);

    const validate = () => {
        const newErrors: Record<string, string> = {};
        if (!formData.email) newErrors.email = 'Requis';
        if (!formData.nom) newErrors.nom = 'Requis';
        if (!formData.password) newErrors.password = 'Requis';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;
        setLoading(true);
        try {
            const response = await fetch('http://localhost:3000/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });
            if (!response.ok) {
                const error = await response.json();
                setErrors({ submit: error.message || 'Échec' });
                return;
            }
            router.push('/login');
        } catch (error) {
            setErrors({ submit: 'Erreur réseau' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-admin-bg p-8">
            <div className="max-w-2xl w-full bg-admin-card p-16 rounded-[4rem] border border-admin-border shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-64 h-64 bg-admin-accent opacity-[0.03] blur-[60px] -mr-32 -mt-32"></div>

                <div className="text-center mb-16">
                    <h1 className="text-6xl font-black text-admin-text-main tracking-tighter uppercase italic leading-none">Déploiement</h1>
                    <p className="text-admin-text-dim text-[10px] uppercase font-black tracking-[0.4em] mt-4 italic opacity-50">Création d'une nouvelle signature</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="grid grid-cols-2 gap-8">
                        <div className="space-y-3">
                            <label className="text-[10px] font-black text-admin-text-dim uppercase tracking-[0.4em] px-4 italic">Nom</label>
                            <input
                                type="text"
                                value={formData.nom}
                                onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                                className="w-full bg-admin-inner border border-admin-border rounded-2xl py-6 px-8 text-sm font-black text-admin-text-main focus:border-admin-accent/50 transition-all outline-none shadow-inner"
                            />
                        </div>
                        <div className="space-y-3">
                            <label className="text-[10px] font-black text-admin-text-dim uppercase tracking-[0.4em] px-4 italic">Prénom</label>
                            <input
                                type="text"
                                value={formData.prenom}
                                onChange={(e) => setFormData({ ...formData, prenom: e.target.value })}
                                className="w-full bg-admin-inner border border-admin-border rounded-2xl py-6 px-8 text-sm font-black text-admin-text-main focus:border-admin-accent/50 transition-all outline-none shadow-inner"
                            />
                        </div>
                    </div>

                    <div className="space-y-3">
                        <label className="text-[10px] font-black text-admin-text-dim uppercase tracking-[0.4em] px-4 italic">Identifiant Email</label>
                        <input
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className="w-full bg-admin-inner border border-admin-border rounded-2xl py-6 px-8 text-sm font-black text-admin-text-main focus:border-admin-accent/50 transition-all outline-none shadow-inner"
                        />
                    </div>

                    <div className="space-y-3">
                        <label className="text-[10px] font-black text-admin-text-dim uppercase tracking-[0.4em] px-4 italic">Code d'accès</label>
                        <input
                            type="password"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            className="w-full bg-admin-inner border border-admin-border rounded-2xl py-6 px-8 text-sm font-black text-admin-text-main focus:border-admin-accent/50 transition-all outline-none shadow-inner"
                        />
                    </div>

                    {errors.submit && (
                        <div className="p-5 bg-status-error/5 border border-status-error/10 rounded-2xl text-center">
                            <p className="text-status-error text-[10px] font-black uppercase tracking-widest italic">{errors.submit}</p>
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-admin-accent text-admin-bg py-6 rounded-2xl font-black text-xs uppercase tracking-[0.4em] hover:brightness-110 shadow-2xl shadow-admin-accent/20 transition-all disabled:opacity-50 mt-4 active:scale-95"
                    >
                        {loading ? 'INITIALISATION...' : 'CRÉER LE COMPTE'}
                    </button>
                </form>

                <div className="mt-16 pt-10 border-t border-admin-border text-center">
                    <p className="text-[10px] font-black text-admin-text-dim uppercase tracking-[0.3em]">
                        Déjà identifié ?{' '}
                        <Link href="/login" className="text-admin-accent hover:underline decoration-2 underline-offset-8 transition-all">
                            SE CONNECTER
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
