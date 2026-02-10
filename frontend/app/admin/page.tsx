'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import Link from 'next/link';

const Icons = {
    Plus: () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12h14" /></svg>,
    Arrow: () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6" /></svg>
};

export default function AdminDashboard() {
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get('/events/admin/stats').then(res => {
            setStats(res.data);
            setLoading(false);
        }).catch(() => setLoading(false));
    }, []);

    if (loading) return (
        <div className="flex h-[50vh] items-center justify-center">
            <div className="w-10 h-10 border-2 border-admin-border border-t-admin-accent rounded-full animate-spin"></div>
        </div>
    );

    return (
        <div className="space-y-16">
            <div className="flex justify-between items-end gap-10">
                <div className="space-y-2">
                    <h1 className="text-8xl font-black text-admin-text-main tracking-tighter uppercase italic leading-none">Console</h1>
                    <p className="text-admin-text-muted font-bold text-sm uppercase tracking-widest px-1">Monitoring & Contrôle du Réseau</p>
                </div>
                <Link
                    href="/admin/events/create"
                    className="flex items-center gap-4 bg-admin-accent text-admin-bg px-10 py-5 rounded-2xl font-black text-xs uppercase tracking-widest hover:brightness-110 shadow-2xl shadow-admin-accent/20 transition-all active:scale-95"
                >
                    <Icons.Plus /> Injection de Données
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                    { label: 'Unités Publiées', value: stats?.totalEvents || 0, color: 'text-admin-text-main' },
                    { label: 'Flux Inscriptions', value: stats?.totalReservations || 0, color: 'text-admin-accent' },
                    { label: 'Volume (€)', value: stats?.totalRevenue || 0, color: 'text-admin-text-main' }
                ].map((s, i) => (
                    <div key={i} className="bg-admin-card p-12 rounded-[3.5rem] border border-admin-border flex flex-col justify-between h-80 group hover:border-admin-accent/40 transition-all shadow-xl">
                        <span className="text-[10px] font-black text-admin-text-dim uppercase tracking-[0.3em]">{s.label}</span>
                        <div className="space-y-4">
                            <h2 className={`text-8xl font-black tracking-tighter italic ${s.color}`}>{s.value}</h2>
                            <div className="w-12 h-1 bg-admin-border group-hover:bg-admin-accent transition-colors"></div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="bg-admin-card p-2 rounded-[5rem] border border-admin-border shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-admin-accent opacity-[0.02] blur-[150px] -mr-80 -mt-80"></div>

                <div className="bg-admin-inner p-16 lg:p-24 rounded-[4.8rem] flex flex-col lg:flex-row items-center justify-between gap-16 relative z-10">
                    <div className="space-y-8 text-center lg:text-left">
                        <h3 className="text-xl font-black text-admin-text-main uppercase tracking-tighter italic">Saturation du Réseau</h3>
                        <p className="text-admin-text-muted max-w-sm font-medium leading-relaxed">Analyse en temps réel du taux d'occupation global sur l'ensemble des protocoles actifs.</p>
                        <div className="flex gap-4">
                            <div className="px-4 py-2 bg-admin-bg rounded-lg border border-admin-border text-[10px] font-black uppercase text-admin-accent tracking-widest">Temps Réel</div>
                            <div className="px-4 py-2 bg-admin-bg rounded-lg border border-admin-border text-[10px] font-black uppercase text-admin-text-dim tracking-widest">Optimisé</div>
                        </div>
                    </div>

                    <div className="flex items-center gap-16">
                        <div className="text-right flex flex-col items-end">
                            <span className="text-[14rem] font-black text-admin-text-main tracking-tighter leading-none italic select-none">
                                {stats?.occupancyRate || 0}
                                <span className="text-5xl text-admin-accent ml-4 not-italic">%</span>
                            </span>
                            <span className="text-[9px] font-black text-admin-text-dim uppercase tracking-[0.5em] mt-4">Performance Analytique</span>
                        </div>
                        <div className="w-8 h-64 bg-admin-bg rounded-full border border-admin-border flex items-end p-1.5 shadow-inner">
                            <div
                                className="w-full bg-admin-accent rounded-full transition-all duration-[2s] shadow-[0_0_30px_rgba(245,158,11,0.4)]"
                                style={{ height: `${stats?.occupancyRate || 0}%` }}
                            ></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
