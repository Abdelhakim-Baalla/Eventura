'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { authService } from '@/lib/auth';

interface Event { id: string; titre: string; description: string; dateHeureDebut: string; lieu: string; prix: number; categorie: { nom: string }; imageAffiche?: string; }

export default function Home() {
  const [events, setEvents] = useState<Event[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const pathname = usePathname();

  useEffect(() => {
    setUser(authService.getUser());
    api.get('/events').then(res => setEvents(res.data)).catch(err => console.error(err)).finally(() => setLoading(false));
  }, []);

  const handleLogout = () => { authService.logout(); setUser(null); window.location.reload(); };

  const filteredEvents = events.filter(e =>
    e.titre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.lieu.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.categorie?.nom.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const NavLink = ({ href, children }: { href: string; children: React.ReactNode }) => {
    const isActive = pathname === href;
    return (
      <Link href={href} className={`text-[11px] font-black uppercase tracking-widest transition-all ${isActive ? 'text-site-accent border-b-2 border-site-accent pb-1' : 'text-site-text-muted hover:text-white'}`}>
        {children}
      </Link>
    );
  };

  return (
    <div className="min-h-screen bg-site-bg text-site-text-main font-sans selection:bg-site-accent selection:text-white">
      {/* Refined Navbar */}
      <nav className="h-20 bg-site-bg/95 backdrop-blur-xl border-b border-site-border sticky top-0 z-50 px-6 lg:px-12">
        <div className="max-w-7xl mx-auto h-full flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-site-accent rounded-xl flex items-center justify-center text-white font-black text-xl shadow-[0_0_20px_rgba(59,130,246,0.2)]">E</div>
            <span className="text-xl font-black tracking-tight uppercase">Eventura</span>
          </Link>

          <div className="hidden md:flex items-center gap-10">
            <NavLink href="/">Accueil</NavLink>
            <NavLink href="/explore">Explorer</NavLink>
            {user && <NavLink href="/reservations">Mes Tickets</NavLink>}
          </div>

          <div className="flex items-center gap-6">
            {user ? (
              <div className="flex items-center gap-6">
                {(user.role === 'ADMIN' || user.role === 'SUPER_ADMIN') && (
                  <Link href="/admin" className="text-[10px] font-black uppercase tracking-widest text-admin-accent border border-admin-accent/30 px-4 py-1.5 rounded-lg hover:bg-admin-accent hover:text-admin-bg transition-all">Console Admin</Link>
                )}
                <button onClick={handleLogout} className="text-[10px] font-black uppercase tracking-widest text-status-error/70 hover:text-status-error transition-colors">Sortie</button>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <Link href="/login" className="text-[10px] font-black uppercase tracking-widest text-site-text-muted hover:text-white">Connexion</Link>
                <Link href="/register" className="bg-site-accent text-white px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all shadow-lg shadow-site-accent/20">S'inscrire</Link>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Structured Hero */}
      <header className="relative py-24 px-6 overflow-hidden border-b border-site-border">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-site-accent/5 blur-[120px] rounded-full pointer-events-none -mr-40"></div>
        <div className="max-w-7xl mx-auto relative z-10 flex flex-col lg:flex-row items-center justify-between gap-16">
          <div className="max-w-2xl space-y-8 animate-fade-in">
            <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-site-inner border border-site-border">
              <span className="w-2 h-2 bg-site-accent rounded-full animate-pulse shadow-[0_0_10px_rgba(59,130,246,0.8)]"></span>
              <span className="text-[10px] font-black uppercase tracking-widest text-site-text-muted">Système de réservation actif</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter uppercase italic leading-[0.9]">
              Rejoignez les meilleures <br /><span className="text-site-accent underline decoration-site-accent/30 decoration-8 underline-offset-8">sessions du réseau.</span>
            </h1>
            <p className="text-lg text-site-text-muted font-medium max-w-lg leading-relaxed">
              Explorez une architecture d'événements unique et sécurisée. Gérez vos accès en temps réel avec notre protocole de réservation.
            </p>
            <div className="relative group max-w-md">
              <input
                type="text"
                placeholder="Scanner l'horizon (titres, lieux, tags)..."
                className="w-full bg-site-inner border border-site-border py-4.5 pl-14 pr-8 rounded-2xl text-sm font-bold text-white focus:border-site-accent outline-none transition-all shadow-2xl"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <svg className="absolute left-5 top-1/2 -translate-y-1/2 text-site-text-muted group-focus-within:text-site-accent transition-colors" xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>
            </div>
          </div>

        </div>
      </header>

      {/* Structured Grid */}
      <main className="max-w-7xl mx-auto px-6 py-20 pb-48">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-6 border-b border-site-border pb-10">
          <div className="space-y-1">
            <h2 className="text-4xl font-black uppercase italic tracking-tighter">Catalogue Unit</h2>
            <p className="text-[10px] font-black tracking-widest text-site-accent uppercase italic">Sessions disponibles en flux continu</p>
          </div>
          <span className="text-[10px] font-black text-site-text-muted uppercase tracking-[0.4em] bg-site-inner px-4 py-1.5 rounded-lg border border-site-border">Active_Items: {filteredEvents.length}</span>
        </div>

        {loading ? (
          <div className="flex justify-center py-60">
            <div className="w-12 h-12 border-2 border-site-border border-t-site-accent rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {filteredEvents.map((e) => (
              <Link key={e.id} href={`/events/${e.id}`}
                className="group flex flex-col bg-site-card border border-site-border rounded-[2.5rem] overflow-hidden hover:border-site-accent/50 transition-all shadow-xl hover:-translate-y-2">
                <div className="h-64 bg-site-inner relative overflow-hidden">
                  {e.imageAffiche ? (
                    <img src={e.imageAffiche} alt={e.titre} className="w-full h-full object-cover grayscale opacity-60 group-hover:grayscale-0 group-hover:scale-110 group-hover:opacity-100 transition-all duration-[1s]" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-site-text-dim text-[10px] font-black uppercase tracking-widest opacity-20">NO_DATA_VISUAL</div>
                  )}
                  <div className="absolute top-6 left-6 bg-site-bg/80 backdrop-blur-md text-white px-4 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest border border-white/10 shadow-xl">
                    {e.categorie?.nom}
                  </div>
                </div>
                <div className="p-10 space-y-6 flex-1 flex flex-col">
                  <h3 className="text-2xl font-black uppercase italic tracking-tighter leading-none group-hover:text-site-accent transition-colors">{e.titre}</h3>
                  <div className="space-y-3 text-[10px] font-black text-site-text-muted uppercase tracking-widest">
                    <p className="flex items-center gap-3"><span className="text-site-accent text-sm opacity-50">📅</span> {new Date(e.dateHeureDebut).toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' })}</p>
                    <p className="flex items-center gap-3 truncate"><span className="text-site-accent text-sm opacity-50">📍</span> {e.lieu}</p>
                  </div>
                  <div className="mt-auto pt-8 border-t border-site-border flex items-center justify-between">
                    <div className="flex flex-col">
                      <span className="text-[8px] font-black text-site-accent uppercase tracking-widest mb-1">Access_Fee</span>
                      <span className="text-3xl font-black italic leading-none">{e.prix}€</span>
                    </div>
                    <div className="w-12 h-12 bg-site-inner border border-site-border rounded-xl flex items-center justify-center text-site-accent group-hover:bg-site-accent group-hover:text-white transition-all">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>

      <footer className="border-t border-site-border py-16 px-6 bg-site-bg">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-12 opacity-50">
          <div className="flex items-center gap-4">
            <span className="text-2xl font-black tracking-tighter uppercase italic">Eventura</span>
            <span className="w-10 h-[1px] bg-site-border"></span>
            <span className="text-[10px] font-bold uppercase tracking-widest opacity-60">© 2026 Universe protocol</span>
          </div>
          <div className="flex gap-10 text-[9px] font-black uppercase tracking-[0.4em]">
            <Link href="#" className="hover:text-site-accent transition-colors">Politique</Link>
            <Link href="#" className="hover:text-site-accent transition-colors">Conditions</Link>
            <Link href="#" className="hover:text-site-accent transition-colors">Support</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
