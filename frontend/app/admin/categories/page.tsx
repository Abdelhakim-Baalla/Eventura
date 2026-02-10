'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';

const Icons = {
    Plus: () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12h14" /></svg>,
    Delete: () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2M10 11v6M14 11v6" /></svg>,
    Edit: () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" /></svg>
};

export default function AdminCategoriesPage() {
    const [categories, setCategories] = useState<any[]>([]);
    const [newCat, setNewCat] = useState('');
    const [editingCat, setEditingCat] = useState<any>(null);

    useEffect(() => { loadCats(); }, []);
    const loadCats = () => api.get('/categories').then(res => setCategories(res.data));

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
        } catch (err) { alert('Erreur'); }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Voulez-vous supprimer cette thématique ?')) return;
        try {
            await api.delete(`/categories/${id}`);
            loadCats();
        } catch (err) { alert('Erreur lors de la suppression'); }
    };

    const startEdit = (cat: any) => {
        setEditingCat(cat);
        setNewCat(cat.nom);
    };

    return (
        <div className="space-y-16">
            <header className="space-y-1">
                <h1 className="text-6xl font-black text-admin-text-main tracking-tighter uppercase italic">Thématiques</h1>
                <p className="text-admin-text-dim font-bold text-xs uppercase tracking-[0.3em] px-1">Structure Sémantique du Réseau</p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-16">
                <div className="lg:col-span-2">
                    <form onSubmit={handleAdd} className="bg-admin-card p-12 rounded-[3rem] border border-admin-border shadow-2xl space-y-10 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-admin-accent opacity-[0.03] blur-[40px] -mr-16 -mt-16"></div>

                        <div className="space-y-4">
                            <label className="text-[10px] font-black text-admin-text-dim uppercase tracking-[0.5em] px-2 italic">
                                {editingCat ? 'Mise à Jour Prototype' : 'Nouveau Prototype'}
                            </label>
                            <input
                                type="text"
                                value={newCat}
                                onChange={(e) => setNewCat(e.target.value)}
                                placeholder="Injection Label..."
                                className="w-full bg-admin-inner border border-admin-border rounded-2xl py-7 px-8 text-sm font-black text-admin-accent uppercase tracking-widest outline-none focus:border-admin-accent/50 transition-all font-sans shadow-inner placeholder:opacity-20"
                            />
                        </div>
                        <div className="flex gap-4">
                            <button className="flex-1 bg-admin-accent text-admin-bg py-6 rounded-2xl font-black text-xs uppercase tracking-widest hover:brightness-110 flex items-center justify-center gap-4 transition-all shadow-xl shadow-admin-accent/20 active:scale-95">
                                {editingCat ? 'Sauvegarder' : <><Icons.Plus /> Enregistrer</>}
                            </button>
                            {editingCat && (
                                <button type="button" onClick={() => { setEditingCat(null); setNewCat(''); }} className="px-8 bg-admin-inner border border-admin-border text-admin-text-dim rounded-2xl text-[10px] font-black uppercase tracking-widest hover:text-admin-text-main">Annuler</button>
                            )}
                        </div>
                    </form>
                </div>

                <div className="lg:col-span-3 bg-admin-card rounded-[3.5rem] border border-admin-border overflow-hidden shadow-2xl">
                    <div className="bg-admin-inner/50 px-10 py-6 border-b border-admin-border flex items-center justify-between">
                        <span className="text-[10px] font-black text-admin-text-dim uppercase tracking-[0.4em]">Architecture Active</span>
                        <div className="w-2 h-2 bg-admin-accent rounded-full animate-pulse shadow-[0_0_10px_rgba(245,158,11,0.5)]"></div>
                    </div>
                    <div className="divide-y divide-admin-border/50">
                        {categories.map((c) => (
                            <div key={c.id} className="px-10 py-8 flex items-center justify-between group hover:bg-admin-inner/30 transition-all">
                                <div className="flex items-center gap-6">
                                    <div className="w-3 h-3 bg-admin-border rounded-full border border-admin-border group-hover:bg-admin-accent group-hover:border-admin-accent/50 group-hover:scale-125 transition-all shadow-[0_0_15px_rgba(245,158,11,0)] group-hover:shadow-[0_0_15px_rgba(245,158,11,0.3)]"></div>
                                    <span className="text-2xl font-black text-admin-text-main tracking-tighter uppercase italic group-hover:text-admin-accent transition-colors">{c.nom}</span>
                                </div>

                                <div className="flex gap-4 opacity-0 group-hover:opacity-100 transition-all">
                                    <button onClick={() => startEdit(c)} className="w-10 h-10 flex items-center justify-center bg-admin-inner border border-admin-border rounded-xl text-admin-text-dim hover:text-admin-accent hover:border-admin-accent/30 transition-all">
                                        <Icons.Edit />
                                    </button>
                                    <button onClick={() => handleDelete(c.id)} className="w-10 h-10 flex items-center justify-center bg-admin-inner border border-admin-border rounded-xl text-admin-text-dim hover:text-status-error hover:border-status-error/30 transition-all">
                                        <Icons.Delete />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
