'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import Link from 'next/link';

interface Reservation {
    id: string;
    referenceTicket: string;
    statut: string;
    dateReservation: string;
    evenement: {
        id: string;
        titre: string;
        dateHeureDebut: string;
        lieu: string;
        imageAffiche?: string;
    };
}

export default function MyReservationsPage() {
    const [reservations, setReservations] = useState<Reservation[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('ALL');

    useEffect(() => {
        fetchReservations();
    }, []);

    const fetchReservations = async () => {
        setLoading(true);
        try {
            const res = await api.get('/reservations/my');
            setReservations(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = async (id: string) => {
        if (!confirm('Êtes-vous sûr de vouloir annuler cette réservation ?')) return;
        try {
            await api.patch(`/reservations/${id}/cancel`);
            alert('Réservation annulée avec succès.');
            fetchReservations();
        } catch (err: any) {
            alert(err.response?.data?.message || 'Erreur lors de l\'annulation');
        }
    };

    const handleDownloadPDF = (res: Reservation) => {
        alert(`Téléchargement du ticket ${res.referenceTicket} en cours...\n(Simulation PDF)`);
    };

    const filteredReservations = reservations.filter(res =>
        filter === 'ALL' ? true : res.statut === filter
    );

    return (
        <div className="min-h-screen bg-gray-50 text-black">
            <nav className="bg-white shadow-sm border-b sticky top-0 z-10">
                <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
                    <Link href="/" className="text-blue-600 font-black text-2xl italic">Eventura</Link>
                    <h1 className="font-bold text-gray-700 hidden sm:block">Mes Réservations</h1>
                    <Link href="/" className="text-sm bg-gray-100 px-4 py-2 rounded-lg font-bold hover:bg-gray-200 transition-colors">Accueil</Link>
                </div>
            </nav>

            <main className="max-w-4xl mx-auto px-4 py-8">
                <div className="mb-8">
                    <h2 className="text-3xl font-black mb-2">Vos Tickets</h2>
                    <p className="text-gray-500">Retrouvez toutes vos réservations et gérez vos places.</p>
                </div>

                <div className="flex gap-2 mb-8 overflow-x-auto pb-2 scrollbar-hide">
                    {['ALL', 'EN_ATTENTE', 'CONFIRME', 'ANNULE', 'REFUSE'].map(s => (
                        <button
                            key={s}
                            onClick={() => setFilter(s)}
                            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${filter === s
                                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-200'
                                    : 'bg-white text-gray-500 border border-gray-100 hover:border-blue-200 hover:text-blue-600'
                                }`}
                        >
                            {s === 'ALL' ? 'Tous les tickets' : s.replace('_', ' ')}
                        </button>
                    ))}
                </div>

                {loading ? (
                    <div className="flex justify-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                    </div>
                ) : filteredReservations.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200 shadow-sm">
                        <span className="text-6xl mb-6 block">🎫</span>
                        <h2 className="text-2xl font-black mb-2">Rien à afficher ici</h2>
                        <p className="text-gray-500 mb-8 max-w-sm mx-auto">Vous n'avez aucune réservation correspondant à ce filtre pour le moment.</p>
                        <Link href="/" className="bg-blue-600 text-white px-8 py-3 rounded-2xl font-black hover:bg-blue-700 transition-all shadow-xl shadow-blue-100 inline-block">Explorer les événements</Link>
                    </div>
                ) : (
                    <div className="grid gap-6">
                        {filteredReservations.map(res => (
                            <div key={res.id} className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden flex flex-col md:flex-row transition-all hover:shadow-xl hover:shadow-gray-100">
                                <div className="w-full md:w-56 h-48 md:h-auto bg-gray-100 flex-shrink-0 relative">
                                    {res.evenement.imageAffiche ? (
                                        <img src={res.evenement.imageAffiche} alt={res.evenement.titre} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-gray-300 font-black text-xs uppercase p-4 text-center">Affiche non disponible</div>
                                    )}
                                    <div className={`absolute top-4 left-4 px-3 py-1 rounded-full text-[10px] font-black uppercase shadow-lg ${res.statut === 'CONFIRME' ? 'bg-green-500 text-white' :
                                            res.statut === 'REFUSE' ? 'bg-red-500 text-white' :
                                                res.statut === 'ANNULE' ? 'bg-gray-500 text-white' :
                                                    'bg-yellow-500 text-white'
                                        }`}>
                                        {res.statut.replace('_', ' ')}
                                    </div>
                                </div>
                                <div className="p-8 flex-1 flex flex-col justify-between">
                                    <div>
                                        <h3 className="text-2xl font-black text-gray-900 mb-4 line-clamp-1">{res.evenement.titre}</h3>
                                        <div className="flex flex-wrap gap-6 text-sm text-gray-500 mb-6">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 font-bold">📅</div>
                                                <div>
                                                    <p className="text-[10px] uppercase font-black text-gray-300 tracking-tighter">Date</p>
                                                    <p className="font-bold text-gray-700">{new Date(res.evenement.dateHeureDebut).toLocaleDateString()}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center text-orange-600 font-bold">📍</div>
                                                <div>
                                                    <p className="text-[10px] uppercase font-black text-gray-300 tracking-tighter">Lieu</p>
                                                    <p className="font-bold text-gray-700 line-clamp-1">{res.evenement.lieu}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="border-t border-gray-50 pt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                                        <div className="bg-gray-50 px-4 py-2 rounded-2xl inline-block border border-gray-100">
                                            <p className="text-[9px] text-gray-400 uppercase font-black tracking-widest mb-0.5">Référence Ticket</p>
                                            <p className="font-mono font-black text-blue-600 text-base">{res.referenceTicket}</p>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            {res.statut === 'CONFIRME' && (
                                                <button
                                                    onClick={() => handleDownloadPDF(res)}
                                                    className="flex items-center gap-2 text-sm bg-blue-600 text-white px-6 py-2.5 rounded-2xl font-black hover:bg-black transition-all shadow-lg shadow-blue-100 hover:shadow-none"
                                                >
                                                    📥 Ticket PDF
                                                </button>
                                            )}
                                            {res.statut === 'EN_ATTENTE' && (
                                                <button
                                                    onClick={() => handleCancel(res.id)}
                                                    className="text-sm text-red-500 font-black hover:bg-red-50 px-4 py-2 rounded-xl transition-colors"
                                                >
                                                    Annuler
                                                </button>
                                            )}
                                            <Link href={`/events/${res.evenement.id}`} className="text-sm text-gray-400 font-bold hover:text-blue-600 transition-colors">Détails</Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}
