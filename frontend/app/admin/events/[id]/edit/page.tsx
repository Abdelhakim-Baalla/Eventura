'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import dynamic from 'next/dynamic';
import api from '@/lib/api';

const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false });
import 'react-quill-new/dist/quill.snow.css';

export default function EditEventPage() {
    const { id } = useParams();
    const router = useRouter();

    const [formData, setFormData] = useState({
        titre: '',
        description: '',
        dateHeureDebut: '',
        dateHeureFin: '',
        lieu: '',
        capaciteMax: 1,
        prix: 0,
        imageAffiche: '',
        categorieId: '',
    });

    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingInitial, setIsLoadingInitial] = useState(true);
    const [error, setError] = useState('');
    const [categories, setCategories] = useState<{ id: string; nom: string }[]>([]);
    const [showPreview, setShowPreview] = useState(false);

    useEffect(() => {
        api.get('/events/categories')
            .then(res => setCategories(res.data))
            .catch(err => console.error("Erreur chargement catégories", err));
    }, []);

    useEffect(() => {
        if (!id) return;

        api.get(`/events/${id}`)
            .then(res => {
                const event = res.data;
                const formatDateForInput = (dateStr: string) => {
                    if (!dateStr) return '';
                    const date = new Date(dateStr);
                    const offset = date.getTimezoneOffset() * 60000;
                    return (new Date(date.getTime() - offset)).toISOString().slice(0, 16);
                };

                setFormData({
                    titre: event.titre,
                    description: event.description || '',
                    dateHeureDebut: formatDateForInput(event.dateHeureDebut),
                    dateHeureFin: formatDateForInput(event.dateHeureFin),
                    lieu: event.lieu,
                    capaciteMax: event.capaciteMax,
                    prix: event.prix || 0,
                    imageAffiche: event.imageAffiche || '',
                    categorieId: event.categorie?.id || event.categorieId || '',
                });
            })
            .catch(err => {
                console.error(err);
                setError("Impossible de charger l'événement");
            })
            .finally(() => setIsLoadingInitial(false));
    }, [id]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleDescriptionChange = (content: string) => {
        setFormData(prev => ({ ...prev, description: content }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const debut = new Date(formData.dateHeureDebut);
        const fin = new Date(formData.dateHeureFin);

        if (fin <= debut) {
            setError('La date de fin doit être après la date de début');
            return;
        }

        setIsLoading(true);
        setError('');

        try {
            await api.put(`/events/${id}`, {
                ...formData,
                capaciteMax: Number(formData.capaciteMax),
            });
            router.push('/admin/events');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Erreur lors de la modification');
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoadingInitial) return (
        <div className="flex justify-center items-center h-[60vh]">
            <div className="w-8 h-8 border-2 border-gray-100 border-t-black rounded-full animate-spin"></div>
        </div>
    );

    if (showPreview) {
        return (
            <div className="animate-in fade-in zoom-in-95 duration-500 max-w-4xl mx-auto">
                <header className="mb-12">
                    <h1 className="text-4xl font-black tracking-tighter mb-2">Aperçu (Modif.)</h1>
                    <p className="text-gray-400 font-medium">Vérifiez les changements avant de sauvegarder.</p>
                </header>

                <div className="bg-white rounded-[3rem] border border-[#F0F0F3] overflow-hidden shadow-2xl shadow-gray-100">
                    <div className="h-96 bg-gray-100 relative">
                        {formData.imageAffiche ? (
                            <img src={formData.imageAffiche} alt="Affiche" className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-300 font-black text-2xl uppercase italic">Image non définie</div>
                        )}
                        <div className="absolute top-8 left-8 bg-black text-white px-6 py-2 rounded-full font-black text-xs uppercase tracking-widest">
                            {categories.find(c => c.id === formData.categorieId)?.nom || 'Sans Catégorie'}
                        </div>
                    </div>
                    <div className="p-16">
                        <h2 className="text-5xl font-black text-black tracking-tighter mb-8 leading-tight">{formData.titre || 'Sans Titre'}</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-12 border-y border-gray-100 py-10 text-black">
                            <div>
                                <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest mb-2">Timing</p>
                                <p className="font-bold">Du {new Date(formData.dateHeureDebut).toLocaleString()}</p>
                                <p className="font-bold">Au {new Date(formData.dateHeureFin).toLocaleString()}</p>
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest mb-2">Infos Clés</p>
                                <p className="font-bold">📍 {formData.lieu || 'Non défini'}</p>
                                <p className="text-3xl font-black mt-2">{formData.prix}€</p>
                            </div>
                        </div>
                        <div className="prose prose-lg max-w-none text-gray-600 leading-relaxed font-medium" dangerouslySetInnerHTML={{ __html: formData.description || 'Pas de description.' }} />
                    </div>
                </div>

                <div className="flex gap-4 mt-12 mb-20">
                    <button
                        onClick={() => setShowPreview(false)}
                        className="flex-1 py-5 border border-black rounded-2xl font-black text-black hover:bg-gray-50 transition-all uppercase text-[10px] tracking-widest"
                    >
                        ← Édition
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={isLoading}
                        className="flex-1 py-5 bg-black text-white rounded-2xl font-black hover:bg-gray-800 transition-all shadow-xl shadow-gray-200 uppercase text-[10px] tracking-widest disabled:bg-gray-400"
                    >
                        {isLoading ? 'Enregistrement...' : 'Sauvegarder'}
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="animate-in fade-in slide-in-from-bottom-2 duration-500 max-w-4xl mx-auto text-black">
            <header className="mb-12">
                <h1 className="text-4xl font-black tracking-tighter mb-2">Modifier l'Événement</h1>
                <p className="text-gray-400 font-medium tracking-tight">Mise à jour de l'expérience #{id?.slice(0, 8)}</p>
            </header>

            {error && <div className="p-5 bg-red-50 text-red-500 rounded-2xl mb-8 font-bold border border-red-100">{error}</div>}

            <form onSubmit={handleSubmit} className="space-y-12 pb-20">
                <div className="bg-white p-12 rounded-[3rem] border border-[#F0F0F3] space-y-8 shadow-sm">
                    <div className="grid grid-cols-1 gap-8">
                        <div>
                            <label className="block text-[10px] font-black text-gray-300 uppercase tracking-widest mb-3 px-1">Titre</label>
                            <input
                                type="text"
                                name="titre"
                                value={formData.titre}
                                onChange={handleChange}
                                required
                                className="w-full bg-gray-50 border border-transparent rounded-[1.2rem] py-5 px-8 text-sm font-bold focus:bg-white focus:border-black transition-all"
                            />
                        </div>
                        <div>
                            <label className="block text-[10px] font-black text-gray-300 uppercase tracking-widest mb-3 px-1">Description</label>
                            <div className="rounded-[1.2rem] overflow-hidden border border-transparent focus-within:border-black transition-all">
                                <ReactQuill
                                    theme="snow"
                                    value={formData.description}
                                    onChange={handleDescriptionChange}
                                    className="bg-gray-50 h-64 h-full"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="bg-white p-10 rounded-[2.5rem] border border-[#F0F0F3] shadow-sm">
                        <h2 className="text-lg font-black italic mb-6">Dates</h2>
                        <div className="space-y-4">
                            <input
                                type="datetime-local"
                                name="dateHeureDebut"
                                value={formData.dateHeureDebut}
                                onChange={handleChange}
                                required
                                className="w-full bg-gray-50 border border-transparent rounded-xl py-4 px-6 text-sm font-bold focus:bg-white focus:border-black transition-all"
                            />
                            <input
                                type="datetime-local"
                                name="dateHeureFin"
                                value={formData.dateHeureFin}
                                onChange={handleChange}
                                required
                                className="w-full bg-gray-50 border border-transparent rounded-xl py-4 px-6 text-sm font-bold focus:bg-white focus:border-black transition-all"
                            />
                        </div>
                    </div>
                    <div className="bg-white p-10 rounded-[2.5rem] border border-[#F0F0F3] shadow-sm">
                        <h2 className="text-lg font-black italic mb-6">Finance & Stock</h2>
                        <div className="space-y-4">
                            <input
                                type="number"
                                name="prix"
                                value={formData.prix}
                                onChange={handleChange}
                                min={0}
                                step="0.01"
                                className="w-full bg-gray-50 border border-transparent rounded-xl py-4 px-6 text-sm font-bold focus:bg-white focus:border-black transition-all"
                                placeholder="Prix (€)"
                            />
                            <input
                                type="number"
                                name="capaciteMax"
                                value={formData.capaciteMax}
                                onChange={handleChange}
                                min={1}
                                className="w-full bg-gray-50 border border-transparent rounded-xl py-4 px-6 text-sm font-bold focus:bg-white focus:border-black transition-all"
                                placeholder="Capacité"
                            />
                        </div>
                    </div>
                </div>

                <div className="bg-white p-12 rounded-[3rem] border border-[#F0F0F3] space-y-8 shadow-sm">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="md:col-span-2">
                            <label className="block text-[10px] font-black text-gray-300 uppercase tracking-widest mb-3 px-1">Localisation</label>
                            <input
                                type="text"
                                name="lieu"
                                value={formData.lieu}
                                onChange={handleChange}
                                required
                                className="w-full bg-gray-50 border border-transparent rounded-[1.2rem] py-5 px-8 text-sm font-bold focus:bg-white focus:border-black transition-all"
                            />
                        </div>
                        <div>
                            <label className="block text-[10px] font-black text-gray-300 uppercase tracking-widest mb-3 px-1">Visuel (URL)</label>
                            <input
                                type="url"
                                name="imageAffiche"
                                value={formData.imageAffiche}
                                onChange={handleChange}
                                className="w-full bg-gray-50 border border-transparent rounded-[1.2rem] py-5 px-8 text-sm font-bold focus:bg-white focus:border-black transition-all"
                            />
                        </div>
                        <div>
                            <label className="block text-[10px] font-black text-gray-300 uppercase tracking-widest mb-3 px-1">Catégorie</label>
                            <select
                                name="categorieId"
                                value={formData.categorieId}
                                onChange={handleChange}
                                required
                                className="w-full bg-gray-50 border border-transparent rounded-[1.2rem] py-5 px-8 text-sm font-bold focus:bg-white focus:border-black transition-all font-bold"
                            >
                                <option value="">Choisir...</option>
                                {categories.map((cat) => (
                                    <option key={cat.id} value={cat.id}>{cat.nom}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                <div className="flex gap-4">
                    <button
                        type="button"
                        onClick={() => setShowPreview(true)}
                        className="flex-1 py-6 border border-black rounded-[1.5rem] font-black text-black hover:bg-gray-100 transition-all uppercase text-[10px] tracking-widest"
                    >
                        Prévisualiser
                    </button>
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="flex-1 py-6 bg-black text-white rounded-[1.5rem] font-black hover:bg-gray-800 transition-all shadow-xl shadow-gray-200 uppercase text-[10px] tracking-widest"
                    >
                        {isLoading ? 'Enregistrement...' : 'Sauvegarder'}
                    </button>
                </div>
            </form>
        </div>
    );
}
