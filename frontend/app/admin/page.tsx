'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import Link from 'next/link';

interface Stats {
    totalEvents: number;
    totalReservations: number;
    totalConfirmed: number;
    totalRevenue: number;
}

export default function AdminDashboard() {
    const [stats, setStats] = useState<Stats | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get('/events/admin/stats')
            .then(res => setStats(res.data))
            .catch(err => console.error(err))
            .finally(() => setLoading(false));
    }, []);

    if (loading) return (
        <div className="flex h-full items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
    );

    return (
        <div className="p-8 text-black">
            <header className="mb-8">
                <h1 className="text-3xl font-black">Tableau de Bord</h1>
                <p className="text-gray-500 text-lg">Bienvenue dans votre espace de gestion Eventura</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between">
                    <span className="text-4xl mb-4">📅</span>
                    <div>
                        <p className="text-gray-500 font-medium">Événements créés</p>
                        <p className="text-3xl font-black">{stats?.totalEvents || 0}</p>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between">
                    <span className="text-4xl mb-4">🎟️</span>
                    <div>
                        <p className="text-gray-500 font-medium">Total Réservations</p>
                        <p className="text-3xl font-black">{stats?.totalReservations || 0}</p>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between">
                    <span className="text-4xl mb-4">✅</span>
                    <div>
                        <p className="text-gray-500 font-medium">Places Confirmées</p>
                        <p className="text-3xl font-black text-green-600">{stats?.totalConfirmed || 0}</p>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between">
                    <span className="text-4xl mb-4">💰</span>
                    <div>
                        <p className="text-gray-500 font-medium">Revenu Estimé</p>
                        <p className="text-3xl font-black text-blue-600">{(stats?.totalRevenue || 0).toLocaleString()} €</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100">
                    <h2 className="text-xl font-bold mb-6">Actions Rapides</h2>
                    <div className="grid grid-cols-2 gap-4">
                        <Link href="/admin/events/create" className="p-4 bg-blue-50 text-blue-700 rounded-xl hover:bg-blue-100 transition-colors text-center font-bold">
                            ➕ Créer un Événement
                        </Link>
                        <Link href="/admin/reservations" className="p-4 bg-green-50 text-green-700 rounded-xl hover:bg-green-100 transition-colors text-center font-bold">
                            🎫 Gérer les Tickets
                        </Link>
                        <Link href="/admin/categories" className="p-4 bg-purple-50 text-purple-700 rounded-xl hover:bg-purple-100 transition-colors text-center font-bold">
                            📁 Catégories
                        </Link>
                        <Link href="/" className="p-4 bg-gray-50 text-gray-700 rounded-xl hover:bg-gray-100 transition-colors text-center font-bold">
                            🌐 Voir le Site
                        </Link>
                    </div>
                </div>

                <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-8 rounded-3xl shadow-xl text-white flex flex-col justify-center items-center text-center">
                    <span className="text-5xl mb-4">🚀</span>
                    <h2 className="text-2xl font-bold mb-2">Prêt pour votre prochain succès ?</h2>
                    <p className="text-blue-100 opacity-80 mb-6">Continuez à créer des expériences mémorables pour vos participants.</p>
                </div>
            </div>
        </div>
    );
}
