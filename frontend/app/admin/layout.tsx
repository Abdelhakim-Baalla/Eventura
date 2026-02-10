'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { authService } from '@/lib/auth';
import { usePathname, useRouter } from 'next/navigation';

const Icons = {
    Dashboard: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="7" height="9" x="3" y="3" rx="1" /><rect width="7" height="5" x="14" y="3" rx="1" /><rect width="7" height="9" x="14" y="12" rx="1" /><rect width="7" height="5" x="3" y="16" rx="1" /></svg>,
    Events: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8 2v4" /><path d="M16 2v4" /><rect width="18" height="18" x="3" y="4" rx="2" /><path d="M3 10h18" /></svg>,
    Reservations: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /></svg>,
    Categories: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m20 7-8-3-8 3m16 0-8 3m8-3v9l-8 3" /></svg>,
    Logout: () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" x2="9" y1="12" y2="12" /></svg>
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const router = useRouter();

    useEffect(() => {
        const user = authService.getUser();
        if (!user) { router.push('/login'); return; }
        if (user.role !== 'ADMIN' && user.role !== 'SUPER_ADMIN') { router.push('/'); }
    }, [router]);

    const links = [
        { href: '/admin', label: 'Dashboard', icon: Icons.Dashboard },
        { href: '/admin/events', label: 'Catalogue', icon: Icons.Events },
        { href: '/admin/reservations', label: 'Inscriptions', icon: Icons.Reservations },
        { href: '/admin/categories', label: 'Thématiques', icon: Icons.Categories },
    ];

    const isActive = (path: string) => pathname === path;

    return (
        <div className="flex h-screen bg-admin-bg font-sans text-admin-text-main overflow-hidden">
            <aside className="w-72 bg-admin-card border-r border-admin-border flex flex-col z-20">
                <div className="h-24 px-10 border-b border-admin-border flex items-center gap-4">
                    {/* <div className="w-10 h-10 bg-admin-accent rounded-xl flex items-center justify-center font-black text-admin-bg shadow-xl shadow-admin-accent/20">E</div> */}
                    <img src="/admin-logo.png" alt="Eventura" className="w-15 h-15 rounded-full" />
                    <div>
                        <span className="text-xl font-black tracking-tighter block leading-none">EVENTURA</span>
                        {/* <span className="text-[9px] font-bold text-admin-text-dim uppercase tracking-[0.2em] mt-1 block">Console</span> */}
                    </div>
                </div>

                <nav className="flex-1 px-4 pt-10 space-y-2">
                    {links.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={`flex items-center gap-4 px-5 py-4 rounded-2xl text-[13px] font-black uppercase tracking-widest transition-all ${isActive(link.href)
                                    ? 'bg-admin-accent text-admin-bg shadow-lg shadow-admin-accent/20'
                                    : 'text-admin-text-muted hover:bg-admin-inner hover:text-admin-text-main'
                                }`}
                        >
                            <link.icon />
                            <span>{link.label}</span>
                        </Link>
                    ))}
                </nav>

                <div className="p-8 border-t border-admin-border">
                    <button
                        onClick={() => { authService.logout(); router.push('/login'); }}
                        className="w-full flex items-center gap-4 px-6 py-4 rounded-xl text-xs font-black uppercase tracking-widest text-admin-text-dim hover:text-status-error hover:bg-status-error/5 transition-all"
                    >
                        <Icons.Logout />
                        <span>Sortie</span>
                    </button>
                </div>
            </aside>

            <main className="flex-1 flex flex-col min-w-0">
                <header className="h-24 border-b border-admin-border bg-admin-card/50 backdrop-blur-md flex items-center justify-between px-12 z-10 sticky top-0">
                    <div className="text-[10px] font-black text-admin-text-dim uppercase tracking-[0.5em]">
                        {pathname.split('/').slice(1).join(' / ')}
                    </div>

                    <div className="flex items-center gap-6">
                        <div className="text-right">
                            <p className="text-sm font-black text-admin-text-main leading-none mb-1">{authService.getUser()?.nom || 'Admin'}</p>
                            {/* <p className="text-[9px] font-bold text-admin-accent uppercase tracking-widest">Master Auth</p> */}
                        </div>
                        <div className="w-10 h-10 rounded-xl bg-admin-inner border border-admin-border flex items-center justify-center font-black text-admin-accent shadow-inner">
                            {authService.getUser()?.nom?.charAt(0) || 'A'}
                        </div>
                    </div>
                </header>

                <div className="flex-1 overflow-auto p-12 lg:p-16 custom-scrollbar animate-fade-in">
                    <div className="max-w-[1400px] mx-auto">
                        {children}
                    </div>
                </div>
            </main>
        </div>
    );
}
