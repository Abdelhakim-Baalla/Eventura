'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        email: '',
        nom: '',
        prenom: '',
        password: '',
        telephone: '',
    });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(false);

    const validate = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.email) newErrors.email = 'Email requis';
        else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email invalide';

        if (!formData.nom) newErrors.nom = 'Nom requis';
        if (!formData.prenom) newErrors.prenom = 'Prénom requis';

        if (!formData.password) newErrors.password = 'Mot de passe requis';
        else if (formData.password.length < 8) newErrors.password = 'Minimum 8 caractères';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validate()) return;

        setLoading(true);
        try {
            const response = await fetch('http://localhost:3000/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                const error = await response.json();
                setErrors({ submit: error.message || 'Erreur lors de l\'inscription' });
                return;
            }

            router.push('/login');
        } catch (error) {
            setErrors({ submit: 'Erreur de connexion au serveur' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md">
                <h1 className="text-2xl font-bold mb-6 text-center">Inscription</h1>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Email</label>
                        <input
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className="w-full px-3 py-2 border rounded-md"
                        />
                        {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Nom</label>
                        <input
                            type="text"
                            value={formData.nom}
                            onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                            className="w-full px-3 py-2 border rounded-md"
                        />
                        {errors.nom && <p className="text-red-500 text-sm mt-1">{errors.nom}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Prénom</label>
                        <input
                            type="text"
                            value={formData.prenom}
                            onChange={(e) => setFormData({ ...formData, prenom: e.target.value })}
                            className="w-full px-3 py-2 border rounded-md"
                        />
                        {errors.prenom && <p className="text-red-500 text-sm mt-1">{errors.prenom}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Mot de passe</label>
                        <input
                            type="password"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            className="w-full px-3 py-2 border rounded-md"
                        />
                        {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Téléphone (optionnel)</label>
                        <input
                            type="tel"
                            value={formData.telephone}
                            onChange={(e) => setFormData({ ...formData, telephone: e.target.value })}
                            className="w-full px-3 py-2 border rounded-md"
                        />
                    </div>

                    {errors.submit && (
                        <p className="text-red-500 text-sm text-center">{errors.submit}</p>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 disabled:bg-gray-400"
                    >
                        {loading ? 'Inscription...' : 'S\'inscrire'}
                    </button>
                </form>
            </div>
        </div>
    );
}
