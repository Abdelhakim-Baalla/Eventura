import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { Reservation } from './reservation.entity';

export enum Role {
  SUPER_ADMIN = 'SUPER_ADMIN',
  ADMIN = 'ADMIN',
  PARTICIPANT = 'PARTICIPANT',
}

@Entity('utilisateurs')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  nom: string;

  @Column()
  prenom: string;

  @Column()
  password: string;

  @Column({ nullable: true })
  telephone: string;

  @Column({ type: 'enum', enum: Role, default: Role.PARTICIPANT })
  role: Role;

  @Column({ default: true })
  estActif: boolean;

  @CreateDateColumn()
  dateCreation: Date;

  @OneToMany(() => Reservation, (reservation) => reservation.utilisateur)
  reservations: Reservation[];
}
