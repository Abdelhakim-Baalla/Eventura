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
            statut: StatutReservation.EN_ATTENTE,
            referenceTicket,
        });

        return await this.reservationRepository.save(reservation);
    }

    async findMyReservations(utilisateurId: string, statut?: StatutReservation) {
        const where: any = { utilisateurId };
        if (statut) {
            where.statut = statut;
        }

        return await this.reservationRepository.find({
            where,
            relations: ['evenement'],
            order: { dateReservation: 'DESC' }
        });
    }

    async findAllForAdmin(adminId: string) {
        const reservations = await this.reservationRepository.find({
            relations: ['evenement', 'utilisateur'],
            order: { dateReservation: 'DESC' }
        });

        return reservations.filter(res => res.evenement?.createurId === adminId);
    }

    async updateStatus(id: string, statut: StatutReservation, adminId: string) {
        const reservation = await this.reservationRepository.findOne({
            where: { id },
            relations: ['evenement']
        });

        if (!reservation) {
            throw new NotFoundException('Réservation introuvable');
        }

        // Vérification que l'admin est bien le créateur de l'événement
        if (reservation.evenement.createurId !== adminId) {
            throw new BadRequestException('Vous n\'avez pas les droits sur cette réservation');
        }

        // Si on confirme, on vérifie la capacité
        if (statut === StatutReservation.CONFIRME && reservation.statut !== StatutReservation.CONFIRME) {
            const confirmedCount = await this.reservationRepository.count({
                where: { evenementId: reservation.evenementId, statut: StatutReservation.CONFIRME }
            });

            if (confirmedCount >= reservation.evenement.capaciteMax) {
                throw new BadRequestException('Impossible de confirmer : l\'événement est complet');
            }
        }

        reservation.statut = statut;
        if (statut === StatutReservation.CONFIRME) {
            reservation.dateConfirmation = new Date();
        }

        return await this.reservationRepository.save(reservation);
    }

    async cancel(id: string, utilisateurId: string) {
        const reservation = await this.reservationRepository.findOne({
            where: { id, utilisateurId }
        });

        if (!reservation) {
            throw new NotFoundException('Réservation introuvable');
        }

        if (reservation.statut === StatutReservation.CONFIRME) {
            throw new BadRequestException('Impossible d\'annuler une réservation déjà confirmée. Veuillez contacter l\'organisateur.');
        }

        reservation.statut = StatutReservation.ANNULE;
        return await this.reservationRepository.save(reservation);
    }
}
