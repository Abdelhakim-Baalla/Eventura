'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authService } from '@/lib/auth';

interface User {
    id: string;
    email: string;
    nom: string;
    prenom: string;
    role: string;
}

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (token: string, userData: User) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    // Initialiser l'user depuis localStorage immédiatement
    const initialUser = (() => {
        const storedUser = authService.getUser();
        const token = authService.getToken();
        return (storedUser && token) ? storedUser : null;
    })();

    const [user, setUser] = useState<User | null>(initialUser);
    const [isLoading] = useState(false);

    useEffect(() => {
        // Le chargement est déjà fait
    }, []);

    const login = (token: string, userData: User) => {
        authService.setToken(token);
        authService.setUser(userData);
        setUser(userData);
    };

    const logout = () => {
        authService.logout();
        setUser(null);
    };

    const value = {
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    const context = useContext(AuthContext);

    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }

    return context;
}
