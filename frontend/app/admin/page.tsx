'use client';

import { withAdminAccess } from '@/components/withAdminAccess';

function AdminPage() {
    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold">Espace Admin</h1>
        </div>
    );
}

export default withAdminAccess(AdminPage);
