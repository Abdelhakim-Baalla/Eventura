import Link from 'next/link';

export default function ForbiddenPage() {
    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
                <h1 className="text-6xl font-bold text-red-600">403</h1>
                <p className="text-xl mt-4">Accès refusé</p>
                <p className="text-gray-600 mt-2">
                    Vous n'avez pas les permissions nécessaires
                </p>
                <Link href="/" className="mt-6 inline-block bg-blue-600 text-white px-6 py-2 rounded">
                    Retour à l'accueil
                </Link>
            </div>
        </div>
    );
}
