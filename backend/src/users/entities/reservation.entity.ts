import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Unique,
} from 'typeorm';
import { User } from './user.entity';
import { Event } from './event.entity';

export enum StatutReservation {
  EN_ATTENTE = 'EN_ATTENTE',
  CONFIRME = 'CONFIRME',
  REFUSE = 'REFUSE',
  ANNULE = 'ANNULE',
}

@Entity('reservations')
@Unique(['utilisateurId', 'evenementId'])
export class Reservation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  utilisateurId: string;

  @Column()
  evenementId: string;

  @Column({
    type: 'enum',
    enum: StatutReservation,
    default: StatutReservation.EN_ATTENTE,
  })
  statut: StatutReservation;

  @Column({ unique: true, length: 50 })
  referenceTicket: string;

  @CreateDateColumn()
  dateReservation: Date;

  @Column({ type: 'timestamp with time zone', nullable: true })
  dateConfirmation: Date;

  @ManyToOne(() => User, (user) => user.reservations, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'utilisateurId' })
  utilisateur: User;

  @ManyToOne(() => Event, (event) => event.reservations, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'evenementId' })
  evenement: Event;
}
