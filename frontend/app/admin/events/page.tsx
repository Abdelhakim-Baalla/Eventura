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
        if (!confirm('Voulez-vous vraiment publier cet événement ?')) return;
        try {
            await api.patch(`/events/${id}/publish`);
            fetchEvents(); // Rafraîchir la liste
        } catch (err) {
            alert('Erreur lors de la publication');
        }
    };

    const handleCancel = async (id: string) => {
        if (!confirm('Voulez-vous vraiment annuler cet événement ?')) return;
        try {
            await api.patch(`/events/${id}/cancel`);
            fetchEvents(); // Rafraîchir la liste
        } catch (err) {
            alert('Erreur lors de l\'annulation');
        }
    };

    const getStatusBadge = (statut: string) => {
        switch (statut) {
            case 'BROUILLON':
                return <span className="px-2 py-1 rounded bg-gray-200 text-gray-800 text-xs font-bold">BROUILLON</span>;
            case 'PUBLIE':
                return <span className="px-2 py-1 rounded bg-green-200 text-green-800 text-xs font-bold">PUBLIÉ</span>;
            case 'ANNULE':
                return <span className="px-2 py-1 rounded bg-red-200 text-red-800 text-xs font-bold">ANNULÉ</span>;
            default:
                return <span>{statut}</span>;
        }
    };

    if (isLoading) return <div className="p-8">Chargement...</div>;
    if (error) return <div className="p-8 text-red-600">{error}</div>;

    return (
        <div className="p-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Gestion des événements</h1>
                <Link
                    href="/admin/events/create"
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                    + Créer un événement
                </Link>
            </div>

            <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Affiche</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Titre</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Lieu</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {events.map((event) => (
                            <tr key={event.id}>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    {event.imageAffiche ? (
                                        <img src={event.imageAffiche} alt={event.titre} className="h-10 w-10 object-cover rounded" />
                                    ) : (
                                        <div className="h-10 w-10 bg-gray-200 rounded flex items-center justify-center text-gray-400">?</div>
                                    )}
                                </td>
                                <td className="px-6 py-4">
                                    <div className="text-sm font-medium text-gray-900">{event.titre}</div>
                                    <div className="text-sm text-gray-500">{event.categorie?.nom}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {new Date(event.dateHeureDebut).toLocaleDateString()}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {event.lieu}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    {getStatusBadge(event.statut)}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                                    {event.statut === 'BROUILLON' && (
                                        <button
                                            onClick={() => handlePublish(event.id)}
                                            className="text-green-600 hover:text-green-900"
                                        >
                                            Publier
                                        </button>
                                    )}
                                    {event.statut === 'PUBLIE' && (
                                        <button
                                            onClick={() => handleCancel(event.id)}
                                            className="text-red-600 hover:text-red-900"
                                        >
                                            Annuler
                                        </button>
                                    )}
                                    <Link
                                        href={`/admin/events/${event.id}/edit`}
                                        className="text-blue-600 hover:text-blue-900"
                                    >
                                        Modifier
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
