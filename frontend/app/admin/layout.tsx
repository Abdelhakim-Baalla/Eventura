'use client';

import { useLayoutEffect, useState, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { authService, User } from '@/lib/auth';
import { usePathname, useRouter } from 'next/navigation';

const Icons = {
    Dashboard: () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect width="7" height="9" x="3" y="3" rx="1" /><rect width="7" height="5" x="14" y="3" rx="1" /><rect width="7" height="9" x="14" y="12" rx="1" /><rect width="7" height="5" x="3" y="16" rx="1" /></svg>,
    Events: () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M8 2v4" /><path d="M16 2v4" /><rect width="18" height="18" x="3" y="4" rx="2" /><path d="M3 10h18" /></svg>,
    Reservations: () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M2 9a3 3 0 0 1 3-3h14a3 3 0 0 1 3 3v10a3 3 0 0 1-3 3H5a3 3 0 0 1-3-3V9Z" /><path d="M9 6V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v1" /><path d="M10 11h4" /></svg>,
    Categories: () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m21 16-4 4-4-4" /><path d="M17 20V4" /><path d="m3 8 4-4 4 4" /><path d="M7 4v16" /></svg>,
    Logout: () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" x2="9" y1="12" y2="12" /></svg>
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const router = useRouter();
    const [user] = useState<User | null>(() => authService.getUser());
    const [mounted, setMounted] = useState(false);
    const initializedRef = useRef(false);

    useLayoutEffect(() => {
        if (initializedRef.current) return;
        initializedRef.current = true;

        // Utiliser queueMicrotask pour éviter l'appel setState synchrone
        queueMicrotask(() => {
            setMounted(true);
        });

        if (!user || (user.role !== 'ADMIN' && user.role !== 'SUPER_ADMIN')) {
            router.push('/login');
        }
    }, [router, user]);

    const menuItems = [
        { name: 'Dashboard', path: '/admin', icon: Icons.Dashboard },
        { name: 'Événements', path: '/admin/events', icon: Icons.Events },
        { name: 'Inscriptions', path: '/admin/reservations', icon: Icons.Reservations },
        { name: 'Thématiques', path: '/admin/categories', icon: Icons.Categories },
    ];

    const handleLogout = () => {
        authService.logout();
        router.push('/login');
    };

    return (
        <div className="flex h-screen bg-admin-bg font-sans text-admin-text-main overflow-hidden selection:bg-admin-accent selection:text-admin-bg">
            {/* Sidebar Solid */}
            <aside className="w-64 bg-admin-card border-r border-admin-border flex flex-col z-20 relative">
                <div className="absolute inset-0 bg-gradient-to-b from-white/[0.01] to-transparent pointer-events-none"></div>

                <div className="h-20 px-8 border-b border-admin-border flex items-center gap-3 relative z-10">
                    <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                        <Image src="/admin-logo.png" alt="Eventura" width={36} height={36} className="rounded-xl border border-admin-border shadow-lg" />
                        <span className="text-sm font-black tracking-tight leading-none uppercase italic">EVENTURA_CONSOLE</span>
                    </Link>
                </div>

                <nav className="flex-1 px-4 py-8 space-y-1 relative z-10">
                    <p className="px-4 text-[9px] font-black text-admin-text-dim uppercase tracking-[0.4em] mb-4">Architecture</p>
                    {menuItems.map((item) => {
                        const isActive = pathname === item.path;
                        return (
                            <Link
                                key={item.path}
                                href={item.path}
                                className={`flex items-center gap-4 px-4 py-3 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all ${isActive
                                        ? 'bg-admin-accent text-admin-bg shadow-xl shadow-admin-accent/20 translate-x-1'
                                        : 'text-admin-text-dim hover:text-admin-text-main hover:bg-admin-inner'
                                    }`}
                            >
                                <item.icon />
                                {item.name}
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-admin-border relative z-10">
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-4 px-4 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest text-status-error/70 hover:text-status-error hover:bg-status-error/5 transition-all"
                    >
                        <Icons.Logout />
                        Rupture Session
                    </button>
                </div>
            </aside>

            {/* Main Section Solid */}
            <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative bg-admin-bg">
                {/* Header Solid */}
                <header className="h-20 border-b border-admin-border px-8 lg:px-12 flex items-center justify-between bg-admin-bg/80 backdrop-blur-3xl z-10 shrink-0">
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 px-3 py-1 bg-admin-inner border border-admin-border rounded-lg">
                            <span className="text-[9px] font-black text-admin-accent uppercase tracking-widest">{menuItems.find(i => i.path === pathname)?.name || 'Console'}</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-6">
                        <Link href="/" className="text-[10px] font-black text-admin-text-dim hover:text-admin-accent transition-colors uppercase tracking-widest border-r border-admin-border pr-6">Accès Public</Link>
                        <div className="flex items-center gap-4">
                            <div className="text-right hidden sm:block">
                                <p className="text-xs font-black text-admin-text-main leading-none mb-1 uppercase italic tracking-tighter">{mounted ? (user?.nom || 'Admin') : 'Admin'}</p>

                            </div>
                            <div className="w-10 h-10 rounded-xl bg-admin-inner border border-admin-border flex items-center justify-center font-black text-admin-accent shadow-inner group">
                                <span className="text-sm group-hover:scale-110 transition-transform">{mounted ? (user?.nom?.charAt(0) || 'A') : 'A'}</span>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Content Area */}
                <div className="flex-1 overflow-y-auto p-8 lg:p-12 animate-fade-in custom-scrollbar">
                    <div className="max-w-7xl mx-auto space-y-12">
                        {children}
                    </div>
                </div>
            </main>
        </div>
    );
}
