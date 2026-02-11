'use client';

import { useState, useEffect, useCallback } from 'react';
import api from '@/lib/api';
import Link from 'next/link';
import Image from 'next/image';

const Icons = {
    Plus: () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12h14" /></svg>,
    Edit: () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" /></svg>,
    Delete: () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2M10 11v6M14 11v6" /></svg>,
};

interface Event { id: string; titre: string; dateHeureDebut: string; lieu: string; statut: string; categorie: { nom: string }; imageAffiche?: string; }

export default function AdminEventsPage() {
    const [events, setEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(true);

    const loadEvents = useCallback(() => {
        api.get('/events/admin').then(res => { setEvents(res.data); setLoading(false); }).catch(() => setLoading(false));
    }, []);

    useEffect(() => {
        loadEvents();
    }, [loadEvents]);

    const handlePublish = async (id: string) => {
        try { await api.patch(`/events/${id}/publish`); loadEvents(); } catch { alert('Erreur'); }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Voulez-vous définitivement supprimer cet événement ?')) return;
        try {
            await api.delete(`/events/${id}`);
            loadEvents();
        } catch { alert('Erreur lors de la suppression'); }
    };

    if (loading) return (
        <div className="flex h-[40vh] items-center justify-center">
            <div className="w-10 h-10 border-2 border-admin-border border-t-admin-accent rounded-full animate-spin"></div>
        </div>
    );

    return (
        <div className="space-y-12">
            <div className="flex justify-between items-end">
                <div className="space-y-1">
                    <h1 className="text-6xl font-black text-admin-text-main tracking-tighter uppercase italic">Catalogue</h1>
                    <p className="text-admin-text-dim font-bold text-xs uppercase tracking-[0.3em] px-1">Gestion des Inventaires événementiels</p>
                </div>
                <Link
                    href="/admin/events/create"
                    className="flex items-center gap-4 bg-admin-accent text-admin-bg px-10 py-5 rounded-2xl font-black text-xs uppercase tracking-widest hover:brightness-110 shadow-2xl transition-all active:scale-95"
                >
                    <Icons.Plus /> Nouveau Slot
                </Link>
            </div>

            <div className="bg-admin-card rounded-[3.5rem] border border-admin-border overflow-hidden shadow-2xl">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-admin-inner/50 border-b border-admin-border text-admin-text-dim text-[10px] uppercase font-black tracking-[0.4em]">
                                <th className="px-12 py-8">Référence Unit</th>
                                <th className="px-12 py-8">Logistique</th>
                                <th className="px-12 py-8">Statut Flux</th>
                                <th className="px-12 py-8 text-right">Contrôle</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-admin-border/50">
                            {events.map((e) => (
                                <tr key={e.id} className="hover:bg-admin-inner/30 transition-all group">
                                    <td className="px-12 py-10">
                                        <div className="flex items-center gap-8">
                                            <div className="w-16 h-16 bg-admin-inner rounded-2xl border border-admin-border overflow-hidden shrink-0 shadow-inner group-hover:border-admin-accent/50 transition-all relative">
                                                {e.imageAffiche && <Image src={e.imageAffiche} alt="" fill className="object-cover grayscale group-hover:grayscale-0 transition-all duration-700" unoptimized />}
                                            </div>
                                            <div>
                                                <div className="text-xl font-black tracking-tighter text-admin-text-main uppercase italic group-hover:text-admin-accent transition-colors">{e.titre}</div>
                                                <div className="text-[10px] font-black text-admin-text-dim uppercase tracking-[0.2em] mt-1">{e.categorie?.nom}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-12 py-10">
                                        <div className="text-sm font-black text-admin-text-muted italic">{new Date(e.dateHeureDebut).toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' })}</div>
                                        <div className="text-[10px] font-bold text-admin-text-dim uppercase tracking-widest mt-1">{e.lieu}</div>
                                    </td>
                                    <td className="px-12 py-10">
                                        <span className={`px-5 py-2 rounded-xl text-[9px] font-black uppercase tracking-[0.2em] border ${e.statut === 'PUBLIE'
                                            ? 'bg-status-success/5 text-status-success border-status-success/20 shadow-[0_0_15px_rgba(16,185,129,0.1)]'
                                            : 'bg-admin-inner text-admin-text-dim border-admin-border'
                                            }`}>
                                            {e.statut}
                                        </span>
                                    </td>
                                    <td className="px-12 py-10 text-right">
                                        <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0">
                                            {e.statut === 'BROUILLON' && (
                                                <button onClick={() => handlePublish(e.id)} className="bg-admin-accent text-admin-bg px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest hover:brightness-110 shadow-lg shadow-admin-accent/20 transition-all">Activer</button>
                                            )}
                                            <Link href={`/admin/events/${e.id}/edit`} className="w-10 h-10 bg-admin-inner border border-admin-border flex items-center justify-center rounded-xl text-admin-text-dim hover:text-admin-accent hover:border-admin-accent/30 transition-all">
                                                <Icons.Edit />
                                            </Link>
                                            <button onClick={() => handleDelete(e.id)} className="w-10 h-10 bg-admin-inner border border-admin-border flex items-center justify-center rounded-xl text-admin-text-dim hover:text-status-error hover:border-status-error/30 transition-all">
                                                <Icons.Delete />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
