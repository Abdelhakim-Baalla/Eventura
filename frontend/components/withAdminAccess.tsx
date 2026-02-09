'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

export function withAdminAccess<P extends object>(
    Component: React.ComponentType<P>
) {
    return function ProtectedComponent(props: P) {
        const router = useRouter();
        const { user, isAuthenticated, isLoading } = useAuth();

        useEffect(() => {
            if (!isLoading) {
                if (!isAuthenticated) {
                    router.push('/login');
                } else if (user?.role !== 'ADMIN' && user?.role !== 'SUPER_ADMIN') {
                    router.push('/403');
                }
            }
        }, [isAuthenticated, isLoading, user, router]);

        if (isLoading) {
            return <div>Chargement...</div>;
        }

        if (!isAuthenticated || (user?.role !== 'ADMIN' && user?.role !== 'SUPER_ADMIN')) {
            return null;
        }

        return <Component {...props} />;
    };
}
