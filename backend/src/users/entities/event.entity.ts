import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { User } from './user.entity';
import { Category } from './category.entity';
import { Reservation } from './reservation.entity';

export enum StatutEvenement {
    BROUILLON = 'BROUILLON',
    PUBLIE = 'PUBLIE',
    ANNULE = 'ANNULE',
}

@Entity('evenements')
export class Event {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ length: 200 })
    titre: string;

    @Column({ type: 'text', nullable: true })
    description: string;

    @Column({ type: 'timestamp with time zone' })
    dateHeureDebut: Date;

    @Column({ type: 'timestamp with time zone' })
    dateHeureFin: Date;

    @Column()
    lieu: string;

    @Column({ type: 'int' })
    capaciteMax: number;

    @Column({ nullable: true })
    imageAffiche: string;

    @Column({ type: 'enum', enum: StatutEvenement, default: StatutEvenement.BROUILLON })
    statut: StatutEvenement;

    @Column({ nullable: true })
    createurId: string;

    @Column()
    categorieId: string;

    @CreateDateColumn()
    dateCreation: Date;

    @ManyToOne(() => User, { onDelete: 'SET NULL' })
    @JoinColumn({ name: 'createurId' })
    createur: User;

    @ManyToOne(() => Category, (category) => category.evenements, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'categorieId' })
    categorie: Category;

    @OneToMany(() => Reservation, (reservation) => reservation.evenement)
    reservations: Reservation[];
}
