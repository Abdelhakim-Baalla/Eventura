'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import api from '@/lib/api';

const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false });
import 'react-quill-new/dist/quill.snow.css';

interface Category {
    id: string;
    nom: string;
    description?: string;
}

export default function CreateEventPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({ titre: '', description: '', dateHeureDebut: '', dateHeureFin: '', lieu: '', capaciteMax: 1, prix: 0, imageAffiche: '', categorieId: '', });
    const [isLoading, setIsLoading] = useState(false);
    const [categories, setCategories] = useState<Category[]>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => { api.get('/events/categories').then(res => setCategories(res.data)); }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        setError(null); // Effacer l'erreur quand l'utilisateur modifie le formulaire
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        // Validation côté client : vérifier que la date de fin est après la date de début
        const dateDebut = new Date(formData.dateHeureDebut);
        const dateFin = new Date(formData.dateHeureFin);

        if (dateFin <= dateDebut) {
            setError('La date de fin doit être après la date de début');
            return;
        }

        if (!formData.categorieId) {
            setError('Veuillez sélectionner une catégorie');
            return;
        }

        setIsLoading(true);
        try {
            await api.post('/events', { ...formData, capaciteMax: Number(formData.capaciteMax), prix: Number(formData.prix), });
            router.push('/admin/events');
        } catch (err: unknown) {
            const axiosError = err as { response?: { data?: { message?: string | string[] } } };
            const message = axiosError.response?.data?.message;
            if (Array.isArray(message)) {
                setError(message.join(', '));
            } else if (typeof message === 'string') {
                setError(message);
            } else {
                setError('Erreur lors de la création de l\'événement');
            }
        } finally { setIsLoading(false); }
    };

    return (
        <div className="space-y-12 pb-40">
            <header className="space-y-1">
                <h1 className="text-5xl font-black text-admin-text-main tracking-tighter uppercase italic">Création</h1>
                <p className="text-admin-text-dim font-bold text-[10px] uppercase tracking-[0.4em] px-1">Injection d&apos;une nouvelle unité analytique</p>
            </header>

            {error && (
                <div className="bg-red-500/10 border-2 border-red-500/50 rounded-2xl p-6 flex items-center gap-4">
                    <div className="w-10 h-10 bg-red-500/20 rounded-full flex items-center justify-center shrink-0">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/>
                        </svg>
                    </div>
                    <div>
                        <p className="text-red-400 font-black text-sm uppercase tracking-wider">Erreur</p>
                        <p className="text-red-300 font-medium text-sm mt-1">{error}</p>
                    </div>
                </div>
            )}

            <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                <div className="lg:col-span-2 space-y-10">
                    <section className="bg-admin-card p-10 rounded-[3rem] border border-admin-border space-y-8 shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-admin-accent opacity-[0.02] blur-[40px] -mr-16 -mt-16"></div>

                        <div className="space-y-3">
                            <label className="text-[9px] font-black text-admin-text-dim uppercase tracking-[0.4em] px-4 italic">Identifiant Titre</label>
                            <input
                                type="text"
                                name="titre"
                                value={formData.titre}
                                onChange={handleChange}
                                required
                                placeholder="Entrer le titre de l'événement..."
                                className="w-full bg-admin-inner border border-admin-border rounded-xl py-6 px-8 text-xl font-black text-white outline-none focus:border-admin-accent transition-all shadow-inner uppercase tracking-tighter italic font-sans"
                            />
                        </div>

                        <div className="space-y-3">
                            <label className="text-[9px] font-black text-admin-text-dim uppercase tracking-[0.4em] px-4 italic">Narration Logistique (Description)</label>
                            <div className="rounded-xl overflow-hidden border border-admin-border bg-admin-inner shadow-inner min-h-[400px]">
                                <ReactQuill
                                    theme="snow"
                                    value={formData.description}
                                    onChange={(v) => setFormData(p => ({ ...p, description: v }))}
                                    className="bg-transparent"
                                />
                            </div>
                        </div>
                    </section>
                </div>

                <div className="space-y-10">
                    <section className="bg-admin-accent p-10 rounded-[3rem] text-admin-bg shadow-2xl shadow-admin-accent/20 space-y-8">
                        <h3 className="text-[9px] font-black uppercase tracking-[0.3em] opacity-60">Paramètres de Protocol</h3>
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[8px] font-black uppercase tracking-widest opacity-40 px-2 underline decoration-2 underline-offset-4">Date de Début</label>
                                <input
                                    type="datetime-local"
                                    name="dateHeureDebut"
                                    value={formData.dateHeureDebut}
                                    onChange={handleChange}
                                    required
                                    className="w-full bg-admin-bg/10 border border-white/10 rounded-xl py-4 px-5 text-sm font-black outline-none font-sans text-admin-bg"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[8px] font-black uppercase tracking-widest opacity-40 px-2 underline decoration-2 underline-offset-4">Date de Fin</label>
                                <input
                                    type="datetime-local"
                                    name="dateHeureFin"
                                    value={formData.dateHeureFin}
                                    onChange={handleChange}
                                    required
                                    className="w-full bg-admin-bg/10 border border-white/10 rounded-xl py-4 px-5 text-sm font-black outline-none font-sans text-admin-bg"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[8px] font-black uppercase tracking-widest opacity-40 px-2 underline decoration-2 underline-offset-4">Localisation Unit</label>
                                <input
                                    type="text"
                                    name="lieu"
                                    value={formData.lieu}
                                    onChange={handleChange}
                                    required
                                    placeholder="Lieu de l'événement"
                                    className="w-full bg-admin-bg/10 border border-white/10 rounded-xl py-4 px-5 text-sm font-black outline-none font-sans uppercase tracking-tighter text-admin-bg placeholder:text-admin-bg/40"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[8px] font-black uppercase tracking-widest opacity-40 px-2 underline decoration-2 underline-offset-4">Capacité Maximum</label>
                                <input
                                    type="number"
                                    name="capaciteMax"
                                    value={formData.capaciteMax}
                                    onChange={handleChange}
                                    min={1}
                                    required
                                    className="w-full bg-admin-bg/10 border border-white/10 rounded-xl py-4 px-5 text-sm font-black outline-none font-sans text-admin-bg"
                                />
                            </div>
                        </div>
                    </section>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full py-8 bg-white text-admin-bg rounded-[2rem] font-black text-[11px] uppercase tracking-[0.3em] hover:bg-admin-accent hover:text-admin-bg transition-all shadow-2xl active:scale-95 disabled:opacity-30"
                    >
                        {isLoading ? 'TRAITEMENT...' : 'VALIDER L\'UNITÉ'}
                    </button>

                    <div className="bg-admin-card p-10 rounded-[3rem] border border-admin-border space-y-8 shadow-xl">
                        <div className="space-y-3">
                            <label className="text-[8px] font-black text-admin-text-dim uppercase tracking-[0.4em] px-2 italic">Tarification Accès (€)</label>
                            <input
                                type="number"
                                name="prix"
                                value={formData.prix}
                                onChange={handleChange}
                                min={0}
                                step="0.01"
                                required
                                className="w-full bg-admin-inner border border-admin-border rounded-xl py-5 px-7 text-4xl font-black text-admin-accent outline-none font-sans tracking-tighter"
                            />
                        </div>
                        <div className="space-y-3">
                            <label className="text-[8px] font-black text-admin-text-dim uppercase tracking-[0.4em] px-2 italic">Structure Thématique</label>
                            <select
                                name="categorieId"
                                value={formData.categorieId}
                                onChange={handleChange}
                                required
                                className="w-full bg-admin-inner border border-admin-border rounded-xl py-5 px-7 text-[10px] font-black text-white outline-none appearance-none cursor-pointer font-sans uppercase tracking-widest"
                            >
                                <option value="">Sélectionner</option>
                                {categories.map((cat) => (
                                    <option key={cat.id} value={cat.id} className="bg-admin-card">{cat.nom}</option>
                                ))}
                            </select>
                        </div>
                        <div className="space-y-3">
                            <label className="text-[8px] font-black text-admin-text-dim uppercase tracking-[0.4em] px-2 italic">URL Image Affiche</label>
                            <input
                                type="url"
                                name="imageAffiche"
                                value={formData.imageAffiche}
                                onChange={handleChange}
                                placeholder="https://exemple.com/image.jpg"
                                className="w-full bg-admin-inner border border-admin-border rounded-xl py-4 px-7 text-xs font-bold text-white outline-none font-sans placeholder:text-admin-text-dim/50"
                            />
                        </div>
                    </div>
                </div>
            </form>
            <style jsx global>{`
                .ql-container { border: none !important; color: white !important; font-family: inherit !important; font-size: 15px !important; }
                .ql-toolbar { border: none !important; border-bottom: 1px solid var(--color-admin-border) !important; padding: 20px !important; background: var(--color-admin-card) !important; border-radius: 12px 12px 0 0 !important; }
                .ql-editor { padding: 30px !important; min-height: 400px !important; font-weight: 400 !important; line-height: 1.6 !important; }
                .ql-snow .ql-stroke { stroke: var(--color-admin-text-dim) !important; stroke-width: 2px !important; }
                .ql-snow .ql-fill { fill: var(--color-admin-text-dim) !important; }
                .ql-snow .ql-picker { color: var(--color-admin-text-dim) !important; font-weight: 700 !important; }
                .ql-editor.ql-blank::before { color: rgba(255,255,255,0.2) !important; font-style: italic !important; }
            `}</style>
        </div>
    );
}
