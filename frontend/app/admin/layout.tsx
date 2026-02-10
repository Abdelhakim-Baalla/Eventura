'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    const links = [
        { href: '/admin', label: 'Dashboard' },
        { href: '/admin/events', label: 'Événements' },
        { href: '/admin/categories', label: 'Catégories' },
    ];

    return (
        <div className="flex h-screen">
            <aside className="w-64 bg-gray-800 text-white flex-shrink-0">
                <div className="p-6">
                    <h1 className="text-xl font-bold mb-8">Admin Panel</h1>
                    <nav className="space-y-2">
                        {links.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`block px-4 py-2 rounded transition-colors ${pathname === link.href
                                        ? 'bg-blue-600'
                                        : 'hover:bg-gray-700 text-gray-300'
                                    }`}
                            >
                                {link.label}
                            </Link>
                        ))}
                        <a href="/" className="block px-4 py-2 mt-8 text-gray-400 hover:text-white">
                            ← Retour au site
                        </a>
                    </nav>
                </div>
            </aside>
            <main className="flex-1 bg-gray-100 overflow-auto">
                {children}
            </main>
        </div>
    );
}
