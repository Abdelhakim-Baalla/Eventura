'use client';

import { useState, useEffect, useCallback } from 'react';
import api from '@/lib/api';

const Icons = {
    Plus: () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12h14" /></svg>,
    Delete: () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2M10 11v6M14 11v6" /></svg>,
    Edit: () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" /></svg>
};

interface Category {
    id: string;
    nom: string;
    description?: string;
}

export default function AdminCategoriesPage() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [newCat, setNewCat] = useState('');
    const [editingCat, setEditingCat] = useState<Category | null>(null);

    const loadCats = useCallback(() => {
        api.get('/categories').then(res => setCategories(res.data));
    }, []);

    useEffect(() => { loadCats(); }, [loadCats]);

    const handleAdd = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editingCat) {
                await api.patch(`/categories/${editingCat.id}`, { nom: newCat });
            } else {
                await api.post('/categories', { nom: newCat });
            }
            setNewCat('');
            setEditingCat(null);
            loadCats();
        } catch { alert('Erreur'); }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Voulez-vous supprimer cette thématique ?')) return;
        try {
            await api.delete(`/categories/${id}`);
            loadCats();
        } catch { alert('Erreur lors de la suppression'); }
    };

    const startEdit = (cat: Category) => {
        setEditingCat(cat);
        setNewCat(cat.nom);
    };

    return (
        <div className="space-y-12">
            <header className="space-y-1">
                <h1 className="text-5xl font-black text-admin-text-main tracking-tighter uppercase italic">Thématiques</h1>
                <p className="text-admin-text-dim font-bold text-[10px] uppercase tracking-[0.4em] px-1 italic">Architecture Sémantique du Réseau</p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-16">
                <div className="lg:col-span-2">
                    <form onSubmit={handleAdd} className="bg-admin-card p-10 rounded-[3rem] border border-admin-border shadow-2xl space-y-8 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-admin-accent opacity-[0.03] blur-[40px] -mr-16 -mt-16"></div>

                        <div className="space-y-4">
                            <label className="text-[9px] font-black text-admin-text-dim uppercase tracking-[0.5em] px-2 italic">
                                {editingCat ? 'Mise à Jour Prototype' : 'Nouveau Prototype'}
                            </label>
                            <input
                                type="text"
                                value={newCat}
                                onChange={(e) => setNewCat(e.target.value)}
                                placeholder="Nom de la thématique..."
                                className="w-full bg-admin-inner border border-admin-border rounded-2xl py-6 px-7 text-sm font-black text-white uppercase tracking-widest outline-none focus:border-admin-accent transition-all font-sans shadow-inner placeholder:italic placeholder:opacity-20"
                            />
                        </div>
                        <div className="flex gap-4 pt-4">
                            <button className="flex-1 bg-admin-accent text-admin-bg py-5 rounded-xl font-black text-[10px] uppercase tracking-widest hover:brightness-110 flex items-center justify-center gap-3 transition-all shadow-xl shadow-admin-accent/20 active:scale-95">
                                {editingCat ? 'Sauvegarder' : <><Icons.Plus /> Ajouter</>}
                            </button>
                            {editingCat && (
                                <button type="button" onClick={() => { setEditingCat(null); setNewCat(''); }} className="px-6 bg-admin-inner border border-admin-border text-admin-text-dim rounded-xl text-[9px] font-black uppercase tracking-widest hover:text-admin-text-main transition-colors">Annuler</button>
                            )}
                        </div>
                    </form>
                </div>

                <div className="lg:col-span-3 bg-admin-card rounded-[3rem] border border-admin-border overflow-hidden shadow-2xl flex flex-col">
                    <div className="bg-admin-inner/50 px-8 py-5 border-b border-admin-border flex items-center justify-between">
                        <span className="text-[9px] font-black text-admin-text-dim uppercase tracking-[0.4em]">Structure Active</span>
                        <div className="w-2 h-2 bg-admin-accent rounded-full animate-pulse shadow-[0_0_10px_rgba(245,158,11,0.5)]"></div>
                    </div>
                    <div className="divide-y divide-admin-border/50">
                        {categories.map((c) => (
                            <div key={c.id} className="px-8 py-6 flex items-center justify-between group hover:bg-admin-inner/30 transition-all">
                                <div className="flex items-center gap-6">
                                    <div className="w-2 h-2 bg-admin-border rounded-full border border-admin-border group-hover:bg-admin-accent group-hover:border-admin-accent/50 group-hover:scale-125 transition-all"></div>
                                    <span className="text-xl font-black text-admin-text-main tracking-tighter uppercase italic group-hover:text-admin-accent transition-colors">{c.nom}</span>
                                </div>

                                <div className="flex gap-3 opacity-0 group-hover:opacity-100 transition-all">
                                    <button onClick={() => startEdit(c)} className="w-9 h-9 flex items-center justify-center bg-admin-inner border border-admin-border rounded-lg text-admin-text-dim hover:text-admin-accent hover:border-admin-accent/30 transition-all">
                                        <Icons.Edit />
                                    </button>
                                    <button onClick={() => handleDelete(c.id)} className="w-9 h-9 flex items-center justify-center bg-admin-inner border border-admin-border rounded-lg text-admin-text-dim hover:text-status-error hover:border-status-error/30 transition-all">
                                        <Icons.Delete />
                                    </button>
                                </div>
                            </div>
                        ))}
                        {categories.length === 0 && (
                            <div className="p-20 text-center italic text-[10px] uppercase font-black text-admin-text-dim opacity-30 tracking-widest">Aucune donnée détectée</div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
