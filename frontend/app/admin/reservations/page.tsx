'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';

interface Reservation {
    id: string;
    referenceTicket: string;
    statut: string;
    dateReservation: string;
    evenement: {
        id: string;
        titre: string;
    };
    utilisateur: {
        nom: string;
        email: string;
    };
}

export default function AdminReservationsPage() {
    const [reservations, setReservations] = useState<Reservation[]>([]);
    const [loading, setLoading] = useState(true);
    const [filterStatus, setFilterStatus] = useState('ALL');
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchReservations();
    }, []);

    const fetchReservations = async () => {
        setLoading(true);
        try {
            const res = await api.get('/reservations/admin');
            setReservations(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateStatus = async (id: string, newStatus: string) => {
        try {
            await api.patch(`/reservations/${id}/status`, { statut: newStatus });
            setReservations(prev => prev.map(r => r.id === id ? { ...r, statut: newStatus } : r));
        } catch (err: any) {
            alert(err.response?.data?.message || 'Erreur lors de la mise à jour');
        }
    };

    const filteredReservations = reservations.filter(res => {
        const matchesStatus = filterStatus === 'ALL' || res.statut === filterStatus;
        const matchesSearch = res.utilisateur.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
            res.evenement.titre.toLowerCase().includes(searchTerm.toLowerCase()) ||
            res.referenceTicket.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesStatus && matchesSearch;
    });

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'CONFIRME': return 'bg-green-100 text-green-800';
            case 'EN_ATTENTE': return 'bg-yellow-100 text-yellow-800';
            case 'REFUSE': return 'bg-red-100 text-red-800';
            case 'ANNULE': return 'bg-gray-100 text-gray-800';
            default: return 'bg-blue-100 text-blue-800';
        }
    };

    return (
        <div className="p-8 text-black">
            <header className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl font-bold">Gestion des Réservations</h1>
                    <p className="text-gray-500">Validez ou gérez les inscriptions à vos événements</p>
                </div>
                <button onClick={fetchReservations} className="p-2 text-blue-600 hover:bg-blue-50 rounded">
                    🔄 Actualiser
                </button>
            </header>

            {/* Filtres */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="flex-1">
                    <input
                        type="text"
                        placeholder="Rechercher (Participant, Événement, Ticket...)"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full border rounded-lg p-2"
                    />
                </div>
                <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="border rounded-lg p-2"
                >
                    <option value="ALL">Tous les statuts</option>
                    <option value="EN_ATTENTE">En attente</option>
                    <option value="CONFIRME">Confirmé</option>
                    <option value="REFUSE">Refusé</option>
                    <option value="ANNULE">Annulé</option>
                </select>
            </div>

            {loading ? (
                <div className="flex justify-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
            ) : (
                <div className="bg-white border rounded-xl overflow-hidden shadow-sm">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 border-b">
                            <tr>
                                <th className="px-6 py-4 font-bold text-sm">Participant</th>
                                <th className="px-6 py-4 font-bold text-sm">Événement</th>
                                <th className="px-6 py-4 font-bold text-sm">Date Rés.</th>
                                <th className="px-6 py-4 font-bold text-sm">Statut</th>
                                <th className="px-6 py-4 font-bold text-sm text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {filteredReservations.map(res => (
                                <tr key={res.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4">
                                        <div className="font-bold">{res.utilisateur.nom}</div>
                                        <div className="text-xs text-gray-400">{res.utilisateur.email}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="max-w-[200px] truncate" title={res.evenement.titre}>
                                            {res.evenement.titre}
                                        </div>
                                        <div className="text-[10px] font-mono text-blue-500 uppercase">{res.referenceTicket}</div>
                                    </td>
                                    <td className="px-6 py-4 text-sm">
                                        {new Date(res.dateReservation).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${getStatusColor(res.statut)}`}>
                                            {res.statut}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex justify-end gap-2">
                                            {res.statut === 'EN_ATTENTE' && (
                                                <>
                                                    <button
                                                        onClick={() => handleUpdateStatus(res.id, 'CONFIRME')}
                                                        className="text-xs bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                                                    >
                                                        Confirmer
                                                    </button>
                                                    <button
                                                        onClick={() => handleUpdateStatus(res.id, 'REFUSE')}
                                                        className="text-xs bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                                                    >
                                                        Refuser
                                                    </button>
                                                </>
                                            )}
                                            {res.statut === 'CONFIRME' && (
                                                <button
                                                    onClick={() => handleUpdateStatus(res.id, 'ANNULE')}
                                                    className="text-xs text-gray-500 hover:text-red-600 font-medium"
                                                >
                                                    Annuler
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {filteredReservations.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-gray-500 italic">
                                        Aucune réservation trouvée
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
