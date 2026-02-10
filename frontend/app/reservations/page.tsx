'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import Link from 'next/link';

interface Reservation {
    id: string;
    referenceTicket: string;
    statut: string;
    dateReservation: string;
    utilisateur: {
        nom: string;
        email: string;
    };
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
                <div className="flex justify-between items-center mb-8 noprint">
                    <h1 className="text-2xl font-bold">Mes Réservations</h1>
                    <Link href="/" className="text-blue-600 hover:underline">Retour site</Link>
                </div>

                <div className="flex gap-2 mb-6 overflow-x-auto pb-2 noprint">
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
                    <div className="text-center py-10 noprint">Chargement...</div>
                ) : reservations.length === 0 ? (
                    <div className="bg-white p-10 rounded-lg text-center shadow-sm noprint">
                        <p className="text-gray-500 mb-4">Aucune réservation trouvée.</p>
                        <Link href="/" className="text-blue-600 font-bold">Explorer les événements</Link>
                    </div>
                ) : (
                    <>
                        <div className="space-y-6 mb-8">
                            {reservations.map(res => (
                                <div key={res.id} className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 flex flex-col sm:flex-row justify-between gap-6 relative overflow-hidden page-break">
                                    {/* Design décoratif pour le ticket imprimé */}
                                    <div className="absolute right-0 top-0 bottom-0 w-2 bg-blue-600 print-only"></div>

                                    <div className="space-y-4 flex-1">
                                        <div className="print-only mb-4">
                                            <p className="text-blue-600 font-black text-xl italic mb-1">EVENTURA</p>
                                            <p className="text-[10px] text-gray-400 uppercase tracking-widest">Billet Officiel de Réservation</p>
                                        </div>

                                        <h3 className="text-2xl font-black text-gray-900 leading-tight">{res.evenement.titre}</h3>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <p className="text-[10px] uppercase font-bold text-gray-400">Date et Heure</p>
                                                <p className="font-bold text-gray-700">{new Date(res.evenement.dateHeureDebut).toLocaleString()}</p>
                                            </div>
                                            <div>
                                                <p className="text-[10px] uppercase font-bold text-gray-400">Lieu</p>
                                                <p className="font-bold text-gray-700">{res.evenement.lieu}</p>
                                            </div>
                                            <div>
                                                <p className="text-[10px] uppercase font-bold text-gray-400">Détenteur du billet</p>
                                                <p className="font-bold text-gray-700">{res.utilisateur?.nom || 'Client Eventura'}</p>
                                            </div>
                                            <div>
                                                <p className="text-[10px] uppercase font-bold text-gray-400">Email</p>
                                                <p className="font-bold text-gray-700">{res.utilisateur?.email || '-'}</p>
                                            </div>
                                        </div>

                                        <div className="mt-6 flex flex-wrap items-center gap-4">
                                            <div className="bg-blue-50 border border-blue-100 px-4 py-2 rounded-lg">
                                                <p className="text-[9px] text-blue-400 uppercase font-black tracking-widest mb-0.5">Référence Unique</p>
                                                <p className="font-mono font-black text-blue-700 text-lg">{res.referenceTicket}</p>
                                            </div>
                                            <div className="print-only opacity-20 text-center border-2 border-dashed border-gray-400 p-2 rounded">
                                                <span className="text-[8px] font-bold block">SCAN QR</span>
                                                <div className="w-12 h-12 bg-gray-400"></div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex flex-col items-end justify-between min-w-[140px]">
                                        <span className={`text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-wider shadow-sm ${res.statut === 'CONFIRME' ? 'bg-green-500 text-white' :
                                                res.statut === 'ANNULE' ? 'bg-gray-500 text-white' :
                                                    'bg-yellow-500 text-white'
                                            }`}>
                                            {res.statut}
                                        </span>

                                        <div className="mt-6 flex gap-3 noprint">
                                            {res.statut === 'CONFIRME' && (
                                                <button
                                                    onClick={handlePrint}
                                                    className="bg-blue-600 text-white px-4 py-2 rounded-lg text-xs font-bold hover:bg-black transition-all"
                                                >
                                                    Imprimer Ticket
                                                </button>
                                            )}
                                            {res.statut === 'EN_ATTENTE' && (
                                                <button
                                                    onClick={() => handleCancel(res.id)}
                                                    className="text-xs font-bold text-red-600 hover:bg-red-50 px-3 py-2 rounded-lg transition-colors"
                                                >
                                                    Annuler
                                                </button>
                                            )}
                                        </div>

                                        <div className="print-only text-[8px] text-gray-300 font-bold uppercase mt-auto">
                                            Généré le {new Date().toLocaleDateString()} par Eventura
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {totalPages > 1 && (
                            <div className="flex justify-center gap-2 mt-8 noprint">
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
                .print-only { display: none; }
                @media print {
                    .noprint { display: none !important; }
                    .print-only { display: block !important; }
                    body { background: white !important; }
                    .page-break { page-break-after: always; margin-bottom: 0 !important; border: 2px solid #000 !important; }
                    .bg-white { border-radius: 0 !important; box-shadow: none !important; }
                    .bg-blue-600 { background-color: #2563eb !important; -webkit-print-color-adjust: exact; }
                }
            `}</style>
        </div>
    );
}
