import Link from 'next/link';

export default function ForbiddenPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-site-bg text-site-text-main p-8">
            <div className="max-w-md w-full text-center space-y-12 bg-site-card p-16 rounded-[3rem] border border-site-border shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-status-error opacity-5 blur-[40px] -mr-16 -mt-16"></div>

                <div className="space-y-4">
                    <h1 className="text-[120px] font-black text-status-error tracking-tighter italic leading-none opacity-20">403</h1>
                    <div className="space-y-2">
                        <h2 className="text-3xl font-black uppercase tracking-tight italic">Accès Refusé</h2>
                        <p className="text-[10px] font-black text-site-text-muted uppercase tracking-[0.4em]">Protocole de sécurité actif</p>
                    </div>
                </div>

                <div className="p-6 bg-site-inner border border-site-border rounded-2xl italic text-sm text-site-text-muted">
                    Votre identifiant actuel n'a pas les autorisations nécessaires pour accéder à cette zone du réseau.
                </div>

                <Link
                    href="/"
                    className="inline-block w-full bg-site-accent text-white py-5 rounded-xl font-black text-xs uppercase tracking-widest hover:brightness-110 shadow-xl shadow-site-accent/20 transition-all active:scale-95"
                >
                    Retour au Catalogue Matrix
                </Link>
            </div>
        </div>
    );
}
