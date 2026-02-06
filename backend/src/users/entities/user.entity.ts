import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { Role } from '../../common/enums/role.enum';
import { Reservation } from './reservation.entity';

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

  @Column({ default: true, name: 'est_actif' })
  estActif: boolean;

  @CreateDateColumn({ name: 'date_creation' })
  dateCreation: Date;

  @OneToMany(() => Reservation, (reservation) => reservation.utilisateur)
  reservations: Reservation[];
}
