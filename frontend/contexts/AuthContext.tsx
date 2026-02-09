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
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Au chargement, récupérer l'utilisateur depuis localStorage
    useEffect(() => {
        const storedUser = authService.getUser();
        const token = authService.getToken();

        if (storedUser && token) {
            setUser(storedUser);
        }

        setIsLoading(false);
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
