'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import Link from 'next/link';

const Icons = {
    Plus: () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12h14" /></svg>,
};

export default function AdminDashboard() {
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get('/events/admin/stats').then(res => { setStats(res.data); setLoading(false); }).catch(() => setLoading(false));
    }, []);

    if (loading) return (
        <div className="flex h-[40vh] items-center justify-center">
            <div className="w-8 h-8 border-2 border-admin-border border-t-admin-accent rounded-full animate-spin"></div>
        </div>
    );

    const cards = [
        { label: 'Total Événements', value: stats?.totalEvents || 0, color: 'text-admin-accent', sub: 'Inscrits en base' },
        { label: 'Tickets Vendus', value: stats?.totalConfirmed || 0, color: 'text-status-success', sub: 'Confirmations OK' },
        { label: 'Chiffre d\'Affaires', value: `${stats?.totalRevenue || 0}€`, color: 'text-admin-accent', sub: 'Revenus générés' },
        { label: 'Taux Occup.', value: `${stats?.occupancyRate || 0}%`, color: 'text-status-warning', sub: 'Remplissage moyen' },
    ];

    return (
        <div className="space-y-12">
            <header className="flex justify-between items-end">
                <div className="space-y-1">
                    <h1 className="text-4xl font-black text-admin-text-main tracking-tighter uppercase italic">Dashboard</h1>
                    <p className="text-admin-text-dim font-bold text-[10px] uppercase tracking-widest px-1">Vue d'ensemble de l'activité</p>
                </div>
                <Link
                    href="/admin/events/create"
                    className="flex items-center gap-3 bg-admin-accent text-admin-bg px-8 py-4 rounded-xl font-black text-xs uppercase tracking-widest hover:brightness-110 shadow-xl transition-all active:scale-95"
                >
                    <Icons.Plus /> Nouveau Slot
                </Link>
            </header>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {cards.map((card, i) => (
                    <div key={i} className="bg-admin-card p-8 rounded-3xl border border-admin-border shadow-xl group hover:border-admin-accent/30 transition-all relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-admin-accent opacity-[0.02] blur-2xl -mr-12 -mt-12"></div>
                        <p className="text-[10px] font-black text-admin-text-dim uppercase tracking-widest mb-6">{card.label}</p>
                        <div className={`text-5xl font-black italic tracking-tighter ${card.color} mb-2`}>{card.value}</div>
                        <p className="text-[9px] font-bold text-admin-text-dim uppercase tracking-widest opacity-60">{card.sub}</p>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-20">
                <div className="lg:col-span-2 bg-admin-card rounded-[2.5rem] border border-admin-border p-10 min-h-[300px] flex flex-col justify-center items-center relative overflow-hidden">
                    <div className="text-[10px] font-black text-admin-text-dim uppercase tracking-widest mb-12 italic opacity-20">Analyse Graphique à venir</div>
                    <div className="flex items-end gap-3 h-32">
                        {[40, 70, 45, 90, 65, 80, 55].map((h, i) => (
                            <div key={i} style={{ height: `${h}%` }} className="w-8 bg-admin-inner border border-admin-border rounded-lg group hover:bg-admin-accent/50 transition-all flex items-end overflow-hidden">
                                <div className="w-full bg-admin-accent h-0 group-hover:h-full transition-all duration-700"></div>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="bg-admin-card rounded-[2.5rem] border border-admin-border p-10 space-y-8">
                    <h3 className="text-xs font-black uppercase tracking-widest text-admin-text-main">Actions Rapides</h3>
                    <div className="space-y-4">
                        <Link href="/admin/events" className="block w-full text-center py-4 bg-admin-inner border border-admin-border rounded-xl text-[10px] font-black uppercase tracking-widest hover:border-admin-accent transition-all">Gérer le Catalogue</Link>
                        <Link href="/admin/reservations" className="block w-full text-center py-4 bg-admin-inner border border-admin-border rounded-xl text-[10px] font-black uppercase tracking-widest hover:border-admin-accent transition-all">Audit Inscriptions</Link>
                        <Link href="/admin/categories" className="block w-full text-center py-4 bg-admin-inner border border-admin-border rounded-xl text-[10px] font-black uppercase tracking-widest hover:border-admin-accent transition-all">Mettre à jour Thématiques</Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
