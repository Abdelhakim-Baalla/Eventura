import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { StatutEvenement } from '../common/enums/statut-evenement.enum';
import { User } from './user.entity';
import { Category } from './category.entity';
import { Reservation } from './reservation.entity';

@Entity('evenements')
export class Event {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 200 })
  titre: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'timestamp with time zone', name: 'date_heure_debut' })
  dateHeureDebut: Date;

  @Column({ type: 'timestamp with time zone', name: 'date_heure_fin' })
  dateHeureFin: Date;

  @Column()
  lieu: string;

  @Column({ type: 'int', name: 'capacite_max' })
  capaciteMax: number;

  @Column({ nullable: true, name: 'image_affiche' })
  imageAffiche: string;

  @Column({
    type: 'enum',
    enum: StatutEvenement,
    default: StatutEvenement.BROUILLON,
  })
  statut: StatutEvenement;

  @Column({ nullable: true, name: 'createur_id' })
  createurId: string;

  @Column({ name: 'categorie_id' })
  categorieId: string;

  @CreateDateColumn({ name: 'date_creation' })
  dateCreation: Date;

  @ManyToOne(() => User, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'createur_id' })
  createur: User;

  @ManyToOne(() => Category, (category) => category.evenements, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'categorie_id' })
  categorie: Category;

  @OneToMany(() => Reservation, (reservation) => reservation.evenement)
  reservations: Reservation[];
}
