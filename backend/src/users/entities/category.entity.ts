import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Event } from './event.entity';

@Entity('categories')
export class Category {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true, length: 100 })
  nom: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @OneToMany(() => Event, (event) => event.categorie)
  evenements: Event[];
}
