import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Event } from '../users/entities/event.entity';
import { Category } from '../users/entities/category.entity';
import { CreateEventDto } from './dto/create-event.dto';
import { StatutEvenement } from '../common/enums/statut-evenement.enum';

@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(Event)
    private eventRepository: Repository<Event>,
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
  ) {}

  async create(
    createEventDto: CreateEventDto,
    createurId: string,
  ): Promise<Event> {
    const {
      titre,
      description,
      dateHeureDebut,
      dateHeureFin,
      lieu,
      capaciteMax,
      imageAffiche,
      categorieId,
    } = createEventDto;

    // Vérifier que la catégorie existe
    const category = await this.categoryRepository.findOne({
      where: { id: categorieId },
    });
    if (!category) {
      throw new NotFoundException('Catégorie introuvable');
    }

    // Vérifier que la date de fin est après la date de début
    const debut = new Date(dateHeureDebut);
    const fin = new Date(dateHeureFin);
    if (fin <= debut) {
      throw new BadRequestException(
        'La date de fin doit être après la date de début',
      );
    }

    // Créer l'événement
    const event = this.eventRepository.create({
      titre,
      description,
      dateHeureDebut: debut,
      dateHeureFin: fin,
      lieu,
      capaciteMax,
      imageAffiche,
      categorieId,
      createurId,
      statut: StatutEvenement.BROUILLON,
    });

    return await this.eventRepository.save(event);
  }

  async update(
    id: string,
    updateEventDto: Partial<CreateEventDto>,
  ): Promise<Event> {
    // Vérifier que l'événement existe
    const event = await this.eventRepository.findOne({ where: { id } });
    if (!event) {
      throw new NotFoundException('Événement introuvable');
    }

    // Si la catégorie est modifiée, vérifier qu'elle existe
    if (updateEventDto.categorieId) {
      const category = await this.categoryRepository.findOne({
        where: { id: updateEventDto.categorieId },
      });
      if (!category) {
        throw new NotFoundException('Catégorie introuvable');
      }
    }

    // Si les dates sont modifiées, vérifier la cohérence
    const dateDebut = updateEventDto.dateHeureDebut
      ? new Date(updateEventDto.dateHeureDebut)
      : event.dateHeureDebut;
    const dateFin = updateEventDto.dateHeureFin
      ? new Date(updateEventDto.dateHeureFin)
      : event.dateHeureFin;

    if (dateFin <= dateDebut) {
      throw new BadRequestException(
        'La date de fin doit être après la date de début',
      );
    }

    // Mettre à jour l'événement
    Object.assign(event, {
      ...updateEventDto,
      dateHeureDebut: updateEventDto.dateHeureDebut
        ? new Date(updateEventDto.dateHeureDebut)
        : event.dateHeureDebut,
      dateHeureFin: updateEventDto.dateHeureFin
        ? new Date(updateEventDto.dateHeureFin)
        : event.dateHeureFin,
    });

    return await this.eventRepository.save(event);
  }
}
