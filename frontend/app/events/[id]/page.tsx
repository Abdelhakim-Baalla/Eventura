'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import Link from 'next/link';

interface Event { id: string; titre: string; description: string; dateHeureDebut: string; dateHeureFin: string; lieu: string; prix: number; capaciteMax: number; placesRestantes: number; categorie: { nom: string }; imageAffiche?: string; }

export default function EventDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const router = useRouter();
    const [event, setEvent] = useState<Event | null>(null);
    const [loading, setLoading] = useState(true);
    const [reserving, setReserving] = useState(false);

    useEffect(() => {
        api.get(`/events/${id}`).then(res => setEvent(res.data)).catch(err => console.error(err)).finally(() => setLoading(false));
    }, [id]);

    const handleReserve = async () => {
        if (!confirm('Rejoindre cette session ?')) return;
        setReserving(true);
        try { await api.post('/reservations', { evenementId: id }); router.push('/reservations'); }
        catch (err: any) { if (err.response?.status === 401) router.push('/login'); else alert(err.response?.data?.message || 'Erreur'); }
        finally { setReserving(false); }
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-admin-bg">
            <div className="w-16 h-16 border-2 border-admin-border border-t-admin-accent rounded-full animate-spin"></div>
        </div>
    );

    if (!event) return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-admin-bg text-admin-text-main p-20 text-center space-y-8">
            <h1 className="text-7xl font-black italic uppercase tracking-tighter">Unité Inconnue.</h1>
            <Link href="/" className="text-admin-accent font-black uppercase tracking-[0.5em] text-[11px] hover:underline decoration-4 underline-offset-8">Retour au Catalogue Central</Link>
        </div>
    );

    return (
        <div className="min-h-screen bg-admin-bg text-admin-text-main font-sans selection:bg-admin-accent selection:text-admin-bg pb-48 overflow-x-hidden">
            <nav className="h-24 bg-admin-card/80 backdrop-blur-xl border-b border-admin-border flex items-center sticky top-0 z-50 px-10">
                <div className="max-w-6xl mx-auto w-full flex items-center justify-between">
                    <Link href="/" className="text-[11px] font-black uppercase tracking-[0.4em] text-admin-accent hover:text-admin-text-main transition-all flex items-center gap-6 group">
                        <div className="w-10 h-10 border-2 border-admin-accent rounded-xl flex items-center justify-center group-hover:bg-admin-accent group-hover:text-admin-bg transition-all">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>
                        </div>
                        RETOUR
                    </Link>
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-admin-text-dim truncate max-w-[300px] italic opacity-50">{event.titre}</span>
                    <div className="w-40"></div>
                </div>
            </nav>

            <main className="max-w-6xl mx-auto px-10 pt-20">
                <div className="bg-admin-card rounded-[5rem] border-2 border-admin-border overflow-hidden shadow-[0_50px_100px_rgba(0,0,0,0.5)] relative">
                    <div className="h-[650px] bg-admin-inner relative group">
                        {event.imageAffiche ? (
                            <img src={event.imageAffiche} alt={event.titre} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-admin-text-dim font-black uppercase tracking-[0.8em] italic opacity-10 text-4xl">Image Null</div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-admin-card via-admin-card/20 to-transparent"></div>
                        <div className="absolute bottom-20 left-20 right-20 space-y-10">
                            <span className="bg-admin-accent text-admin-bg px-6 py-2 rounded-xl text-[11px] font-black uppercase tracking-[0.5em] inline-block shadow-2xl shadow-admin-accent/30 scale-110">
                                {event.categorie?.nom}
                            </span>
                            <h1 className="text-7xl md:text-[9rem] font-black tracking-tighter uppercase italic leading-[0.8] drop-shadow-2xl">{event.titre}</h1>
                        </div>
                    </div>

                    <div className="p-20 flex flex-col lg:flex-row gap-24 relative">
                        <div className="absolute top-0 right-0 w-96 h-96 bg-admin-accent opacity-[0.03] blur-[150px] -mr-48 -mt-48"></div>

                        <div className="flex-1 space-y-16">
                            <div className="space-y-8">
                                <h2 className="text-[11px] font-black text-admin-accent uppercase tracking-[0.6em] border-l-4 border-admin-accent pl-6">Narration Logue</h2>
                                <div className="text-2xl text-admin-text-main leading-relaxed font-bold italic opacity-90 prose-invert" dangerouslySetInnerHTML={{ __html: event.description }}></div>
                            </div>
                        </div>

                        <div className="w-full lg:w-96 shrink-0 relative z-10">
                            <div className="bg-admin-bg/50 backdrop-blur-3xl p-12 rounded-[4rem] border-2 border-admin-border space-y-16 h-fit sticky top-40 shadow-2xl">
                                <div className="space-y-10">
                                    <div className="space-y-2 border-b border-admin-border pb-6">
                                        <p className="text-[10px] font-black text-admin-text-dim uppercase tracking-[0.4em]">Temporalité</p>
                                        <p className="text-2xl font-black text-admin-text-main italic">{new Date(event.dateHeureDebut).toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' })}</p>
                                        <p className="text-sm font-black text-admin-accent uppercase tracking-widest">{new Date(event.dateHeureDebut).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</p>
                                    </div>
                                    <div className="space-y-2 border-b border-admin-border pb-6">
                                        <p className="text-[10px] font-black text-admin-text-dim uppercase tracking-[0.4em]">Géolocalisation</p>
                                        <p className="text-2xl font-black text-admin-text-main italic uppercase tracking-tighter leading-none">{event.lieu}</p>
                                    </div>
                                    <div className="space-y-2 border-b border-admin-border pb-6">
                                        <p className="text-[10px] font-black text-admin-text-dim uppercase tracking-[0.4em]">Disponibilité Flux</p>
                                        <div className="flex items-center gap-4">
                                            <p className={`text-3xl font-black italic tracking-tighter ${event.placesRestantes < 5 ? 'text-status-error' : 'text-status-success'}`}>{event.placesRestantes} / {event.capaciteMax}</p>
                                            <span className="text-[10px] font-black uppercase text-admin-text-dim tracking-widest italic leading-none pt-2">Units Open</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-10 flex flex-col gap-10">
                                    <div className="flex flex-col gap-1">
                                        <span className="text-[10px] font-black text-admin-text-dim uppercase tracking-[0.5em]">Tarification Session</span>
                                        <span className="text-7xl font-black text-admin-accent tracking-tighter italic leading-none">{event.prix}€</span>
                                    </div>

                                    {new Date(event.dateHeureDebut) < new Date() ? (
                                        <div className="w-full py-8 bg-admin-inner border-2 border-admin-border rounded-[2.5rem] text-[11px] font-black uppercase text-center text-admin-text-dim tracking-[0.4em] italic cursor-not-allowed opacity-30">UNITÉ CLOSE</div>
                                    ) : event.placesRestantes === 0 ? (
                                        <div className="w-full py-8 bg-status-error/10 border-2 border-status-error/20 rounded-[2.5rem] text-[11px] font-black uppercase text-center text-status-error tracking-[0.4em] italic cursor-not-allowed shadow-2xl">CAPACITÉ SATURÉE</div>
                                    ) : (
                                        <button
                                            onClick={handleReserve}
                                            disabled={reserving}
                                            className="w-full py-8 bg-admin-accent text-admin-bg rounded-[2.5rem] text-xs font-black uppercase tracking-[0.4em] hover:brightness-110 shadow-[0_20px_40px_rgba(245,158,11,0.3)] transition-all active:scale-95 disabled:opacity-50"
                                        >
                                            {reserving ? 'SYNCHRONISATION...' : 'RÉSERVER L\'ACCÈS'}
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
