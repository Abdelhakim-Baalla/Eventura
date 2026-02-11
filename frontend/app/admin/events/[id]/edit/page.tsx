'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import dynamic from 'next/dynamic';
import api from '@/lib/api';

const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false });
import 'react-quill-new/dist/quill.snow.css';

interface Category {
    id: string;
    nom: string;
    description?: string;
}

export default function EditEventPage() {
    const { id } = useParams();
    const router = useRouter();

    const [formData, setFormData] = useState({ titre: '', description: '', dateHeureDebut: '', dateHeureFin: '', lieu: '', capaciteMax: 1, prix: 0, imageAffiche: '', categorieId: '', });
    const [isLoading, setIsLoading] = useState(false);
    const [categories, setCategories] = useState<Category[]>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        api.get('/events/categories').then(res => setCategories(res.data));
        if (id) {
            api.get(`/events/${id}`).then(res => {
                const e = res.data;
                const fmt = (d: string) => d ? new Date(d).toISOString().slice(0, 16) : '';
                setFormData({ titre: e.titre, description: e.description || '', dateHeureDebut: fmt(e.dateHeureDebut), dateHeureFin: fmt(e.dateHeureFin), lieu: e.lieu, capaciteMax: e.capaciteMax, prix: e.prix || 0, imageAffiche: e.imageAffiche || '', categorieId: e.categorie?.id || e.categorieId || '', });
            });
        }
    }, [id]);

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
            await api.put(`/events/${id}`, { ...formData, capaciteMax: Number(formData.capaciteMax), prix: Number(formData.prix), });
            router.push('/admin/events');
        } catch (err: unknown) {
            const axiosError = err as { response?: { data?: { message?: string | string[] } } };
            const message = axiosError.response?.data?.message;
            if (Array.isArray(message)) {
                setError(message.join(', '));
            } else if (typeof message === 'string') {
                setError(message);
            } else {
                setError('Erreur lors de la modification de l\'événement');
            }
        } finally { setIsLoading(false); }
    };

    return (
        <div className="space-y-16 pb-40">
            <header className="space-y-1">
                <h1 className="text-6xl font-black text-admin-text-main tracking-tighter uppercase italic">Optimisation</h1>
                <p className="text-admin-text-dim font-bold text-xs uppercase tracking-[0.3em] px-1">Révision structurelle de l&apos;unité #{id?.toString().slice(0, 8)}</p>
            </header>

            {error && (
                <div className="bg-status-error/10 border border-status-error/30 rounded-2xl p-6 text-status-error font-bold text-sm">
                    ⚠️ {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-16">
                <div className="lg:col-span-2 space-y-12">
                    <section className="bg-admin-card p-12 rounded-[4rem] border border-admin-border space-y-10 shadow-2xl">
                        <div className="space-y-4">
                            <label className="text-[10px] font-black text-admin-text-dim uppercase tracking-[0.5em] px-4 italic">Identifiant Titre</label>
                            <input
                                type="text"
                                name="titre"
                                value={formData.titre}
                                onChange={(e) => setFormData(p => ({ ...p, titre: e.target.value }))}
                                required
                                className="w-full bg-admin-inner border border-admin-border rounded-2xl py-7 px-8 text-2xl font-black text-admin-accent outline-none focus:border-admin-accent/50 transition-all shadow-inner uppercase tracking-tighter italic font-sans"
                            />
                        </div>

                        <div className="space-y-4">
                            <label className="text-[10px] font-black text-admin-text-dim uppercase tracking-[0.5em] px-4 italic">Narration Logistique</label>
                            <div className="rounded-2xl overflow-hidden border border-admin-border bg-admin-inner shadow-inner min-h-[400px]">
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

                <div className="space-y-12">
                    <section className="bg-admin-accent p-12 rounded-[4rem] text-admin-bg shadow-2xl shadow-admin-accent/30 space-y-10">
                        <h3 className="text-[10px] font-black uppercase tracking-[0.4em] opacity-60">Synchronisation</h3>
                        <div className="space-y-8">
                            <div className="space-y-3">
                                <label className="text-[9px] font-black uppercase tracking-widest opacity-40 px-2 underline decoration-2 underline-offset-4">Date de Début</label>
                                <input
                                    type="datetime-local"
                                    name="dateHeureDebut"
                                    value={formData.dateHeureDebut}
                                    onChange={(e) => setFormData(p => ({ ...p, dateHeureDebut: e.target.value }))}
                                    required
                                    className="w-full bg-admin-bg/10 border border-white/10 rounded-xl py-5 px-6 text-sm font-black outline-none font-sans"
                                />
                            </div>
                            <div className="space-y-3">
                                <label className="text-[9px] font-black uppercase tracking-widest opacity-40 px-2 underline decoration-2 underline-offset-4">Date de Fin</label>
                                <input
                                    type="datetime-local"
                                    name="dateHeureFin"
                                    value={formData.dateHeureFin}
                                    onChange={(e) => setFormData(p => ({ ...p, dateHeureFin: e.target.value }))}
                                    required
                                    className="w-full bg-admin-bg/10 border border-white/10 rounded-xl py-5 px-6 text-sm font-black outline-none font-sans"
                                />
                            </div>
                            <div className="space-y-3">
                                <label className="text-[9px] font-black uppercase tracking-widest opacity-40 px-2 underline decoration-2 underline-offset-4">Localisation</label>
                                <input
                                    type="text"
                                    name="lieu"
                                    value={formData.lieu}
                                    onChange={(e) => setFormData(p => ({ ...p, lieu: e.target.value }))}
                                    required
                                    placeholder="Lieu de l'événement"
                                    className="w-full bg-admin-bg/10 border border-white/10 rounded-xl py-5 px-6 text-sm font-black outline-none font-sans uppercase tracking-tighter placeholder:opacity-40"
                                />
                            </div>
                            <div className="space-y-3">
                                <label className="text-[9px] font-black uppercase tracking-widest opacity-40 px-2 underline decoration-2 underline-offset-4">Capacité Maximum</label>
                                <input
                                    type="number"
                                    name="capaciteMax"
                                    value={formData.capaciteMax}
                                    onChange={(e) => setFormData(p => ({ ...p, capaciteMax: Number(e.target.value) }))}
                                    min={1}
                                    required
                                    className="w-full bg-admin-bg/10 border border-white/10 rounded-xl py-5 px-6 text-sm font-black outline-none font-sans"
                                />
                            </div>
                        </div>
                    </section>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full py-10 bg-admin-text-main text-admin-bg rounded-[3rem] font-black text-xs uppercase tracking-[0.4em] hover:bg-admin-accent transition-all shadow-2xl shadow-black/50 active:scale-95 disabled:opacity-30"
                    >
                        {isLoading ? 'TRAITEMENT...' : 'SAUVEGARDER L\'UNITÉ'}
                    </button>

                    <div className="bg-admin-card p-12 rounded-[4rem] border border-admin-border space-y-10 shadow-xl">
                        <div className="space-y-4">
                            <label className="text-[9px] font-black text-admin-text-dim uppercase tracking-[0.5em] px-2 italic">Tarification Unit (€)</label>
                            <input
                                type="number"
                                name="prix"
                                value={formData.prix}
                                onChange={(e) => setFormData(p => ({ ...p, prix: Number(e.target.value) }))}
                                min={0}
                                step="0.01"
                                required
                                className="w-full bg-admin-inner border border-admin-border rounded-2xl py-6 px-8 text-5xl font-black text-admin-accent outline-none font-sans tracking-tighter"
                            />
                        </div>
                        <div className="space-y-4">
                            <label className="text-[9px] font-black text-admin-text-dim uppercase tracking-[0.5em] px-2 italic">Structure Thématique</label>
                            <select
                                name="categorieId"
                                value={formData.categorieId}
                                onChange={(e) => setFormData(p => ({ ...p, categorieId: e.target.value }))}
                                required
                                className="w-full bg-admin-inner border border-admin-border rounded-xl py-5 px-7 text-[10px] font-black text-white outline-none appearance-none cursor-pointer font-sans uppercase tracking-widest"
                            >
                                <option value="">Sélectionner</option>
                                {categories.map((cat) => (
                                    <option key={cat.id} value={cat.id} className="bg-admin-card">{cat.nom}</option>
                                ))}
                            </select>
                        </div>
                        <div className="space-y-4">
                            <label className="text-[9px] font-black text-admin-text-dim uppercase tracking-[0.5em] px-2 italic">URL Image Affiche</label>
                            <input
                                type="url"
                                name="imageAffiche"
                                value={formData.imageAffiche}
                                onChange={(e) => setFormData(p => ({ ...p, imageAffiche: e.target.value }))}
                                placeholder="https://exemple.com/image.jpg"
                                className="w-full bg-admin-inner border border-admin-border rounded-xl py-4 px-7 text-xs font-bold text-white outline-none font-sans placeholder:text-admin-text-dim/50"
                            />
                        </div>
                    </div>
                </div>
            </form>
            <style jsx global>{`
                .ql-container { border: none !important; color: var(--color-admin-text-main) !important; font-family: inherit !important; font-size: 16px !important; }
                .ql-toolbar { border: none !important; border-bottom: 1px solid var(--color-admin-border) !important; padding: 25px !important; background: var(--color-admin-card) !important; border-radius: 20px 20px 0 0 !important; }
                .ql-editor { padding: 40px !important; min-height: 400px !important; font-weight: 500 !important; line-height: 1.8 !important; }
                .ql-snow .ql-stroke { stroke: var(--color-admin-text-dim) !important; stroke-width: 2px !important; }
                .ql-snow .ql-fill { fill: var(--color-admin-text-dim) !important; }
                .ql-snow .ql-picker { color: var(--color-admin-text-dim) !important; font-weight: 700 !important; }
            `}</style>
        </div>
    );
}
