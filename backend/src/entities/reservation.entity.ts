import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Unique,
} from 'typeorm';
import { StatutReservation } from '../common/enums/statut-reservation.enum';
import { User } from './user.entity';
import { Event } from './event.entity';

@Entity('reservations')
@Unique(['utilisateurId', 'evenementId'])
export class Reservation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'utilisateur_id' })
  utilisateurId: string;

  @Column({ name: 'evenement_id' })
  evenementId: string;

  @Column({
    type: 'enum',
    enum: StatutReservation,
    default: StatutReservation.EN_ATTENTE,
  })
  statut: StatutReservation;

  @Column({ unique: true, length: 50, name: 'reference_ticket' })
  referenceTicket: string;

  @CreateDateColumn({ name: 'date_reservation' })
  dateReservation: Date;

  @Column({
    type: 'timestamp with time zone',
    nullable: true,
    name: 'date_confirmation',
  })
  dateConfirmation: Date;

  @ManyToOne(() => User, (user) => user.reservations, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'utilisateur_id' })
  utilisateur: User;

  @ManyToOne(() => Event, (event) => event.reservations, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'evenement_id' })
  evenement: Event;
}
