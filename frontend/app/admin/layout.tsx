'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { authService } from '@/lib/auth';
import { usePathname, useRouter } from 'next/navigation';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const router = useRouter();

    useEffect(() => {
        const user = authService.getUser();
        if (!user) {
            router.push('/login');
            return;
        }

        if (user.role !== 'ADMIN' && user.role !== 'SUPER_ADMIN') {
            router.push('/');
        }
    }, [router]);

    const links = [
        { href: '/admin', label: 'Aperçu', icon: '📊' },
        { href: '/admin/events', label: 'Événements', icon: '📅' },
        { href: '/admin/reservations', label: 'Réservations', icon: '🎫' },
        { href: '/admin/categories', label: 'Catégories', icon: '📁' },
    ];

    const isActive = (path: string) => pathname === path;

    return (
        <div className="flex h-screen bg-[#FBFBFE] font-sans selection:bg-black selection:text-white">
            {/* Sidebar Minimaliste */}
            <aside className="w-72 bg-white border-r border-[#F0F0F3] flex flex-col z-20">
                <div className="p-10">
                    <Link href="/" className="inline-flex items-center gap-2 group">
                        <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center text-white font-black text-xs transition-transform group-hover:scale-110">E</div>
                        <span className="text-lg font-black tracking-tighter text-black uppercase">Eventura</span>
                    </Link>
                </div>

                <nav className="flex-1 px-6 space-y-1">
                    <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest px-4 mb-4">Navigation</p>
                    {links.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={`flex items-center gap-4 px-4 py-3.5 rounded-2xl text-sm font-bold transition-all duration-300 ${isActive(link.href)
                                    ? 'bg-black text-white shadow-xl shadow-gray-200 translate-x-1'
                                    : 'text-gray-400 hover:text-black hover:bg-gray-50'
                                }`}
                        >
                            <span className={`text-lg transition-transform ${isActive(link.href) ? 'scale-110' : ''}`}>{link.icon}</span>
                            {link.label}
                        </Link>
                    ))}
                </nav>

                <div className="p-8 border-t border-[#F0F0F3]">
                    <Link href="/" className="flex items-center gap-3 px-4 py-3 text-sm font-bold text-gray-400 hover:text-red-500 transition-colors group">
                        <span className="transition-transform group-hover:-translate-x-1">←</span>
                        Quitter l'Admin
                    </Link>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 relative overflow-auto pb-20">
                {/* Header Subtil */}
                <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-[#F0F0F3] px-12 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="w-1 h-1 rounded-full bg-green-500 animate-pulse"></div>
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Système Opérationnel</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center font-bold text-gray-500 hover:border-black transition-colors cursor-pointer">
                            {authService.getUser()?.nom?.charAt(0) || 'A'}
                        </div>
                    </div>
                </header>

                {/* Content */}
                <div className="px-12 py-10 max-w-7xl mx-auto">
                    {children}
                </div>
            </main>
        </div>
    );
}
