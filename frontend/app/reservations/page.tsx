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
        image?: string;
    };
}

export default function MyReservationsPage() {
    const [reservations, setReservations] = useState<Reservation[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get('/reservations/my')
            .then(res => setReservations(res.data))
            .catch(err => console.error(err))
            .finally(() => setLoading(false));
    }, []);

    return (
        <div className="min-h-screen bg-gray-50 text-black">
            <nav className="bg-white shadow-sm border-b">
                <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
                    <Link href="/" className="text-blue-600 font-bold">Eventura</Link>
                    <h1 className="font-bold">Mes Tickets</h1>
                    <Link href="/" className="text-sm text-gray-500 underline">Accueil</Link>
                </div>
            </nav>

            <main className="max-w-4xl mx-auto px-4 py-8">
                {loading ? (
                    <div className="flex justify-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                    </div>
                ) : reservations.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-xl border shadow-sm">
                        <span className="text-5xl mb-4 block">🎫</span>
                        <h2 className="text-xl font-bold mb-2">Vous n'avez pas encore de tickets</h2>
                        <p className="text-gray-500 mb-6">Découvrez nos événements et réservez votre place !</p>
                        <Link href="/" className="bg-blue-600 text-white px-6 py-2 rounded-lg font-bold">Explorer les événements</Link>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {reservations.map(res => (
                            <div key={res.id} className="bg-white rounded-xl shadow-sm border overflow-hidden flex flex-col md:flex-row">
                                <div className="w-full md:w-48 h-32 md:h-auto bg-gray-200">
                                    {res.evenement.image ? (
                                        <img src={res.evenement.image} alt={res.evenement.titre} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-gray-400">Pas d'image</div>
                                    )}
                                </div>
                                <div className="p-6 flex-1">
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="text-lg font-bold text-blue-600">{res.evenement.titre}</h3>
                                        <span className={`text-[10px] font-bold px-2 py-1 rounded-full uppercase ${res.statut === 'CONFIRME' ? 'bg-green-100 text-green-800' :
                                            res.statut === 'REFUSE' ? 'bg-red-100 text-red-800' :
                                                res.statut === 'ANNULE' ? 'bg-gray-100 text-gray-800' :
                                                    'bg-yellow-100 text-yellow-800'
                                            }`}>
                                            {res.statut}
                                        </span>
                                    </div>
                                    <div className="text-sm text-gray-600 space-y-1 mb-4">
                                        <p>📅 {new Date(res.evenement.dateHeureDebut).toLocaleString()}</p>
                                        <p>📍 {res.evenement.lieu}</p>
                                    </div>
                                    <div className="border-t border-dashed pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                        <div>
                                            <p className="text-[10px] text-gray-400 uppercase font-bold tracking-widest">Référence Ticket</p>
                                            <p className="font-mono font-bold text-gray-800">{res.referenceTicket}</p>
                                        </div>
                                        <Link href={`/events/${res.evenement.id}`} className="text-sm text-blue-600 font-medium hover:underline">Voir l'événement →</Link>
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
