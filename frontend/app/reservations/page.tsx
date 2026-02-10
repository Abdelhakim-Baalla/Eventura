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
    };
}

export default function MyReservationsPage() {
    const [reservations, setReservations] = useState<Reservation[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('ALL');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        fetchReservations();
    }, [page, filter]);

    const fetchReservations = async () => {
        setLoading(true);
        try {
            const params: any = { page };
            if (filter !== 'ALL') params.statut = filter;

            const res = await api.get('/reservations/my', { params });
            // Structure paginée de l'API: { items, total, page, lastPage }
            setReservations(res.data.items || []);
            setTotalPages(res.data.lastPage || 1);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = async (id: string) => {
        if (!confirm('Voulez-vous annuler ?')) return;
        try {
            await api.patch(`/reservations/${id}/cancel`);
            fetchReservations();
        } catch (err: any) {
            alert('Erreur lors de l\'annulation');
        }
    };

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="min-h-screen bg-gray-100 p-4 md:p-8">
            <div className="max-w-3xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-2xl font-bold">Mes Réservations</h1>
                    <Link href="/" className="text-blue-600 hover:underline">Retour site</Link>
                </div>

                <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
                    {['ALL', 'EN_ATTENTE', 'CONFIRME', 'ANNULE'].map(s => (
                        <button
                            key={s}
                            onClick={() => { setFilter(s); setPage(1); }}
                            className={`px-4 py-2 rounded shadow-sm text-sm font-medium transition-colors ${filter === s ? 'bg-blue-600 text-white' : 'bg-white text-gray-600'
                                }`}
                        >
                            {s}
                        </button>
                    ))}
                </div>

                {loading ? (
                    <div className="text-center py-10">Chargement...</div>
                ) : reservations.length === 0 ? (
                    <div className="bg-white p-10 rounded-lg text-center shadow-sm">
                        <p className="text-gray-500 mb-4">Aucune réservation trouvée.</p>
                        <Link href="/" className="text-blue-600 font-bold">Explorer les événements</Link>
                    </div>
                ) : (
                    <>
                        <div className="space-y-4 mb-8">
                            {reservations.map(res => (
                                <div key={res.id} className="bg-white p-6 rounded-lg shadow-sm border flex flex-col sm:flex-row justify-between gap-4">
                                    <div className="space-y-1">
                                        <h3 className="text-lg font-bold text-gray-900">{res.evenement.titre}</h3>
                                        <p className="text-gray-600 text-sm">📅 {new Date(res.evenement.dateHeureDebut).toLocaleDateString()}</p>
                                        <p className="text-gray-600 text-sm">📍 {res.evenement.lieu}</p>
                                        <p className="mt-3 inline-block bg-blue-50 text-blue-700 px-3 py-1 rounded-md text-sm font-mono font-bold">
                                            Ticket: {res.referenceTicket}
                                        </p>
                                    </div>
                                    <div className="flex flex-col items-end gap-3 min-w-[120px]">
                                        <span className={`text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider ${res.statut === 'CONFIRME' ? 'bg-green-100 text-green-700' :
                                                res.statut === 'ANNULE' ? 'bg-gray-100 text-gray-700' :
                                                    'bg-yellow-100 text-yellow-700'
                                            }`}>
                                            {res.statut}
                                        </span>
                                        <div className="mt-auto flex gap-3">
                                            {res.statut === 'CONFIRME' && (
                                                <button
                                                    onClick={handlePrint}
                                                    className="text-xs font-bold text-blue-600 hover:text-blue-800 underline"
                                                >
                                                    Imprimer PDF
                                                </button>
                                            )}
                                            {res.statut === 'EN_ATTENTE' && (
                                                <button
                                                    onClick={() => handleCancel(res.id)}
                                                    className="text-xs font-bold text-red-600 hover:text-red-800 underline"
                                                >
                                                    Annuler
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Pagination Simple */}
                        {totalPages > 1 && (
                            <div className="flex justify-center gap-2 mt-8">
                                <button
                                    disabled={page === 1}
                                    onClick={() => setPage(p => p - 1)}
                                    className="px-4 py-2 bg-white rounded border disabled:opacity-50 text-sm font-bold"
                                >
                                    Précédent
                                </button>
                                <div className="flex items-center px-4 font-bold text-sm">
                                    Page {page} sur {totalPages}
                                </div>
                                <button
                                    disabled={page === totalPages}
                                    onClick={() => setPage(p => p + 1)}
                                    className="px-4 py-2 bg-white rounded border disabled:opacity-50 text-sm font-bold"
                                >
                                    Suivant
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>

            <style jsx global>{`
                @media print {
                    nav, button, .flex.gap-2.mb-6, .text-blue-600, .mt-8 {
                        display: none !important;
                    }
                }
            `}</style>
        </div>
    );
}
