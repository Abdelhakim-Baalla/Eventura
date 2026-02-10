'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import Link from 'next/link';
import { authService } from '@/lib/auth';

interface Event { id: string; titre: string; description: string; dateHeureDebut: string; lieu: string; prix: number; categorie: { nom: string }; imageAffiche?: string; }

export default function Home() {
  const [events, setEvents] = useState<Event[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    setUser(authService.getUser());
    api.get('/events').then(res => setEvents(res.data)).catch(err => console.error(err)).finally(() => setLoading(false));
  }, []);

  const handleLogout = () => { authService.logout(); setUser(null); window.location.reload(); };

  const filteredEvents = events.filter(e => e.titre.toLowerCase().includes(searchTerm.toLowerCase()) || e.lieu.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="min-h-screen bg-admin-bg text-admin-text-main font-sans selection:bg-admin-accent selection:text-admin-bg overflow-x-hidden">
      {/* Premium Navbar */}
      <nav className="h-24 bg-admin-card/80 backdrop-blur-xl border-b border-admin-border flex items-center sticky top-0 z-50 px-10">
        <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
          <Link href="/" className="flex items-center gap-4 group">
            <div className="w-12 h-12 bg-admin-accent rounded-2xl flex items-center justify-center text-admin-bg font-black text-2xl shadow-xl shadow-admin-accent/20 rotate-3 group-hover:rotate-0 transition-transform">E</div>
            <span className="text-2xl font-black tracking-tighter italic uppercase group-hover:text-admin-accent transition-colors">Eventura</span>
          </Link>

          <div className="flex items-center gap-10">
            {user ? (
              <>
                <Link href="/reservations" className="text-[10px] font-black uppercase tracking-[0.3em] text-admin-text-muted hover:text-admin-text-main transition-colors">Mes Tickets</Link>
                {(user.role === 'ADMIN' || user.role === 'SUPER_ADMIN') && (
                  <Link href="/admin" className="bg-admin-accent text-admin-bg px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:brightness-110 transition-all shadow-xl shadow-admin-accent/20">Admin Console</Link>
                )}
                <button onClick={handleLogout} className="text-[10px] font-black uppercase tracking-widest text-status-error/60 hover:text-status-error transition-colors px-4">Sortie</button>
              </>
            ) : (
              <div className="flex items-center gap-6">
                <Link href="/login" className="text-[10px] font-black uppercase tracking-[0.3em] text-admin-text-muted hover:text-admin-text-main px-4">Connexion</Link>
                <Link href="/register" className="bg-admin-accent text-admin-bg px-10 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-2xl shadow-admin-accent/30 hover:brightness-110 active:scale-95 transition-all">S'inscrire</Link>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Cinematic Hero */}
      <header className="relative pt-40 pb-56 px-10 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1400px] h-[800px] bg-admin-accent/5 blur-[200px] rounded-full pointer-events-none"></div>
        <div className="max-w-5xl mx-auto text-center relative z-10 space-y-20">
          <div className="space-y-6">
            <span className="text-admin-accent text-[11px] font-black uppercase tracking-[0.5em] inline-block border border-admin-accent/20 px-6 py-2 rounded-full bg-admin-accent/5">Nouvelle Architecture Eventura</span>
            <h1 className="text-[8rem] md:text-[12rem] font-black tracking-tighter leading-[0.8] italic uppercase selection:text-admin-accent selection:bg-white pb-4">
              L'Expérience<br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-admin-accent via-amber-200 to-admin-accent">Suprême.</span>
            </h1>
            <p className="text-2xl text-admin-text-muted max-w-2xl mx-auto font-bold tracking-tight opacity-70">Accédez aux sessions les plus exclusives du réseau événementiel métropolitain.</p>
          </div>

          <div className="max-w-2xl mx-auto group">
            <div className="relative">
              <input
                type="text"
                placeholder="Scan thématiques ou lieux..."
                className="w-full bg-admin-card border border-admin-border py-8 px-12 rounded-[3rem] text-sm font-black text-admin-text-main uppercase tracking-widest focus:border-admin-accent/50 focus:ring-[20px] ring-admin-accent/5 outline-none transition-all shadow-2xl placeholder:italic placeholder:opacity-30"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <div className="absolute right-8 top-1/2 -translate-y-1/2 w-14 h-14 bg-admin-accent rounded-2xl flex items-center justify-center text-admin-bg shadow-2xl shadow-admin-accent/30">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Events Grid */}
      <main className="max-w-7xl mx-auto px-10 pb-60 relative z-10">
        <div className="flex justify-between items-end mb-24 px-8 border-b border-admin-border pb-12">
          <h2 className="text-5xl font-black italic tracking-tighter uppercase leading-none">PROCHAINES SESSIONS</h2>
          <div className="text-[11px] font-black text-admin-text-muted uppercase tracking-[0.5em]">
            SYSTEME ACTIF / {filteredEvents.length} UNITÉS
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-60">
            <div className="w-16 h-16 border-2 border-admin-border border-t-admin-accent rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16">
            {filteredEvents.length === 0 ? (
              <div className="col-span-full text-center py-60 space-y-10 opacity-30 italic">
                <p className="text-5xl font-black uppercase tracking-[0.5em]">Zéro Résultat.</p>
                <p className="text-sm font-bold uppercase tracking-widest">Le réseau est actuellement vide ou déconnecté.</p>
              </div>
            ) : (
              filteredEvents.map(e => (
                <Link key={e.id} href={`/events/${e.id}`}
                  className="bg-admin-card rounded-[4rem] border border-admin-border overflow-hidden hover:border-admin-accent/50 shadow-2xl transition-all group flex flex-col h-full active:scale-[0.97]">
                  <div className="h-80 bg-admin-inner relative overflow-hidden">
                    {e.imageAffiche ? (
                      <img src={e.imageAffiche} alt={e.titre} className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-1000" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-admin-text-dim font-black uppercase text-[11px] tracking-[0.4em] italic bg-admin-inner">Visual Null</div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-admin-card via-transparent to-transparent opacity-60"></div>
                    <div className="absolute top-8 left-8 bg-admin-accent text-admin-bg px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-2xl shadow-admin-accent/30 translate-y-[-10px] opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all">
                      {e.categorie?.nom}
                    </div>
                  </div>
                  <div className="p-12 flex flex-col flex-1">
                    <h3 className="text-3xl font-black tracking-tighter uppercase italic leading-[0.9] mb-6 group-hover:text-admin-accent transition-colors">{e.titre}</h3>
                    <div className="text-[11px] font-black text-admin-text-dim space-y-3 mb-12 uppercase tracking-widest">
                      <p className="flex items-center gap-4"><span className="text-admin-accent">📅</span> {new Date(e.dateHeureDebut).toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' })}</p>
                      <p className="flex items-center gap-4 truncate"><span className="text-admin-accent">📍</span> {e.lieu}</p>
                    </div>

                    <div className="mt-auto pt-10 border-t border-admin-border flex items-center justify-between">
                      <div className="flex flex-col gap-1">
                        <span className="text-[9px] font-black text-admin-text-dim uppercase tracking-[0.4em]">Tarification</span>
                        <span className="text-4xl font-black text-admin-text-main italic">{e.prix}€</span>
                      </div>
                      <div className="w-16 h-16 bg-admin-inner rounded-[1.5rem] border border-admin-border flex items-center justify-center text-admin-text-dim group-hover:text-admin-accent group-hover:border-admin-accent/40 group-hover:rotate-12 transition-all shadow-inner">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
                      </div>
                    </div>
                  </div>
                </Link>
              ))
            )}
          </div>
        )}
      </main>
    </div>
  );
}
