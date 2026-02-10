'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import api from '@/lib/api';

interface Event {
    id: string;
    titre: string;
    dateHeureDebut: string;
    lieu: string;
    capaciteMax: number;
    statut: string;
    imageAffiche?: string;
    categorie: { nom: string };
}

export default function AdminEventsPage() {
    const [events, setEvents] = useState<Event[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchEvents = async () => {
        try {
            const res = await api.get('/events/admin');
            setEvents(res.data);
        } catch (err) {
            console.error(err);
            setError('Impossible de charger les événements.');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchEvents();
    }, []);

    const handlePublish = async (id: string) => {
        if (!confirm('Publier cet événement ?')) return;
        try {
            await api.patch(`/events/${id}/publish`);
            fetchEvents();
        } catch (err) {
            alert('Erreur lors de la publication');
        }
    };

    const handleCancel = async (id: string) => {
        if (!confirm('Annuler cet événement ?')) return;
        try {
            await api.patch(`/events/${id}/cancel`);
            fetchEvents();
        } catch (err) {
            alert('Erreur lors de l\'annulation');
        }
    };

    const getStatusStyles = (statut: string) => {
        switch (statut) {
            case 'BROUILLON':
                return 'bg-gray-100 text-gray-500 border-gray-200';
            case 'PUBLIE':
                return 'bg-green-50 text-green-600 border-green-100';
            case 'ANNULE':
                return 'bg-red-50 text-red-500 border-red-100';
            default:
                return 'bg-gray-50 text-gray-400 border-gray-100';
        }
    };

    if (isLoading) return (
        <div className="flex justify-center items-center h-[60vh]">
            <div className="w-8 h-8 border-2 border-gray-100 border-t-black rounded-full animate-spin"></div>
        </div>
    );

    return (
        <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
                <div>
                    <h1 className="text-4xl font-black text-black tracking-tighter mb-2">Événements</h1>
                    <p className="text-gray-400 font-medium">Gérez votre catalogue d'expériences.</p>
                </div>
                <Link
                    href="/admin/events/create"
                    className="bg-black text-white px-8 py-4 rounded-2xl font-black hover:bg-gray-800 transition-all shadow-xl shadow-gray-200 flex items-center gap-3"
                >
                    <span className="text-xl">+</span>
                    Nvel Événement
                </Link>
            </div>

            {error ? (
                <div className="p-8 bg-red-50 text-red-500 rounded-3xl border border-red-100 font-bold">{error}</div>
            ) : (
                <div className="bg-white rounded-[2.5rem] border border-[#F0F0F3] overflow-hidden shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-[#F0F0F3]">
                            <thead>
                                <tr className="bg-gray-50/50">
                                    <th className="px-8 py-6 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Événement</th>
                                    <th className="px-8 py-6 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Détails</th>
                                    <th className="px-8 py-6 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Statut</th>
                                    <th className="px-8 py-6 text-right text-[10px] font-black text-gray-400 uppercase tracking-widest">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#F0F0F3]">
                                {events.map((event) => (
                                    <tr key={event.id} className="hover:bg-[#FBFBFE] transition-colors group">
                                        <td className="px-8 py-6 whitespace-nowrap">
                                            <div className="flex items-center gap-4">
                                                <div className="h-16 w-16 rounded-2xl overflow-hidden bg-gray-100 flex-shrink-0 border border-[#F0F0F3]">
                                                    {event.imageAffiche ? (
                                                        <img src={event.imageAffiche} alt={event.titre} className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                                    ) : (
                                                        <div className="h-full w-full flex items-center justify-center text-gray-300 font-black">?</div>
                                                    )}
                                                </div>
                                                <div>
                                                    <div className="text-sm font-black text-black">{event.titre}</div>
                                                    <div className="text-[10px] font-bold text-gray-400 uppercase mt-1 px-2 py-0.5 rounded bg-gray-50 inline-block">
                                                        {event.categorie?.nom}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 whitespace-nowrap">
                                            <div className="text-sm font-bold text-gray-700">📅 {new Date(event.dateHeureDebut).toLocaleDateString()}</div>
                                            <div className="text-xs text-gray-400 mt-1">📍 {event.lieu}</div>
                                        </td>
                                        <td className="px-8 py-6 whitespace-nowrap">
                                            <span className={`px-3 py-1.5 rounded-full text-[10px] font-black border ${getStatusStyles(event.statut)}`}>
                                                {event.statut}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6 whitespace-nowrap text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                {event.statut === 'BROUILLON' && (
                                                    <button
                                                        onClick={() => handlePublish(event.id)}
                                                        className="p-2.5 rounded-xl bg-green-50 text-green-600 hover:bg-green-600 hover:text-white transition-all"
                                                        title="Publier"
                                                    >
                                                        🚀
                                                    </button>
                                                )}
                                                {event.statut === 'PUBLIE' && (
                                                    <button
                                                        onClick={() => handleCancel(event.id)}
                                                        className="p-2.5 rounded-xl bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition-all"
                                                        title="Annuler"
                                                    >
                                                        🚫
                                                    </button>
                                                )}
                                                <Link
                                                    href={`/admin/events/${event.id}/edit`}
                                                    className="p-2.5 rounded-xl bg-gray-50 text-gray-400 hover:bg-black hover:text-white transition-all"
                                                    title="Modifier"
                                                >
                                                    ✏️
                                                </Link>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {events.length === 0 && (
                                    <tr>
                                        <td colSpan={4} className="px-8 py-20 text-center">
                                            <p className="text-gray-400 font-medium">Aucun événement pour le moment.</p>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}
