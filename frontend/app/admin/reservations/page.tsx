'use client';

import { useState, useEffect, useCallback } from 'react';
import api from '@/lib/api';

const Icons = {
    Search: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>,
    User: () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>,
    Check: () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>,
    X: () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18M6 6l12 12" /></svg>,
};

interface Reservation {
    id: string;
    statut: string;
    dateReservation: string;
    utilisateur: { id: string; nom: string; prenom: string; email: string };
    evenement: { id: string; titre: string };
}

export default function AdminReservationsPage() {
    const [reservations, setReservations] = useState<Reservation[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    const loadReservations = useCallback(() => {
        api.get('/reservations/admin').then(res => { setReservations(res.data); setLoading(false); }).catch(() => setLoading(false));
    }, []);

    useEffect(() => {
        loadReservations();
    }, [loadReservations]);

    const handleUpdateStatus = async (id: string, statut: string) => {
        try {
            await api.patch(`/reservations/${id}/status`, { statut });
            loadReservations();
        } catch { alert('Erreur lors de la mise à jour'); }
    };

    const filtered = reservations.filter(r =>
        r.utilisateur.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.evenement.titre.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return (
        <div className="flex h-[40vh] items-center justify-center">
            <div className="w-10 h-10 border-2 border-admin-border border-t-admin-accent rounded-full animate-spin"></div>
        </div>
    );

    return (
        <div className="space-y-12">
            <div className="flex justify-between items-end">
                <div className="space-y-1">
                    <h1 className="text-6xl font-black text-admin-text-main tracking-tighter uppercase italic">Flux</h1>
                    <p className="text-admin-text-dim font-bold text-xs uppercase tracking-[0.3em] px-1">Audit des Transmissions de données</p>
                </div>
            </div>

            <div className="relative group max-w-2xl">
                <div className="absolute left-8 top-1/2 -translate-y-1/2 text-admin-text-dim group-focus-within:text-admin-accent transition-colors">
                    <Icons.Search />
                </div>
                <input
                    type="text"
                    placeholder="Scanner identifiants ou protocoles..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-admin-card border border-admin-border rounded-[2rem] py-8 pl-20 pr-8 text-sm font-black text-admin-text-main uppercase tracking-widest focus:border-admin-accent/50 outline-none transition-all shadow-2xl placeholder:italic placeholder:opacity-30"
                />
            </div>

            <div className="bg-admin-card rounded-[3.5rem] border border-admin-border overflow-hidden shadow-2xl">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-admin-inner/50 border-b border-admin-border text-admin-text-dim text-[10px] uppercase font-black tracking-[0.4em]">
                                <th className="px-12 py-8">Source Identité</th>
                                <th className="px-12 py-8">Cible Unit</th>
                                <th className="px-12 py-8">Statut Flux</th>
                                <th className="px-12 py-8 text-right">Contrôle / Signature</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-admin-border/50">
                            {filtered.map((r) => (
                                <tr key={r.id} className="hover:bg-admin-inner/30 transition-all group">
                                    <td className="px-12 py-10">
                                        <div className="flex items-center gap-6">
                                            <div className="w-14 h-14 bg-admin-inner rounded-xl border border-admin-border flex items-center justify-center text-admin-accent shadow-inner group-hover:bg-admin-accent group-hover:text-admin-bg transition-all">
                                                <Icons.User />
                                            </div>
                                            <div>
                                                <div className="text-lg font-black text-admin-text-main tracking-tighter uppercase italic group-hover:text-admin-accent transition-colors">{r.utilisateur.nom}</div>
                                                <div className="text-[10px] font-bold text-admin-text-dim tracking-widest uppercase">{r.utilisateur.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-12 py-10">
                                        <div className="text-sm font-black text-admin-text-muted italic group-hover:text-admin-text-main transition-colors">{r.evenement.titre}</div>
                                    </td>
                                    <td className="px-12 py-10">
                                        <span className={`px-5 py-2 rounded-xl text-[9px] font-black uppercase tracking-[0.2em] border ${r.statut === 'CONFIRME'
                                            ? 'bg-status-success/5 text-status-success border-status-success/20 shadow-[0_0_15px_rgba(16,185,129,0.1)]'
                                            : r.statut === 'REFUSE' || r.statut === 'ANNULE'
                                                ? 'bg-status-error/5 text-status-error border-status-error/20'
                                                : 'bg-admin-inner text-admin-text-dim border-admin-border'
                                            }`}>
                                            {r.statut}
                                        </span>
                                    </td>
                                    <td className="px-12 py-10 text-right">
                                        <div className="flex items-center justify-end gap-6">
                                            {r.statut === 'EN_ATTENTE' && (
                                                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all">
                                                    <button onClick={() => handleUpdateStatus(r.id, 'CONFIRME')} className="w-10 h-10 flex items-center justify-center bg-admin-inner border border-admin-border rounded-xl text-status-success hover:bg-status-success hover:text-white transition-all">
                                                        <Icons.Check />
                                                    </button>
                                                    <button onClick={() => handleUpdateStatus(r.id, 'REFUSE')} className="w-10 h-10 flex items-center justify-center bg-admin-inner border border-admin-border rounded-xl text-status-error hover:bg-status-error hover:text-white transition-all">
                                                        <Icons.X />
                                                    </button>
                                                </div>
                                            )}
                                            <span className="font-mono text-xs text-admin-accent font-black tracking-tighter">
                                                {r.referenceTicket}
                                            </span>
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
