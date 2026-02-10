import { Injectable, BadRequestException, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Reservation } from '../users/entities/reservation.entity';
import { Event } from '../users/entities/event.entity';
import { StatutEvenement } from '../common/enums/statut-evenement.enum';
import { StatutReservation } from '../common/enums/statut-reservation.enum';

@Injectable()
export class ReservationsService {
    constructor(
        @InjectRepository(Reservation)
        private reservationRepository: Repository<Reservation>,
        @InjectRepository(Event)
        private eventRepository: Repository<Event>,
    ) { }

    async create(evenementId: string, utilisateurId: string) {
        const event = await this.eventRepository.findOne({
            where: { id: evenementId }
        });

        if (!event) {
            throw new NotFoundException('Événement introuvable');
        }

        if (event.statut !== StatutEvenement.PUBLIE) {
            throw new BadRequestException('Cet événement n\'est pas ouvert aux réservations');
        }

        if (new Date(event.dateHeureDebut) < new Date()) {
            throw new BadRequestException('Cet événement est déjà passé');
        }

        const existing = await this.reservationRepository.findOne({
            where: { evenementId, utilisateurId }
        });
        if (existing) {
            throw new ConflictException('Vous avez déjà une réservation pour cet événement');
        }

        const confirmedCount = await this.reservationRepository.count({
            where: { evenementId, statut: StatutReservation.CONFIRME }
        });

        if (confirmedCount >= event.capaciteMax) {
            throw new BadRequestException('Cet événement est complet');
        }

        const referenceTicket = `TICK-${Math.random().toString(36).substring(2, 9).toUpperCase()}`;

        const reservation = this.reservationRepository.create({
            evenementId,
            utilisateurId,
            statut: StatutReservation.CONFIRME,
            referenceTicket,
        });

        return await this.reservationRepository.save(reservation);
    }

    async findMyReservations(utilisateurId: string) {
        return await this.reservationRepository.find({
            where: { utilisateurId },
            relations: ['evenement'],
            order: { dateReservation: 'DESC' }
        });
    }
}
