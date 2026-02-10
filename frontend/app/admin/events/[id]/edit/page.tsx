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
        imageAffiche: '',
        categorieId: '',
    });

    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingInitial, setIsLoadingInitial] = useState(true);
    const [error, setError] = useState('');
    const [categories, setCategories] = useState<{ id: string; nom: string }[]>([]);
    const [showPreview, setShowPreview] = useState(false);

    // Charger les catégories
    useEffect(() => {
        api.get('/events/categories')
            .then(res => setCategories(res.data))
            .catch(err => console.error("Erreur chargement catégories", err));
    }, []);

    // Charger l'événement à modifier
    useEffect(() => {
        if (!id) return;

        api.get(`/events/${id}`)
            .then(res => {
                const event = res.data;
                // Formater les dates pour l'input datetime-local (YYYY-MM-DDTHH:mm)
                const formatDateForInput = (dateStr: string) => {
                    if (!dateStr) return '';
                    // Ajustement fuseau horaire local simple
                    const date = new Date(dateStr);
                    const offset = date.getTimezoneOffset() * 60000;
                    const localISOTime = (new Date(date.getTime() - offset)).toISOString().slice(0, 16);
                    return localISOTime;
                };

                setFormData({
                    titre: event.titre,
                    description: event.description || '',
                    dateHeureDebut: formatDateForInput(event.dateHeureDebut),
                    dateHeureFin: formatDateForInput(event.dateHeureFin),
                    lieu: event.lieu,
                    capaciteMax: event.capaciteMax,
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
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
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
            // PUT pour mettre à jour
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

    const formatDate = (dateStr: string) => {
        if (!dateStr) return '—';
        return new Date(dateStr).toLocaleString('fr-FR');
    };

    if (isLoadingInitial) return <div className="p-8">Chargement de l'événement...</div>;

    if (showPreview) {
        return (
            <div className="p-8 max-w-2xl mx-auto">
                <h1 className="text-2xl font-bold mb-6">Preview de l'événement (Modification)</h1>

                <div className="border rounded p-6 space-y-4 bg-white shadow">
                    <h2 className="text-xl font-bold">{formData.titre || 'Sans titre'}</h2>

                    <div
                        className="text-gray-700"
                        dangerouslySetInnerHTML={{ __html: formData.description || '<em>Pas de description</em>' }}
                    />

                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                            <span className="font-medium">Début : </span>
                            {formatDate(formData.dateHeureDebut)}
                        </div>
                        <div>
                            <span className="font-medium">Fin : </span>
                            {formatDate(formData.dateHeureFin)}
                        </div>
                        <div>
                            <span className="font-medium">Lieu : </span>
                            {formData.lieu || '—'}
                        </div>
                        <div>
                            <span className="font-medium">Catégorie : </span>
                            {categories.find(c => c.id === formData.categorieId)?.nom || '—'}
                        </div>
                        <div>
                            <span className="font-medium">Capacité : </span>
                            {formData.capaciteMax} personnes
                        </div>
                    </div>

                    {formData.imageAffiche && (
                        <img
                            src={formData.imageAffiche}
                            alt="Affiche"
                            className="w-full max-h-64 object-cover rounded"
                        />
                    )}
                </div>

                <div className="flex gap-4 mt-6">
                    <button
                        onClick={() => setShowPreview(false)}
                        className="flex-1 border border-blue-600 text-blue-600 py-2 rounded hover:bg-blue-50"
                    >
                        ← Retour au formulaire
                    </button>
                    <button
                        onClick={handleSubmit as any}
                        disabled={isLoading}
                        className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:bg-gray-400"
                    >
                        {isLoading ? 'Enregistrement...' : 'Enregistrer les modifications'}
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="p-8 max-w-2xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">Modifier l'événement</h1>
            {error && (
                <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block font-medium mb-1">Titre *</label>
                    <input
                        type="text"
                        name="titre"
                        value={formData.titre}
                        onChange={handleChange}
                        required
                        maxLength={200}
                        className="w-full border rounded p-2"
                        placeholder="Nom de l'événement"
                    />
                </div>

                <div>
                    <label className="block font-medium mb-1">Description</label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        className="w-full border rounded p-2 h-32"
                        placeholder="Description détaillée de l'événement..."
                    />
                </div>

                <div>
                    <label className="block font-medium mb-1">Date et heure de début *</label>
                    <input
                        type="datetime-local"
                        name="dateHeureDebut"
                        value={formData.dateHeureDebut}
                        onChange={handleChange}
                        required
                        className="w-full border rounded p-2"
                    />
                </div>

                <div>
                    <label className="block font-medium mb-1">Date et heure de fin *</label>
                    <input
                        type="datetime-local"
                        name="dateHeureFin"
                        value={formData.dateHeureFin}
                        onChange={handleChange}
                        required
                        min={formData.dateHeureDebut}
                        className="w-full border rounded p-2"
                    />
                </div>

                <div>
                    <label className="block font-medium mb-1">Lieu *</label>
                    <input
                        type="text"
                        name="lieu"
                        value={formData.lieu}
                        onChange={handleChange}
                        required
                        className="w-full border rounded p-2"
                        placeholder="Adresse ou lieu"
                    />
                </div>

                <div>
                    <label className="block font-medium mb-1">Capacité max *</label>
                    <input
                        type="number"
                        name="capaciteMax"
                        value={formData.capaciteMax}
                        onChange={handleChange}
                        required
                        min={1}
                        className="w-full border rounded p-2"
                    />
                </div>

                <div>
                    <label className="block font-medium mb-1">URL de l'image</label>
                    <input
                        type="url"
                        name="imageAffiche"
                        value={formData.imageAffiche}
                        onChange={handleChange}
                        className="w-full border rounded p-2"
                        placeholder="https://example.com/image.jpg"
                    />
                </div>

                <div>
                    <label className="block font-medium mb-1">Catégorie *</label>
                    <select
                        name="categorieId"
                        value={formData.categorieId}
                        onChange={handleChange}
                        required
                        className="w-full border rounded p-2"
                    >
                        <option value="">Sélectionner une catégorie</option>
                        {categories.map((cat) => (
                            <option key={cat.id} value={cat.id}>
                                {cat.nom}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="flex gap-4">
                    <button
                        type="button"
                        onClick={() => setShowPreview(true)}
                        className="flex-1 border border-blue-600 text-blue-600 py-2 rounded hover:bg-blue-50"
                    >
                        Preview
                    </button>
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:bg-gray-400"
                    >
                        {isLoading ? 'Enregistrement...' : 'Enregistrer les modifications'}
                    </button>
                </div>
            </form>
        </div>
    );
}
