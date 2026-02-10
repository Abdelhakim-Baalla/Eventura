'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import Link from 'next/link';

interface Stats {
    totalEvents: number;
    upcomingEvents: number;
    totalReservations: number;
    totalConfirmed: number;
    totalRevenue: number;
    occupancyRate: number;
}

export default function AdminDashboard() {
    const [stats, setStats] = useState<Stats | null>(null);
    const [loading, setLoading] = useState(true);

    const fetchStats = async () => {
        try {
            const res = await api.get('/events/admin/stats');
            setStats(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStats();
        // Auto-refresh toutes les 30 secondes (EV-134)
        const interval = setInterval(fetchStats, 30000);
        return () => clearInterval(interval);
    }, []);

    if (loading) return (
        <div className="flex h-full items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
    );

    return (
        <div className="p-8 text-black">
            <header className="mb-8 flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-black">Tableau de Bord</h1>
                    <p className="text-gray-500 text-lg">Monitoring de vos événements en temps réel</p>
                </div>
                <button
                    onClick={fetchStats}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Actualiser"
                >
                    🔄
                </button>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                {/* Ligne 1 - KPIs Principaux */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col">
                    <div className="flex justify-between items-start mb-4">
                        <span className="text-3xl">📅</span>
                        <span className="text-[10px] font-bold bg-blue-100 text-blue-700 px-2 py-1 rounded uppercase">Total</span>
                    </div>
                    <p className="text-gray-500 font-medium">Événements</p>
                    <p className="text-3xl font-black">{stats?.totalEvents || 0}</p>
                    <p className="text-xs text-blue-600 mt-2 font-bold">{stats?.upcomingEvents || 0} à venir</p>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col">
                    <div className="flex justify-between items-start mb-4">
                        <span className="text-3xl">🎟️</span>
                        <span className="text-[10px] font-bold bg-green-100 text-green-700 px-2 py-1 rounded uppercase">Tickets</span>
                    </div>
                    <p className="text-gray-500 font-medium">Réservations</p>
                    <p className="text-3xl font-black">{stats?.totalReservations || 0}</p>
                    <p className="text-xs text-green-600 mt-2 font-bold">{stats?.totalConfirmed || 0} confirmées</p>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col">
                    <div className="flex justify-between items-start mb-4">
                        <span className="text-3xl">💰</span>
                        <span className="text-[10px] font-bold bg-yellow-100 text-yellow-700 px-2 py-1 rounded uppercase">Revenus</span>
                    </div>
                    <p className="text-gray-500 font-medium">Chiffre d'Affaire</p>
                    <p className="text-3xl font-black text-blue-600">{(stats?.totalRevenue || 0).toLocaleString()} €</p>
                    <p className="text-xs text-gray-400 mt-2 font-bold italic text">Basé sur les places confirmées</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                {/* Taux de remplissage (EV-129) */}
                <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                    <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                        📈 Taux de Remplissage Global
                    </h2>
                    <div className="space-y-4">
                        <div className="flex justify-between items-end">
                            <p className="text-4xl font-black text-blue-600">{stats?.occupancyRate || 0}%</p>
                            <p className="text-sm text-gray-500">Moyenne sur tous les événements</p>
                        </div>
                        <div className="w-full bg-gray-100 h-4 rounded-full overflow-hidden">
                            <div
                                className="bg-blue-600 h-full transition-all duration-1000 ease-out"
                                style={{ width: `${stats?.occupancyRate || 0}%` }}
                            ></div>
                        </div>
                        <p className="text-xs text-gray-400 italic">
                            Le remplissage est calculé sur le ratio places confirmées / capacité maximum totale.
                        </p>
                    </div>
                </div>

                {/* Actions Rapides */}
                <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                    <h2 className="text-xl font-bold mb-6">🔗 Accès Rapides</h2>
                    <div className="grid grid-cols-2 gap-4">
                        <Link href="/admin/events/create" className="p-4 bg-gray-50 rounded-2xl hover:bg-black hover:text-white transition-all text-center">
                            <span className="block text-xl mb-1">➕</span>
                            <span className="font-bold text-sm">Nvel Event</span>
                        </Link>
                        <Link href="/admin/reservations" className="p-4 bg-gray-50 rounded-2xl hover:bg-black hover:text-white transition-all text-center">
                            <span className="block text-xl mb-1">🎫</span>
                            <span className="font-bold text-sm">Tickets</span>
                        </Link>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-gradient-to-br from-gray-900 to-gray-800 p-8 rounded-3xl shadow-xl text-white">
                    <header className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-bold">💡 Astuce Admin</h2>
                        <span className="bg-white/10 px-2 py-1 rounded text-[10px] font-bold">PRO TIP</span>
                    </header>
                    <p className="text-gray-400 mb-6">Pensez à confirmer les réservations en attente pour valider vos revenus et libérer de la place pour de nouveaux participants.</p>
                    <Link href="/admin/reservations" className="inline-block bg-white text-black px-6 py-2 rounded-xl font-bold hover:scale-105 transition-transform">
                        Voir les attentes
                    </Link>
                </div>

                <div className="bg-blue-600 p-8 rounded-3xl shadow-xl text-white flex flex-col justify-center">
                    <h2 className="text-2xl font-black mb-2 italic">EVENTURA DASHBOARD</h2>
                    <p className="opacity-80">Les données sont actualisées automatiquement toutes les 30 secondes pour vous garantir un suivi précis.</p>
                </div>
            </div>
        </div>
    );
}
