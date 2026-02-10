'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import Link from 'next/link';

interface Event {
  id: string;
  titre: string;
  description: string;
  dateHeureDebut: string;
  lieu: string;
  prix: number;
  categorie: { nom: string };
  image?: string;
}

export default function Home() {
  const [events, setEvents] = useState<Event[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/events')
      .then(res => setEvents(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const filteredEvents = events.filter(event =>
    event.titre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.lieu.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar Simple */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-blue-600 italic">Eventura</Link>
          <div className="space-x-4">
            <Link href="/reservations" className="text-gray-600 hover:text-blue-600 font-medium">Mes Tickets</Link>
            <Link href="/login" className="text-gray-600 hover:text-blue-600">Connexion</Link>
            <Link href="/register" className="bg-blue-600 text-white px-4 py-2 rounded-lg">S'inscrire</Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="bg-blue-600 text-white py-12 text-center">
        <h1 className="text-4xl font-extrabold mb-4">Découvrez les meilleurs événements</h1>
        <div className="max-w-md mx-auto px-4">
          <input
            type="text"
            placeholder="Rechercher un événement ou un lieu..."
            className="w-full p-4 rounded-full text-black shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </header>

      {/* Events Grid */}
      <main className="max-w-6xl mx-auto px-4 py-12 text-black">
        <h2 className="text-2xl font-bold mb-8">
          {searchTerm ? `Résultats pour "${searchTerm}"` : 'Événements à venir'}
        </h2>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredEvents.length === 0 ? (
              <p className="col-span-full text-center text-gray-500 py-12">Aucun événement ne correspond à votre recherche.</p>
            ) : (
              filteredEvents.map(event => (
                <Link key={event.id} href={`/events/${event.id}`}
                  className="bg-white rounded-xl shadow-sm border overflow-hidden hover:shadow-md transition-shadow group">
                  <div className="h-48 bg-gray-200 relative">
                    {event.image ? (
                      <img src={event.image} alt={event.titre} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">Pas d'image</div>
                    )}
                    <div className="absolute top-4 left-4 bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-bold">
                      {event.categorie?.nom}
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="text-lg font-bold mb-2 group-hover:text-blue-600 transition-colors">{event.titre}</h3>
                    <div className="text-sm text-gray-500 space-y-1">
                      <p>📅 {new Date(event.dateHeureDebut).toLocaleDateString()}</p>
                      <p>📍 {event.lieu}</p>
                    </div>
                    {/* Indicateur de places */}
                    <div className="mt-4 flex items-center gap-2 text-xs font-medium uppercase tracking-wider">
                      <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                      <span className="text-green-600">Places disponibles</span>
                    </div>
                    <div className="mt-4 flex items-center justify-between">
                      <span className="text-xl font-black text-blue-600">{event.prix === 0 ? 'Gratuit' : `${event.prix} €`}</span>
                      <span className="text-blue-600 font-medium">Réserver →</span>
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
