export type { User } from '../lib/auth';
export const authService = {
  getUser: () => ({ id: 'demo', prenom: 'Sam', nom: 'Démo', email: 'sam@example.org', role: 'PARTICIPANT' as const, estActif: true, dateCreation: '2026-11-25' }),
  logout: () => { sessionStorage.removeItem('eventura-demo-tickets'); }
};
