'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import Link from 'next/link';

interface Event {
    id: string;
    titre: string;
    description: string;
    dateHeureDebut: string;
    dateHeureFin: string;
    lieu: string;
    prix: number;
    capacite: number;
    categorie: { nom: string };
    image?: string;
}

export default function EventDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const [event, setEvent] = useState<Event | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get(`/events/${id}`)
            .then(res => setEvent(res.data))
            .catch(err => console.error(err))
            .finally(() => setLoading(false));
    }, [id]);

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-white">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
    );

    if (!event) return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-white text-black">
            <h1 className="text-2xl font-bold mb-4">Événement introuvable</h1>
            <Link href="/" className="text-blue-600 hover:underline">Retour à l'accueil</Link>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50 text-black">
            {/* Header / Nav */}
            <nav className="bg-white shadow-sm border-b sticky top-0 z-10">
                <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
                    <Link href="/" className="text-blue-600 font-bold">← Retour</Link>
                    <span className="font-semibold truncate max-w-[200px]">{event.titre}</span>
                    <div className="w-10"></div> {/* Spacer */}
                </div>
            </nav>

            <main className="max-w-4xl mx-auto px-4 py-8">
                {/* Image & Main Info */}
                <div className="bg-white rounded-2xl shadow-sm border overflow-hidden mb-8">
                    <div className="h-64 sm:h-96 bg-gray-200">
                        {event.image ? (
                            <img src={event.image} alt={event.titre} className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400">Pas d'image</div>
                        )}
                    </div>

                    <div className="p-6 sm:p-10">
                        <div className="flex flex-wrap gap-2 mb-4">
                            <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold">
                                {event.categorie?.nom}
                            </span>
                        </div>

                        <h1 className="text-3xl sm:text-4xl font-black mb-6">{event.titre}</h1>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10 text-gray-700">
                            <div className="flex items-center gap-3">
                                <span className="text-2xl">📅</span>
                                <div>
                                    <p className="font-bold">Date et heure</p>
                                    <p className="text-sm">Début : {new Date(event.dateHeureDebut).toLocaleString()}</p>
                                    <p className="text-sm">Fin : {new Date(event.dateHeureFin).toLocaleString()}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="text-2xl">📍</span>
                                <div>
                                    <p className="font-bold">Lieu</p>
                                    <p className="text-sm">{event.lieu}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="text-2xl">👥</span>
                                <div>
                                    <p className="font-bold">Capacité</p>
                                    <p className="text-sm">{event.capacite} personnes max</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="text-2xl">💰</span>
                                <div>
                                    <p className="font-bold">Prix</p>
                                    <p className="text-xl font-black text-blue-600">{event.prix === 0 ? 'Gratuit' : `${event.prix} €`}</p>
                                </div>
                            </div>
                        </div>

                        <div className="border-t pt-8">
                            <h2 className="text-xl font-bold mb-4">À propos de cet événement</h2>
                            <div className="prose max-w-none text-gray-800 whitespace-pre-wrap">
                                {event.description}
                            </div>
                        </div>

                        <div className="mt-12 sticky bottom-8 sm:static">
                            <button className="w-full bg-blue-600 text-white text-lg font-bold py-4 rounded-xl shadow-lg hover:bg-blue-700 transition-colors transform active:scale-95">
                                Réserver ma place
                            </button>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
