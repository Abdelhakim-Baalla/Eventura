'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';

interface Category {
    id: string;
    nom: string;
}

export default function CategoriesPage() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [newCat, setNewCat] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        loadCats();
    }, []);

    const loadCats = () => {
        api.get('/categories')
            .then(res => setCategories(res.data))
            .catch(err => console.error(err));
    };

    const handleAdd = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newCat.trim()) return;

        try {
            await api.post('/categories', { nom: newCat });
            setNewCat('');
            loadCats();
        } catch (err) {
            setError('Erreur lors de l\'ajout');
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Êtes-vous sûr de vouloir supprimer cette catégorie ?')) return;
        try {
            await api.delete(`/categories/${id}`);
            loadCats();
        } catch (err) {
            alert('Erreur lors de la suppression');
        }
    };

    return (
        <div className="p-8 max-w-2xl">
            <h1 className="text-2xl font-bold mb-6">Gestion des Catégories</h1>

            {error && <div className="text-red-600 mb-4">{error}</div>}

            <form onSubmit={handleAdd} className="flex gap-4 mb-8">
                <input
                    type="text"
                    value={newCat}
                    onChange={(e) => setNewCat(e.target.value)}
                    placeholder="Nom de la nouvelle catégorie"
                    className="flex-1 border p-2 rounded"
                    required
                />
                <button
                    type="submit"
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                    Ajouter
                </button>
            </form>

            <div className="bg-white rounded shadow text-black">
                {categories.length === 0 ? (
                    <div className="p-4 text-gray-500">Aucune catégorie. Ajoutez-en une !</div>
                ) : (
                    <ul className="divide-y">
                        {categories.map((cat) => (
                            <li key={cat.id} className="flex justify-between items-center p-4 hover:bg-gray-50">
                                <span className="font-medium">{cat.nom}</span>
                                <button
                                    onClick={() => handleDelete(cat.id)}
                                    className="text-red-500 hover:text-red-700"
                                >
                                    Supprimer
                                </button>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}
