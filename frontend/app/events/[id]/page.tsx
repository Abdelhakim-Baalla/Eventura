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
        if (!confirm('Rejoindre cet événement ?')) return;
        setReserving(true);
        try {
            await api.post('/reservations', { evenementId: id });
            router.push('/reservations');
        }
        catch (err: any) {
            if (err.response?.status === 401) router.push('/login');
            else alert(err.response?.data?.message || 'Erreur lors de la réservation');
        }
        finally { setReserving(false); }
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-site-bg">
            <div className="w-10 h-10 border-2 border-site-border border-t-site-accent rounded-full animate-spin"></div>
        </div>
    );

    if (!event) return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-site-bg text-site-text-main p-12 text-center space-y-4">
            <h1 className="text-4xl font-black uppercase italic">Événement introuvable.</h1>
            <Link href="/" className="text-site-accent font-black uppercase tracking-widest text-xs hover:underline">Retour au catalogue</Link>
        </div>
    );

    return (
        <div className="min-h-screen bg-site-bg text-site-text-main font-sans selection:bg-site-accent selection:text-white pb-32">
            <nav className="h-16 bg-site-bg/90 backdrop-blur-md border-b border-site-border flex items-center sticky top-0 z-50 px-6 lg:px-12">
                <div className="max-w-6xl mx-auto w-full flex items-center justify-between">
                    <Link href="/" className="text-[10px] font-black uppercase tracking-widest text-site-text-muted hover:text-white transition-all flex items-center gap-2 group">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="group-hover:-translate-x-1 transition-transform"><path d="m15 18-6-6 6-6" /></svg>
                        Retour
                    </Link>
                    <span className="text-[9px] font-black uppercase tracking-[0.2em] text-site-text-muted italic opacity-50 truncate max-w-xs">{event.titre}</span>
                    <div className="w-20"></div>
                </div>
            </nav>

            <main className="max-w-6xl mx-auto px-6 pt-12">
                <div className="bg-site-card rounded-3xl border border-site-border overflow-hidden shadow-2xl flex flex-col md:flex-row min-h-[500px]">
                    <div className="md:w-1/2 relative bg-site-inner overflow-hidden border-r border-site-border">
                        {event.imageAffiche ? (
                            <img src={event.imageAffiche} alt={event.titre} className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-site-text-dim text-[10px] font-black uppercase tracking-widest opacity-20">No Visual</div>
                        )}
                        <div className="absolute top-6 left-6 bg-site-accent text-white px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border border-white/20 shadow-xl shadow-site-accent/20">
                            {event.categorie?.nom}
                        </div>
                    </div>

                    <div className="md:w-1/2 p-10 md:p-16 space-y-12 flex flex-col">
                        <div className="space-y-6">
                            <h1 className="text-4xl md:text-5xl font-black tracking-tighter uppercase italic leading-[0.9]">{event.titre}</h1>
                            <div className="grid grid-cols-2 gap-8 py-6 border-y border-site-border">
                                <div className="space-y-1">
                                    <p className="text-[9px] font-black text-site-text-muted uppercase tracking-widest opacity-60 italic">Date & Heure</p>
                                    <p className="text-sm font-black text-site-text-main italic">{new Date(event.dateHeureDebut).toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' })}</p>
                                    <p className="text-xs font-bold text-site-accent">{new Date(event.dateHeureDebut).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[9px] font-black text-site-text-muted uppercase tracking-widest opacity-60 italic">Lieu</p>
                                    <p className="text-sm font-black text-site-text-main italic uppercase tracking-tight">{event.lieu}</p>
                                </div>
                            </div>
                        </div>

                        <div className="flex-1 space-y-4">
                            <h2 className="text-[10px] font-black text-site-accent uppercase tracking-widest border-l-2 border-site-accent pl-3">Description</h2>
                            <div className="text-base text-site-text-muted leading-relaxed font-medium" dangerouslySetInnerHTML={{ __html: event.description }}></div>
                        </div>

                        <div className="pt-10 flex items-center justify-between gap-8">
                            <div className="space-y-1">
                                <span className="text-[9px] font-black text-site-accent uppercase tracking-widest">Prix d'accès</span>
                                <p className="text-5xl font-black text-white italic tracking-tighter">{event.prix}€</p>
                            </div>

                            {new Date(event.dateHeureDebut) < new Date() ? (
                                <div className="px-8 py-4 bg-site-inner border border-site-border rounded-xl text-[10px] font-black uppercase text-site-text-muted tracking-widest italic opacity-50">Session Terminée</div>
                            ) : event.placesRestantes === 0 ? (
                                <div className="px-8 py-4 bg-status-error/10 border border-status-error/20 rounded-xl text-[10px] font-black uppercase text-status-error tracking-widest italic shadow-xl shadow-status-error/10">Plus de places</div>
                            ) : (
                                <button
                                    onClick={handleReserve}
                                    disabled={reserving}
                                    className="bg-site-accent text-white px-10 py-5 rounded-2xl text-[11px] font-black uppercase tracking-widest hover:brightness-110 shadow-xl shadow-site-accent/30 transition-all active:scale-95 disabled:opacity-50"
                                >
                                    {reserving ? 'Chargement...' : 'Réserver mon ticket'}
                                </button>
                            )}
                        </div>

                        <div className="pt-6 border-t border-site-border">
                            <div className="flex items-center gap-3">
                                <div className="w-2 h-2 rounded-full bg-status-success shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>
                                <p className="text-[10px] font-black uppercase tracking-widest text-site-text-muted">Places restantes : <span className="text-white">{event.placesRestantes} / {event.capaciteMax}</span></p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
