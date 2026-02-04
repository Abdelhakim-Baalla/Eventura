-- 1. Création des Enums
CREATE TYPE role_utilisateur AS ENUM ('SUPER_ADMIN', 'ADMIN', 'PARTICIPANT');
CREATE TYPE statut_evenement AS ENUM ('BROUILLON', 'PUBLIE', 'ANNULE');
CREATE TYPE statut_reservation AS ENUM ('EN_ATTENTE', 'CONFIRME', 'REFUSE', 'ANNULE');

-- 2. Table Categorie
CREATE TABLE categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nom VARCHAR(100) NOT NULL UNIQUE,
    description TEXT
);

-- 3. Table Utilisateur
CREATE TABLE utilisateurs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) NOT NULL UNIQUE,
    nom VARCHAR(100) NOT NULL,
    prenom VARCHAR(100) NOT NULL,
    password VARCHAR(255) NOT NULL,
    telephone VARCHAR(20),
    role role_utilisateur DEFAULT 'PARTICIPANT',
    est_actif BOOLEAN DEFAULT TRUE,
    date_creation TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. Table Evenement
CREATE TABLE evenements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    titre VARCHAR(200) NOT NULL,
    description TEXT,
    date_heure_debut TIMESTAMP WITH TIME ZONE NOT NULL,
    date_heure_fin TIMESTAMP WITH TIME ZONE NOT NULL,
    lieu VARCHAR(255) NOT NULL,
    capacite_max INTEGER NOT NULL CHECK (capacite_max > 0),
    image_affiche VARCHAR(255),
    statut statut_evenement DEFAULT 'BROUILLON',
    createur_id UUID REFERENCES utilisateurs(id) ON DELETE SET NULL,
    categorie_id UUID REFERENCES categories(id) ON DELETE CASCADE,
    date_creation TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. Table Reservation
CREATE TABLE reservations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    utilisateur_id UUID REFERENCES utilisateurs(id) ON DELETE CASCADE,
    evenement_id UUID REFERENCES evenements(id) ON DELETE CASCADE,
    statut statut_reservation DEFAULT 'EN_ATTENTE',
    reference_ticket VARCHAR(50) UNIQUE,
    date_reservation TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    date_confirmation TIMESTAMP WITH TIME ZONE,
    -- un utilisateur ne peut pas réserver deux fois le même événement
    CONSTRAINT unique_user_event_booking UNIQUE (utilisateur_id, evenement_id)
);