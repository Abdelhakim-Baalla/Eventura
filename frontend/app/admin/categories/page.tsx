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
        if (!confirm('Voulez-vous supprimer cette catégorie ?')) return;
        try {
            await api.delete(`/categories/${id}`);
            loadCats();
        } catch (err) {
            alert('Erreur lors de la suppression');
        }
    };

    return (
        <div className="animate-in fade-in slide-in-from-bottom-2 duration-500 max-w-3xl">
            <header className="mb-12">
                <h1 className="text-4xl font-black text-black tracking-tighter mb-2">Catégories</h1>
                <p className="text-gray-400 font-medium tracking-tight">Organisez vos événements par thématiques.</p>
            </header>

            {error && <div className="p-4 bg-red-50 text-red-500 rounded-2xl mb-6 font-bold text-sm border border-red-100">{error}</div>}

            <form onSubmit={handleAdd} className="flex gap-4 mb-12">
                <div className="flex-1 relative group">
                    <input
                        type="text"
                        value={newCat}
                        onChange={(e) => setNewCat(e.target.value)}
                        placeholder="Ex: Musique, Sport, Technologie..."
                        className="w-full bg-white border border-[#F0F0F3] rounded-2xl py-4 px-6 text-sm font-bold focus:outline-none focus:border-black transition-all placeholder:text-gray-300"
                        required
                    />
                </div>
                <button
                    type="submit"
                    className="bg-black text-white px-8 py-4 rounded-2xl font-black hover:bg-gray-800 transition-all shadow-xl shadow-gray-200 uppercase text-[10px] tracking-widest"
                >
                    Ajouter
                </button>
            </form>

            <div className="bg-white rounded-[2.5rem] border border-[#F0F0F3] shadow-sm overflow-hidden">
                <div className="px-10 py-6 border-b border-[#F0F0F3] bg-gray-50/50">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Liste des catégories</p>
                </div>
                {categories.length === 0 ? (
                    <div className="p-16 text-center">
                        <p className="text-gray-300 font-black italic">Aucune catégorie disponible.</p>
                    </div>
                ) : (
                    <ul className="divide-y divide-[#F0F0F3]">
                        {categories.map((cat) => (
                            <li key={cat.id} className="flex justify-between items-center px-10 py-6 hover:bg-[#FBFBFE] transition-colors group">
                                <span className="font-black text-gray-800 tracking-tight">{cat.nom}</span>
                                <button
                                    onClick={() => handleDelete(cat.id)}
                                    className="w-10 h-10 flex items-center justify-center rounded-xl bg-gray-50 text-gray-300 hover:bg-red-50 hover:text-red-500 transition-all font-bold"
                                    title="Supprimer"
                                >
                                    ✕
                                </button>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}
