'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import api from '@/lib/api';

const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false });
import 'react-quill-new/dist/quill.snow.css';

export default function CreateEventPage() {
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
    const [error, setError] = useState('');
    const [categories, setCategories] = useState<{ id: string; nom: string }[]>([]);
    const [showPreview, setShowPreview] = useState(false);

    const router = useRouter();

    useEffect(() => {
        api.get('/events/categories')
            .then(res => setCategories(res.data))
            .catch(err => console.error("Erreur chargement catégories", err));
    }, []);

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
            await api.post('/events', {
                ...formData,
                capaciteMax: Number(formData.capaciteMax),
            });
            router.push('/admin/events');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Erreur lors de la création');
        } finally {
            setIsLoading(false);
        }
    };

    if (showPreview) {
        return (
            <div className="animate-in fade-in zoom-in-95 duration-500 max-w-4xl mx-auto">
                <header className="mb-12 flex justify-between items-end">
                    <div>
                        <h1 className="text-4xl font-black tracking-tighter mb-2">Aperçu du Direct</h1>
                        <p className="text-gray-400 font-medium">Vérifiez le rendu avant la mise en ligne.</p>
                    </div>
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
                        <h2 className="text-5xl font-black text-black tracking-tighter mb-8 leading-tight">{formData.titre || 'Nouvel Événement'}</h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-12 border-y border-gray-100 py-10">
                            <div className="space-y-6">
                                <div>
                                    <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest mb-2">Quand</p>
                                    <p className="text-lg font-bold text-gray-700">Du {new Date(formData.dateHeureDebut).toLocaleString()}</p>
                                    <p className="text-lg font-bold text-gray-700">Au {new Date(formData.dateHeureFin).toLocaleString()}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest mb-2">Où</p>
                                    <p className="text-lg font-bold text-gray-700">{formData.lieu || 'Lieu non défini'}</p>
                                </div>
                            </div>
                            <div className="space-y-6">
                                <div>
                                    <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest mb-2">Budget</p>
                                    <p className="text-4xl font-black text-black">{formData.prix}€</p>
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest mb-2">Capacité</p>
                                    <p className="text-lg font-bold text-gray-700">{formData.capaciteMax} participants max</p>
                                </div>
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
                        ← Éditer
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={isLoading}
                        className="flex-1 py-5 bg-black text-white rounded-2xl font-black hover:bg-gray-800 transition-all shadow-xl shadow-gray-200 uppercase text-[10px] tracking-widest disabled:bg-gray-400"
                    >
                        {isLoading ? 'Création...' : 'Publier Maintenant'}
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="animate-in fade-in slide-in-from-bottom-2 duration-500 max-w-4xl mx-auto">
            <header className="mb-12">
                <h1 className="text-4xl font-black text-black tracking-tighter mb-2">Nouvel Événement</h1>
                <p className="text-gray-400 font-medium tracking-tight">Remplissez les détails pour lancer votre expérience.</p>
            </header>

            {error && <div className="p-5 bg-red-50 text-red-500 rounded-2xl mb-8 font-bold border border-red-100">{error}</div>}

            <form onSubmit={handleSubmit} className="space-y-12 pb-20">
                <div className="bg-white p-12 rounded-[3rem] border border-[#F0F0F3] space-y-8 shadow-sm">
                    <div className="grid grid-cols-1 gap-8">
                        <div>
                            <label className="block text-[10px] font-black text-gray-300 uppercase tracking-widest mb-3 px-1">Titre de l'événement</label>
                            <input
                                type="text"
                                name="titre"
                                value={formData.titre}
                                onChange={handleChange}
                                required
                                className="w-full bg-gray-50 border border-transparent rounded-[1.2rem] py-5 px-8 text-sm font-bold focus:bg-white focus:border-black transition-all placeholder:text-gray-300"
                                placeholder="Nom de l'événement"
                            />
                        </div>

                        <div>
                            <label className="block text-[10px] font-black text-gray-300 uppercase tracking-widest mb-3 px-1">Description détaillée</label>
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

                <div className="bg-white p-12 rounded-[3rem] border border-[#F0F0F3] space-y-8 shadow-sm">
                    <h2 className="text-xl font-black italic mb-4">Logistique & Temps</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                            <label className="block text-[10px] font-black text-gray-300 uppercase tracking-widest mb-3 px-1">Début</label>
                            <input
                                type="datetime-local"
                                name="dateHeureDebut"
                                value={formData.dateHeureDebut}
                                onChange={handleChange}
                                required
                                className="w-full bg-gray-50 border border-transparent rounded-[1.2rem] py-5 px-8 text-sm font-bold focus:bg-white focus:border-black transition-all"
                            />
                        </div>
                        <div>
                            <label className="block text-[10px] font-black text-gray-300 uppercase tracking-widest mb-3 px-1">Fin</label>
                            <input
                                type="datetime-local"
                                name="dateHeureFin"
                                value={formData.dateHeureFin}
                                onChange={handleChange}
                                required
                                className="w-full bg-gray-50 border border-transparent rounded-[1.2rem] py-5 px-8 text-sm font-bold focus:bg-white focus:border-black transition-all"
                            />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-[10px] font-black text-gray-300 uppercase tracking-widest mb-3 px-1">Lieu</label>
                            <input
                                type="text"
                                name="lieu"
                                value={formData.lieu}
                                onChange={handleChange}
                                required
                                className="w-full bg-gray-50 border border-transparent rounded-[1.2rem] py-5 px-8 text-sm font-bold focus:bg-white focus:border-black transition-all"
                                placeholder="Adresse, Ville, Pays"
                            />
                        </div>
                    </div>
                </div>

                <div className="bg-white p-12 rounded-[3rem] border border-[#F0F0F3] space-y-8 shadow-sm">
                    <h2 className="text-xl font-black italic mb-4">Prix & Capacité</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                            <label className="block text-[10px] font-black text-gray-300 uppercase tracking-widest mb-3 px-1">Capacité Max</label>
                            <input
                                type="number"
                                name="capaciteMax"
                                value={formData.capaciteMax}
                                onChange={handleChange}
                                min={1}
                                required
                                className="w-full bg-gray-50 border border-transparent rounded-[1.2rem] py-5 px-8 text-sm font-bold focus:bg-white focus:border-black transition-all"
                            />
                        </div>
                        <div>
                            <label className="block text-[10px] font-black text-gray-300 uppercase tracking-widest mb-3 px-1">Prix par place (€)</label>
                            <input
                                type="number"
                                name="prix"
                                value={formData.prix}
                                onChange={handleChange}
                                min={0}
                                step="0.01"
                                required
                                className="w-full bg-gray-50 border border-transparent rounded-[1.2rem] py-5 px-8 text-sm font-bold focus:bg-white focus:border-black transition-all"
                            />
                        </div>
                    </div>
                </div>

                <div className="bg-white p-12 rounded-[3rem] border border-[#F0F0F3] space-y-8 shadow-sm">
                    <h2 className="text-xl font-black italic mb-4">Média & Classement</h2>
                    <div className="grid grid-cols-1 gap-8">
                        <div>
                            <label className="block text-[10px] font-black text-gray-300 uppercase tracking-widest mb-3 px-1">Image de l'affiche (URL)</label>
                            <input
                                type="url"
                                name="imageAffiche"
                                value={formData.imageAffiche}
                                onChange={handleChange}
                                className="w-full bg-gray-50 border border-transparent rounded-[1.2rem] py-5 px-8 text-sm font-bold focus:bg-white focus:border-black transition-all"
                                placeholder="https://..."
                            />
                        </div>
                        <div>
                            <label className="block text-[10px] font-black text-gray-300 uppercase tracking-widest mb-3 px-1">Catégorie</label>
                            <select
                                name="categorieId"
                                value={formData.categorieId}
                                onChange={handleChange}
                                required
                                className="w-full bg-gray-50 border border-transparent rounded-[1.2rem] py-5 px-8 text-sm font-bold focus:bg-white focus:border-black transition-all"
                            >
                                <option value="">Choisir une thématique</option>
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
                        {isLoading ? 'Création...' : 'Créer l\'événement'}
                    </button>
                </div>
            </form>
        </div>
    );
}
