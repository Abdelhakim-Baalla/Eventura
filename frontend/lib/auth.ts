const TOKEN_KEY = 'eventura_token';
const USER_KEY = 'eventura_user';

export const authService = {
    // Stocker le token
    setToken(token: string): void {
        if (typeof window !== 'undefined') {
            localStorage.setItem(TOKEN_KEY, token);
        }
    },

    // Récupérer le token
    getToken(): string | null {
        if (typeof window !== 'undefined') {
            return localStorage.getItem(TOKEN_KEY);
        }
        return null;
    },

    // Stocker les infos utilisateur
    setUser(user: any): void {
        if (typeof window !== 'undefined') {
            localStorage.setItem(USER_KEY, JSON.stringify(user));
        }
    },

    // Récupérer les infos utilisateur
    getUser(): any | null {
        if (typeof window !== 'undefined') {
            const user = localStorage.getItem(USER_KEY);
            return user ? JSON.parse(user) : null;
        }
        return null;
    },

    // Vérifier si l'utilisateur est connecté
    isAuthenticated(): boolean {
        return this.getToken() !== null;
    },

    // Déconnexion
    logout(): void {
        if (typeof window !== 'undefined') {
            localStorage.removeItem(TOKEN_KEY);
            localStorage.removeItem(USER_KEY);
        }
    },
};
