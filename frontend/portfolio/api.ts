import axios, { AxiosError } from 'axios';
import fixtures from './events.json';
import { authService } from './auth';

// Keep the fictional sessions bookable when someone opens the portfolio in a later year.
const year = String(new Date().getUTCFullYear() + 1);
const events = fixtures.map(event => ({
  ...event,
  dateHeureDebut: year + event.dateHeureDebut.slice(4),
  dateHeureFin: year + event.dateHeureFin.slice(4),
}));

type Ticket = {
  id: string; referenceTicket: string; statut: 'EN_ATTENTE' | 'ANNULE';
  dateReservation: string; utilisateur: ReturnType<typeof authService.getUser>; evenement: typeof events[number];
};
const key = 'eventura-demo-tickets';
const api = axios.create({
  adapter: async config => {
    const tickets: Ticket[] = JSON.parse(sessionStorage.getItem(key) || '[]');
    const path = config.url || '';
    const event = events.find(e => path === '/events/' + e.id);
    let data;
    if (path === '/events') data = events;
    else if (event) data = event;
    else if (path === '/reservations/my') data = {items: tickets.filter(t => !config.params?.statut || t.statut === config.params.statut)};
    else if (path === '/reservations' && config.method === 'post') {
      const selected = events.find(e => e.id === JSON.parse(config.data).evenementId);
      if (!selected) throw new AxiosError('Événement inconnu');
      const existing = tickets.find(t => t.evenement.id === selected.id && t.statut !== 'ANNULE');
      if (existing) data = existing;
      else {
        const id = crypto.randomUUID();
        const ticket: Ticket = {id,referenceTicket:id.slice(0,8),statut:'EN_ATTENTE',dateReservation:new Date().toISOString(),utilisateur:authService.getUser(),evenement:selected};
        tickets.unshift(ticket);
        sessionStorage.setItem(key,JSON.stringify(tickets));
        data = ticket;
      }
    } else if (config.method === 'patch' && path.endsWith('/cancel')) {
      const ticket = tickets.find(t => path === '/reservations/' + t.id + '/cancel');
      if (!ticket) throw new AxiosError('Ticket inconnu');
      ticket.statut = 'ANNULE';
      sessionStorage.setItem(key,JSON.stringify(tickets));
      data = ticket;
    } else throw new AxiosError('Route indisponible dans la démonstration');
    return {data,status:200,statusText:'OK',headers:{},config};
  }
});
export default api;
