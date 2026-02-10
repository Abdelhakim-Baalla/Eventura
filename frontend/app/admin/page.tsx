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
        const interval = setInterval(fetchStats, 30000);
        return () => clearInterval(interval);
    }, []);

    if (loading) return (
        <div className="flex h-[60vh] items-center justify-center">
            <div className="w-12 h-12 border-4 border-gray-100 border-t-black rounded-full animate-spin"></div>
        </div>
    );

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Hero Header */}
            <div className="mb-16">
                <h1 className="text-5xl font-black text-black tracking-tighter mb-4">Aperçu</h1>
                <p className="text-gray-400 font-medium max-w-lg leading-relaxed">
                    Visualisez les performances de vos événements et la croissance de votre communauté en temps réel.
                </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                <div className="bg-white p-10 rounded-[2.5rem] border border-[#F0F0F3] hover:shadow-2xl hover:shadow-gray-100 transition-all duration-500 group">
                    <div className="flex justify-between items-center mb-8">
                        <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center text-xl group-hover:scale-110 transition-transform">📅</div>
                        <span className="text-[10px] font-black tracking-widest text-gray-300 uppercase">Événements</span>
                    </div>
                    <p className="text-5xl font-black text-black mb-2 tracking-tighter">{stats?.totalEvents || 0}</p>
                    <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                        <p className="text-sm font-bold text-gray-400">{stats?.upcomingEvents || 0} Prochains</p>
                    </div>
                </div>

                <div className="bg-white p-10 rounded-[2.5rem] border border-[#F0F0F3] hover:shadow-2xl hover:shadow-gray-100 transition-all duration-500 group">
                    <div className="flex justify-between items-center mb-8">
                        <div className="w-12 h-12 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center text-xl group-hover:scale-110 transition-transform">🎫</div>
                        <span className="text-[10px] font-black tracking-widest text-gray-300 uppercase">Tickets</span>
                    </div>
                    <p className="text-5xl font-black text-black mb-2 tracking-tighter">{stats?.totalReservations || 0}</p>
                    <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                        <p className="text-sm font-bold text-gray-400">{stats?.totalConfirmed || 0} Confirmés</p>
                    </div>
                </div>

                <div className="bg-white p-10 rounded-[2.5rem] border border-[#F0F0F3] hover:shadow-2xl hover:shadow-gray-100 transition-all duration-500 group">
                    <div className="flex justify-between items-center mb-8">
                        <div className="w-12 h-12 bg-orange-50 text-orange-600 rounded-2xl flex items-center justify-center text-xl group-hover:scale-110 transition-transform">💰</div>
                        <span className="text-[10px] font-black tracking-widest text-gray-300 uppercase">Revenus</span>
                    </div>
                    <p className="text-5xl font-black text-black mb-2 tracking-tighter">{(stats?.totalRevenue || 0).toLocaleString()}€</p>
                    <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-orange-500"></div>
                        <p className="text-sm font-bold text-gray-400">Total Brut</p>
                    </div>
                </div>
            </div>

            {/* Monitoring Section */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                <div className="lg:col-span-3 bg-white p-12 rounded-[3rem] border border-[#F0F0F3] relative overflow-hidden">
                    <h2 className="text-2xl font-black mb-10 tracking-tight">Occupation Moyenne</h2>
                    <div className="relative pt-8">
                        <div className="flex justify-between items-end mb-4">
                            <span className="text-6xl font-black tracking-tighter text-black">{stats?.occupancyRate || 0}%</span>
                            <span className="text-sm font-bold text-gray-400 mb-2">Taux de remplissage</span>
                        </div>
                        <div className="h-4 w-full bg-gray-50 rounded-full overflow-hidden border border-gray-100">
                            <div
                                className="h-full bg-black rounded-full transition-all duration-1000 ease-out"
                                style={{ width: `${stats?.occupancyRate || 0}%` }}
                            ></div>
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-2 space-y-8">
                    <div className="bg-black p-10 rounded-[3rem] text-white flex flex-col justify-between h-full hover:scale-[1.02] transition-transform duration-500">
                        <div>
                            <h3 className="text-2xl font-black mb-4 italic tracking-widest uppercase">Go Pro</h3>
                            <p className="text-gray-400 text-sm leading-relaxed mb-8">
                                Prêt à passer au niveau supérieur ? Créez un nouvel événement dès maintenant.
                            </p>
                        </div>
                        <Link href="/admin/events/create" className="w-full py-4 bg-white text-black rounded-2xl font-black text-center hover:bg-gray-200 transition-colors">
                            Nvel Événement
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
