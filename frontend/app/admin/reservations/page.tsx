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

    const getStatusStyles = (status: string) => {
        switch (status) {
            case 'CONFIRME': return 'bg-green-50 text-green-600 border-green-100';
            case 'EN_ATTENTE': return 'bg-yellow-50 text-yellow-600 border-yellow-100';
            case 'REFUSE': return 'bg-red-50 text-red-500 border-red-100';
            case 'ANNULE': return 'bg-gray-50 text-gray-400 border-gray-100';
            default: return 'bg-blue-50 text-blue-600 border-blue-100';
        }
    };

    if (loading) return (
        <div className="flex justify-center items-center h-[60vh]">
            <div className="w-8 h-8 border-2 border-gray-100 border-t-black rounded-full animate-spin"></div>
        </div>
    );

    return (
        <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
                <div>
                    <h1 className="text-4xl font-black text-black tracking-tighter mb-2">Réservations</h1>
                    <p className="text-gray-400 font-medium tracking-tight">Gérez les accès et surveillez les inscriptions.</p>
                </div>
                <button
                    onClick={fetchReservations}
                    className="p-3 bg-white border border-[#F0F0F3] rounded-2xl hover:border-black transition-all group"
                    title="Actualiser"
                >
                    <span className="inline-block group-active:rotate-180 transition-transform duration-500">🔄</span>
                </button>
            </header>

            {/* Filtres Magnifiques */}
            <div className="flex flex-col md:flex-row gap-4 mb-8">
                <div className="flex-1 relative group">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 pointer-events-none group-focus-within:text-black transition-colors">🔍</span>
                    <input
                        type="text"
                        placeholder="Recherche (Participant, Événement, Ticket...)"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-white border border-[#F0F0F3] rounded-[1.2rem] py-4 pl-12 pr-6 text-sm focus:outline-none focus:border-black transition-all placeholder:text-gray-300 font-bold"
                    />
                </div>
                <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="bg-white border border-[#F0F0F3] rounded-[1.2rem] py-4 px-6 text-sm font-bold focus:outline-none focus:border-black transition-all min-w-[180px] appearance-none cursor-pointer"
                >
                    <option value="ALL">Tous les statuts</option>
                    <option value="EN_ATTENTE">En attente</option>
                    <option value="CONFIRME">Confirmé</option>
                    <option value="REFUSE">Refusé</option>
                    <option value="ANNULE">Annulé</option>
                </select>
            </div>

            <div className="bg-white rounded-[2.5rem] border border-[#F0F0F3] overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left divide-y divide-[#F0F0F3]">
                        <thead>
                            <tr className="bg-gray-50/50">
                                <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Participant</th>
                                <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Événement</th>
                                <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Statut</th>
                                <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#F0F0F3]">
                            {filteredReservations.map(res => (
                                <tr key={res.id} className="hover:bg-[#FBFBFE] transition-colors group">
                                    <td className="px-8 py-6 whitespace-nowrap">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 bg-gray-50 border border-gray-100 text-gray-400 rounded-full flex items-center justify-center font-black group-hover:border-black group-hover:text-black transition-all">
                                                {res.utilisateur.nom.charAt(0)}
                                            </div>
                                            <div>
                                                <div className="text-sm font-black text-black">{res.utilisateur.nom}</div>
                                                <div className="text-[10px] font-bold text-gray-300">{res.utilisateur.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 whitespace-nowrap">
                                        <div className="max-w-[180px] truncate text-sm font-bold text-gray-700" title={res.evenement.titre}>
                                            {res.evenement.titre}
                                        </div>
                                        <div className="text-[9px] font-black text-blue-400 uppercase tracking-tighter mt-1">Ref: {res.referenceTicket}</div>
                                    </td>
                                    <td className="px-8 py-6 whitespace-nowrap text-center">
                                        <span className={`px-3 py-1.5 rounded-full text-[10px] font-black border ${getStatusStyles(res.statut)}`}>
                                            {res.statut}
                                        </span>
                                    </td>
                                    <td className="px-8 py-6 whitespace-nowrap text-right">
                                        <div className="flex justify-end gap-2">
                                            {res.statut === 'EN_ATTENTE' && (
                                                <>
                                                    <button
                                                        onClick={() => handleUpdateStatus(res.id, 'CONFIRME')}
                                                        className="px-4 py-2 bg-black text-white rounded-xl text-[10px] font-black hover:bg-gray-800 transition-all uppercase tracking-widest"
                                                    >
                                                        Accepter
                                                    </button>
                                                    <button
                                                        onClick={() => handleUpdateStatus(res.id, 'REFUSE')}
                                                        className="px-4 py-2 bg-white border border-red-100 text-red-500 rounded-xl text-[10px] font-black hover:bg-red-50 transition-all uppercase tracking-widest"
                                                    >
                                                        Refuser
                                                    </button>
                                                </>
                                            )}
                                            {res.statut === 'CONFIRME' && (
                                                <button
                                                    onClick={() => handleUpdateStatus(res.id, 'ANNULE')}
                                                    className="px-4 py-2 text-[10px] font-black text-gray-300 hover:text-red-500 transition-all uppercase tracking-widest"
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
                                    <td colSpan={4} className="px-8 py-20 text-center">
                                        <p className="text-gray-300 font-black italic text-sm">Aucune donnée correspondante</p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
