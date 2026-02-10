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
import { StatutReservation } from '../common/enums/statut-reservation.enum';
import { Reservation } from '../users/entities/reservation.entity';

@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(Event)
    private eventRepository: Repository<Event>,
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
    @InjectRepository(Reservation)
    private reservationRepository: Repository<Reservation>,
  ) { }

  async getStats(adminId: string) {
    const events = await this.eventRepository.find({
      where: { createurId: adminId },
      relations: ['reservations']
    });

    const now = new Date();
    const totalEvents = events.length;
    let upcomingEvents = 0;
    let totalReservations = 0;
    let totalConfirmed = 0;
    let totalRevenue = 0;
    let totalCapacity = 0;

    events.forEach(event => {
      totalCapacity += event.capaciteMax;
      if (new Date(event.dateHeureDebut) > now) {
        upcomingEvents++;
      }

      totalReservations += event.reservations.length;
      event.reservations.forEach(res => {
        if (res.statut === StatutReservation.CONFIRME) {
          totalConfirmed++;
          totalRevenue += Number(event.prix);
        }
      });
    });

    const occupancyRate = totalCapacity > 0
      ? Math.round((totalConfirmed / totalCapacity) * 100)
      : 0;

    return {
      totalEvents,
      upcomingEvents,
      totalReservations,
      totalConfirmed,
      totalRevenue,
      occupancyRate
    };
  }

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

  async findAllCategories(): Promise<Category[]> {
    return await this.categoryRepository.find();
  }

  async publish(id: string): Promise<Event> {
    const event = await this.eventRepository.findOne({ where: { id } });
    if (!event) {
      throw new NotFoundException('Événement introuvable');
    }

    if (event.statut !== StatutEvenement.BROUILLON) {
      throw new BadRequestException('Seul un brouillon peut être publié');
    }

    event.statut = StatutEvenement.PUBLIE;
    return await this.eventRepository.save(event);
  }

  async cancel(id: string): Promise<Event> {
    const event = await this.eventRepository.findOne({ where: { id } });
    if (!event) {
      throw new NotFoundException('Événement introuvable');
    }

    if (event.statut !== StatutEvenement.PUBLIE) {
      throw new BadRequestException('Seul un événement publié peut être annulé');
    }

    event.statut = StatutEvenement.ANNULE;
    return await this.eventRepository.save(event);
  }

  async findAllForAdmin(createurId: string): Promise<Event[]> {
    return await this.eventRepository.find({
      where: { createurId },
      order: { dateCreation: 'DESC' },
      relations: ['categorie'],
    });
  }

  async findAllPublished(): Promise<Event[]> {
    return await this.eventRepository.find({
      where: { statut: StatutEvenement.PUBLIE },
      order: { dateHeureDebut: 'ASC' },
      relations: ['categorie'],
    });
  }

  async findOne(id: string): Promise<any> {
    const event = await this.eventRepository.findOne({
      where: { id },
      relations: ['categorie', 'reservations'],
    });

    if (!event) {
      throw new NotFoundException('Événement introuvable');
    }

    const confirmedReservations = event.reservations.filter(
      (r) => r.statut === StatutReservation.CONFIRME,
    ).length;

    const placesRestantes = Math.max(0, event.capaciteMax - confirmedReservations);

    // On retire les réservations de l'objet pour ne pas alourdir la réponse
    const { reservations, ...eventData } = event;

    return {
      ...eventData,
      placesRestantes,
    };
  }

  async seedCategories() {
    const categories = ['Concert', 'Conférence', 'Atelier', 'Sport', 'Théâtre'];
    for (const nom of categories) {
      const existing = await this.categoryRepository.findOne({ where: { nom } });
      if (!existing) {
        await this.categoryRepository.save(
          this.categoryRepository.create({ nom }),
        );
      }
    }
    return { message: 'Categories seeded' };
  }

  async remove(id: string): Promise<void> {
    const event = await this.eventRepository.findOne({ where: { id } });
    if (!event) {
      throw new NotFoundException('Événement introuvable');
    }
    await this.eventRepository.remove(event);
  }
}

