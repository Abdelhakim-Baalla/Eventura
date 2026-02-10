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
                setErrors({ submit: error.message || 'Échec de l\'inscription' });
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
        <div className="min-h-screen flex items-center justify-center bg-site-bg p-6 selection:bg-site-accent selection:text-white">
            <div className="max-w-xl w-full bg-site-card p-10 md:p-12 rounded-[2.5rem] border border-site-border shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-site-accent opacity-5 blur-[40px] -mr-16 -mt-16"></div>

                <div className="text-center mb-10">
                    <div className="inline-block w-12 h-12 bg-site-accent rounded-xl flex items-center justify-center text-white font-black text-xl mb-6 shadow-lg shadow-site-accent/20">E</div>
                    <h1 className="text-3xl font-black text-white tracking-tight uppercase italic leading-none">Inscription</h1>
                    <p className="text-site-text-muted text-[10px] uppercase font-black tracking-widest mt-2 opacity-40">Rejoindre l'univers Eventura</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-site-text-muted uppercase tracking-widest px-2 opacity-60">Nom</label>
                            <input
                                type="text"
                                value={formData.nom}
                                onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                                className="w-full bg-site-inner border border-site-border rounded-xl py-4 px-6 text-sm font-bold text-white focus:border-site-accent transition-all outline-none shadow-inner"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-site-text-muted uppercase tracking-widest px-2 opacity-60">Prénom</label>
                            <input
                                type="text"
                                value={formData.prenom}
                                onChange={(e) => setFormData({ ...formData, prenom: e.target.value })}
                                className="w-full bg-site-inner border border-site-border rounded-xl py-4 px-6 text-sm font-bold text-white focus:border-site-accent transition-all outline-none shadow-inner"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-site-text-muted uppercase tracking-widest px-2 opacity-60">Identifiant Email</label>
                        <input
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className="w-full bg-site-inner border border-site-border rounded-xl py-4 px-6 text-sm font-bold text-white focus:border-site-accent transition-all outline-none shadow-inner"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-site-text-muted uppercase tracking-widest px-2 opacity-60">Code d'accès sécurisé</label>
                        <input
                            type="password"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            className="w-full bg-site-inner border border-site-border rounded-xl py-4 px-6 text-sm font-bold text-white focus:border-site-accent transition-all outline-none shadow-inner"
                            required
                        />
                    </div>

                    {errors.submit && (
                        <div className="p-4 bg-status-error/10 border border-status-error/20 rounded-xl text-center">
                            <p className="text-status-error text-[10px] font-black uppercase tracking-widest leading-none">{errors.submit}</p>
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-site-accent text-white py-4 rounded-xl font-black text-xs uppercase tracking-widest hover:brightness-110 shadow-xl shadow-site-accent/20 transition-all disabled:opacity-50 mt-4 active:scale-95"
                    >
                        {loading ? 'INITIALISATION...' : 'CRÉER LE COMPTE'}
                    </button>
                </form>

                <div className="mt-10 pt-8 border-t border-site-border text-center">
                    <p className="text-[10px] font-black text-site-text-muted uppercase tracking-widest">
                        Déjà inscrit ?{' '}
                        <Link href="/login" className="text-site-accent hover:underline decoration-2 underline-offset-4 transition-all">
                            SE CONNECTER
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
