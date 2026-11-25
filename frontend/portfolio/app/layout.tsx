import '../../app/globals.css';
export const metadata = { title: 'Eventura · Billetterie de démonstration' };
export default function Layout({children}: {children: React.ReactNode}) {
  return <html lang="fr"><body>{children}</body></html>;
}
