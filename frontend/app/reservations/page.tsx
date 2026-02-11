'use client';

import { useState, useEffect, useRef } from 'react';
import api from '@/lib/api';
import Link from 'next/link';

interface Reservation { id: string; referenceTicket: string; statut: string; dateReservation: string; utilisateur: { nom: string; email: string; }; evenement: { id: string; titre: string; dateHeureDebut: string; lieu: string; }; }

interface ReservationResponse {
    items: Reservation[];
}

export default function MyReservationsPage() {
    const [reservations, setReservations] = useState<Reservation[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('ALL');
    const initializedRef = useRef(false);

    useEffect(() => {
        const params: Record<string, string> = {};
        if (filter !== 'ALL') params.statut = filter;
        setLoading(true);
        api.get<ReservationResponse>('/reservations/my', { params }).then(res => setReservations(res.data.items || [])).finally(() => setLoading(false));
    }, [filter]);

    const handleCancel = async (id: string) => {
        if (!confirm('Voulez-vous annuler l\'accès ?')) return;
        try { await api.patch(`/reservations/${id}/cancel`); setFilter('ALL'); } catch { alert('Erreur'); }
    };

    return (
        <div className="min-h-screen bg-site-bg text-site-text-main p-6 md:p-12 lg:p-20 font-sans overflow-x-hidden selection:bg-site-accent selection:text-white">
            <div className="max-w-5xl mx-auto space-y-12">
                <header className="flex justify-between items-end border-b border-site-border pb-8 noprint">
                    <div className="space-y-1">
                        <h1 className="text-4xl font-black tracking-tight uppercase italic leading-none">Mes Tickets</h1>
                        <p className="text-site-accent text-[10px] font-black uppercase tracking-widest italic opacity-60">Gestion des accès personnels</p>
                    </div>
                    <Link href="/" className="text-[10px] font-black uppercase tracking-widest text-site-text-muted hover:text-site-accent transition-all flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>
                        Retour
                    </Link>
                </header>

                <div className="flex gap-3 overflow-x-auto pb-6 noprint scroll-smooth custom-scrollbar">
                    {['ALL', 'EN_ATTENTE', 'CONFIRME', 'ANNULE', 'REFUSE'].map(s => (
                        <button
                            key={s}
                            onClick={() => setFilter(s)}
                            className={`px-6 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all border ${filter === s
                                    ? 'bg-site-accent text-white border-site-accent shadow-lg shadow-site-accent/20'
                                    : 'bg-site-card text-site-text-muted border-site-border hover:border-site-accent/30'
                                }`}
                        >
                            {s}
                        </button>
                    ))}
                </div>

                {loading ? (
                    <div className="py-24 flex justify-center noprint">
                        <div className="w-8 h-8 border-2 border-site-border border-t-site-accent rounded-full animate-spin"></div>
                    </div>
                ) : reservations.length === 0 ? (
                    <div className="bg-site-card p-16 rounded-[2rem] text-center border border-site-border shadow-xl noprint">
                        <p className="text-site-text-muted font-black uppercase tracking-widest mb-8 italic opacity-30 text-2xl">Zéro Ticket.</p>
                        <Link href="/" className="bg-site-accent text-white px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-site-accent/20 hover:scale-105 transition-all inline-block">Trouver un événement</Link>
                    </div>
                ) : (
                    <div className="space-y-8 pb-32">
                        {reservations.map(res => (
                            <div key={res.id} className="bg-site-card rounded-[2.5rem] border border-site-border shadow-xl flex flex-col md:flex-row relative overflow-hidden group page-break hover:border-site-accent/30 transition-all">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-site-accent opacity-[0.03] blur-[40px] -mr-16 -mt-16"></div>

                                <div className="md:w-16 bg-site-inner border-r border-site-border flex items-center justify-center py-4 md:py-0">
                                    <div className="md:-rotate-90 text-[10px] font-black text-site-accent uppercase tracking-widest whitespace-nowrap">
                                        MATRIX_AUTH_PROT
                                    </div>
                                </div>

                                <div className="p-8 md:p-10 flex-1 space-y-8">
                                    <div className="print-only mb-8 border-b-2 border-black pb-4 flex justify-between items-center">
                                        <p className="text-2xl font-black text-black italic">EVENTURA</p>
                                        <span className="text-[10px] font-black border border-black px-2 py-0.5">SECURE_TICKET</span>
                                    </div>

                                    <div className="space-y-4">
                                        <h3 className="text-3xl font-black text-white tracking-tight uppercase leading-none italic group-hover:text-site-accent transition-colors">
                                            {res.evenement.titre}
                                        </h3>
                                        <div className="grid grid-cols-2 gap-6 pt-4 border-t border-site-border/50">
                                            <div className="space-y-1">
                                                <p className="text-[8px] font-black text-site-text-muted uppercase tracking-[0.2em]">Session Date</p>
                                                <p className="text-sm font-black text-site-text-main uppercase italic">{new Date(res.evenement.dateHeureDebut).toLocaleString('fr-FR', { day: '2-digit', month: 'long', hour: '2-digit', minute: '2-digit' })}</p>
                                            </div>
                                            <div className="space-y-1">
                                                <p className="text-[8px] font-black text-site-text-muted uppercase tracking-[0.2em]">Localisation</p>
                                                <p className="text-sm font-black text-site-text-main uppercase italic">{res.evenement.lieu}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex flex-wrap items-center justify-between gap-6 pt-6 border-t border-site-border/50">
                                        <div className="bg-site-bg border border-site-border px-6 py-3 rounded-xl shadow-inner border-l-4 border-l-site-accent">
                                            <p className="text-[8px] text-site-text-muted uppercase font-black tracking-widest mb-1.5 opacity-50">Signature Numérique</p>
                                            <p className="font-mono font-black text-site-accent text-xl uppercase tracking-tighter">#{res.referenceTicket}</p>
                                        </div>
                                        <div className="flex gap-4 noprint">
                                            <span className={`px-4 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest border ${res.statut === 'CONFIRME' ? 'bg-status-success/5 text-status-success border-status-success/20' :
                                                    res.statut === 'ANNULE' ? 'bg-site-inner text-site-text-muted border-site-border opacity-50' :
                                                        'bg-status-warning/5 text-status-warning border-status-warning/20'
                                                }`}>
                                                {res.statut}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="p-8 md:p-10 border-t md:border-t-0 md:border-l border-site-border flex flex-col items-center justify-center gap-4 min-w-[180px] bg-site-inner/20">
                                    <div className="print-only opacity-30 border border-dashed border-black p-4 text-[8px] font-black text-center w-20 h-20 flex items-center justify-center">QR_AUTH</div>
                                    <div className="flex flex-col gap-3 noprint w-full">
                                        {res.statut === 'CONFIRME' && (
                                            <button onClick={() => window.print()} className="w-full bg-white text-site-bg px-6 py-2.5 rounded-xl text-[10px] font-black uppercase hover:bg-site-accent hover:text-white transition-all shadow-xl active:scale-95">Imprimer</button>
                                        )}
                                        {res.statut === 'EN_ATTENTE' && (
                                            <button onClick={() => handleCancel(res.id)} className="w-full text-[9px] font-black uppercase text-status-error/70 hover:text-status-error transition-all px-4 py-2.5 border border-status-error/20 rounded-xl hover:bg-status-error/5">Annuler</button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <style jsx global>{`
                .print-only { display: none; }
                @media print {
                    .noprint { display: none !important; }
                    .print-only { display: block !important; }
                    body { background: white !important; color: black !important; }
                    .page-break { page-break-after: always; margin-bottom: 60px !important; border: 2px solid #000 !important; padding: 40px !important; border-radius: 0 !important; }
                    .bg-site-card { background: white !important; border: none !important; box-shadow: none !important; }
                    .text-site-text-main { color: black !important; }
                    .text-site-text-muted { color: #666 !important; }
                    .text-site-accent { color: #000 !important; border-color: #000 !important; }
                    .bg-site-bg, .bg-site-inner { background: #f0f0f0 !important; border: 1px solid #000 !important; border-radius: 0 !important; }
                }
            `}</style>
        </div>
    );
}
