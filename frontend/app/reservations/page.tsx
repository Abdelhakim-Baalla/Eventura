'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import Link from 'next/link';

interface Reservation { id: string; referenceTicket: string; statut: string; dateReservation: string; utilisateur: { nom: string; email: string; }; evenement: { id: string; titre: string; dateHeureDebut: string; lieu: string; }; }

export default function MyReservationsPage() {
    const [reservations, setReservations] = useState<Reservation[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('ALL');

    useEffect(() => {
        setLoading(true);
        const params: any = {};
        if (filter !== 'ALL') params.statut = filter;
        api.get('/reservations/my', { params }).then(res => setReservations(res.data.items || [])).catch(err => console.error(err)).finally(() => setLoading(false));
    }, [filter]);

    const handleCancel = async (id: string) => {
        if (!confirm('Voulez-vous annuler ?')) return;
        try { await api.patch(`/reservations/${id}/cancel`); setFilter('ALL'); } catch (err) { alert('Erreur'); }
    };

    return (
        <div className="min-h-screen bg-admin-bg text-admin-text-main p-12 md:p-20 font-sans overflow-x-hidden selection:bg-admin-accent selection:text-admin-bg">
            <div className="max-w-5xl mx-auto space-y-20">
                <header className="flex justify-between items-end border-b-4 border-admin-border pb-12 noprint">
                    <div className="space-y-2">
                        <h1 className="text-7xl font-black tracking-tighter uppercase italic leading-none">Archives</h1>
                        <p className="text-admin-accent text-[11px] font-black uppercase tracking-[0.5em] italic">Coffre-fort Numérique / Mes Tickets</p>
                    </div>
                    <Link href="/" className="text-[10px] font-black uppercase tracking-widest text-admin-text-dim hover:text-admin-accent hover:underline decoration-4 underline-offset-8 transition-all px-4 pb-2">Retour Réseau</Link>
                </header>

                <div className="flex gap-4 overflow-x-auto pb-6 noprint scroll-smooth custom-scrollbar">
                    {['ALL', 'EN_ATTENTE', 'CONFIRME', 'ANNULE', 'REFUSE'].map(s => (
                        <button
                            key={s}
                            onClick={() => setFilter(s)}
                            className={`px-8 py-5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border-2 ${filter === s
                                    ? 'bg-admin-accent text-admin-bg border-admin-accent shadow-2xl shadow-admin-accent/30 scale-105'
                                    : 'bg-admin-card text-admin-text-dim border-admin-border hover:border-admin-accent/30'
                                }`}
                        >
                            {s}
                        </button>
                    ))}
                </div>

                {loading ? (
                    <div className="py-40 flex justify-center noprint">
                        <div className="w-12 h-12 border-2 border-admin-border border-t-admin-accent rounded-full animate-spin"></div>
                    </div>
                ) : reservations.length === 0 ? (
                    <div className="bg-admin-card p-24 rounded-[4rem] text-center border border-admin-border shadow-2xl noprint border-dashed">
                        <p className="text-admin-text-dim font-black uppercase tracking-[0.5em] mb-12 italic opacity-20 text-4xl">Néant.</p>
                        <Link href="/" className="bg-admin-accent text-admin-bg px-12 py-5 rounded-2xl text-xs font-black uppercase tracking-widest shadow-2xl shadow-admin-accent/20 hover:scale-105 transition-all inline-block">Scanner le Catalogue</Link>
                    </div>
                ) : (
                    <div className="space-y-12 pb-40">
                        {reservations.map(res => (
                            <div key={res.id} className="bg-admin-card p-12 md:p-16 rounded-[4.5rem] border border-admin-border shadow-2xl relative overflow-hidden flex flex-col md:flex-row justify-between gap-16 group page-break hover:border-admin-accent/30 transition-all">
                                <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-admin-accent opacity-[0.02] blur-[150px] -mr-40 -mt-40"></div>

                                <div className="space-y-12 flex-1">
                                    <div className="print-only mb-10 border-b-4 border-black pb-6 flex justify-between items-center">
                                        <p className="text-4xl font-black text-black italic">EVENTURA OFFICIAL</p>
                                        <span className="text-xs font-black uppercase tracking-widest border-2 border-black px-4 py-1">Secure Ticket</span>
                                    </div>

                                    <div className="space-y-4">
                                        <h3 className="text-5xl md:text-6xl font-black text-admin-text-main tracking-tighter uppercase leading-[0.85] italic mb-6 group-hover:text-admin-accent transition-colors">
                                            {res.evenement.titre}
                                        </h3>
                                        <div className="grid grid-cols-2 gap-12 pt-4">
                                            <div className="space-y-1">
                                                <p className="text-[10px] font-black text-admin-text-dim uppercase tracking-[0.4em]">Inauguration Session</p>
                                                <p className="text-lg font-black text-admin-text-main uppercase italic">{new Date(res.evenement.dateHeureDebut).toLocaleString('fr-FR', { day: '2-digit', month: 'long', hour: '2-digit', minute: '2-digit' })}</p>
                                            </div>
                                            <div className="space-y-1">
                                                <p className="text-[10px] font-black text-admin-text-dim uppercase tracking-[0.4em]">Géolocalisation Target</p>
                                                <p className="text-lg font-black text-admin-text-main uppercase italic">{res.evenement.lieu}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex flex-wrap items-center gap-10">
                                        <div className="bg-admin-inner border border-admin-border px-10 py-6 rounded-[2rem] shadow-inner border-l-admin-accent border-l-4">
                                            <p className="text-[9px] text-admin-text-dim uppercase font-black tracking-[0.5em] mb-2">Signature de Validation</p>
                                            <p className="font-mono font-black text-admin-accent text-3xl uppercase tracking-tighter selection:bg-admin-accent selection:text-admin-bg">#{res.referenceTicket}</p>
                                        </div>
                                        <div className="print-only opacity-30 border-2 border-dashed border-black p-4 text-[10px] font-black text-center w-32 h-32 flex items-center justify-center">QR_AUTH_MATRIX</div>
                                    </div>
                                </div>

                                <div className="flex flex-col items-start md:items-end justify-between min-w-[200px]">
                                    <span className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-[0.3em] border-2 shadow-xl ${res.statut === 'CONFIRME' ? 'bg-status-success/5 text-status-success border-status-success/20 shadow-status-success/10' :
                                            res.statut === 'ANNULE' ? 'bg-admin-inner text-admin-text-dim border-admin-border opacity-50' :
                                                'bg-status-warning/5 text-status-warning border-status-warning/20 shadow-status-warning/10'
                                        }`}>
                                        {res.statut}
                                    </span>

                                    <div className="mt-12 flex gap-6 noprint w-full md:w-auto">
                                        {res.statut === 'CONFIRME' && (
                                            <button onClick={() => window.print()} className="flex-1 md:flex-none bg-admin-text-main text-admin-bg px-10 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-admin-accent transition-all shadow-2xl active:scale-95">Imprimer Ticket</button>
                                        )}
                                        {res.statut === 'EN_ATTENTE' && (
                                            <button onClick={() => handleCancel(res.id)} className="flex-1 md:flex-none text-[10px] font-black uppercase tracking-[0.4em] text-status-error/60 hover:text-status-error transition-all px-4 py-4 border border-status-error/20 rounded-2xl hover:bg-status-error/5">Annuler Protocol</button>
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
                    .page-break { page-break-after: always; margin-bottom: 80px !important; border: 4px solid #000 !important; padding: 60px !important; border-radius: 0 !important; }
                    .bg-admin-card { background: white !important; border: none !important; box-shadow: none !important; }
                    .text-admin-text-main { color: black !important; }
                    .text-admin-text-dim { color: #666 !important; }
                    .text-admin-accent { color: #000 !important; border-color: #000 !important; }
                    .bg-admin-inner { background: #f0f0f0 !important; border: 2px solid #000 !important; border-radius: 0 !important; }
                }
            `}</style>
        </div>
    );
}
