import { Test, TestingModule } from '@nestjs/testing';
import { ReservationsService } from './reservations.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Reservation } from '../users/entities/reservation.entity';
import { Event } from '../users/entities/event.entity';
import { Repository } from 'typeorm';
import { NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import { StatutEvenement } from '../common/enums/statut-evenement.enum';
import { StatutReservation } from '../common/enums/statut-reservation.enum';

describe('ReservationsService', () => {
    let service: ReservationsService;
    let reservationRepository: Repository<Reservation>;
    let eventRepository: Repository<Event>;

    const mockReservationRepository = {
        findOne: jest.fn(),
        count: jest.fn(),
        create: jest.fn(),
        save: jest.fn(),
        findAndCount: jest.fn(),
        find: jest.fn(),
    };

    const mockEventRepository = {
        findOne: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                ReservationsService,
                {
                    provide: getRepositoryToken(Reservation),
                    useValue: mockReservationRepository,
                },
                {
                    provide: getRepositoryToken(Event),
                    useValue: mockEventRepository,
                },
            ],
        }).compile();

        service = module.get<ReservationsService>(ReservationsService);
        reservationRepository = module.get<Repository<Reservation>>(getRepositoryToken(Reservation));
        eventRepository = module.get<Repository<Event>>(getRepositoryToken(Event));
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('create', () => {
        it('should throw NotFoundException if event not found', async () => {
            mockEventRepository.findOne.mockResolvedValue(null);
            await expect(service.create('e1', 'u1')).rejects.toThrow(NotFoundException);
        });

        it('should throw BadRequestException if event is not published', async () => {
            mockEventRepository.findOne.mockResolvedValue({ id: 'e1', statut: StatutEvenement.BROUILLON });
            await expect(service.create('e1', 'u1')).rejects.toThrow(BadRequestException);
        });

        it('should throw ConflictException if user already has a reservation', async () => {
            mockEventRepository.findOne.mockResolvedValue({
                id: 'e1',
                statut: StatutEvenement.PUBLIE,
                dateHeureDebut: new Date(Date.now() + 86400000)
            });
            mockReservationRepository.findOne.mockResolvedValue({ id: 'r1' });
            await expect(service.create('e1', 'u1')).rejects.toThrow(ConflictException);
        });

        it('should throw BadRequestException if event is full', async () => {
            mockEventRepository.findOne.mockResolvedValue({
                id: 'e1',
                statut: StatutEvenement.PUBLIE,
                dateHeureDebut: new Date(Date.now() + 86400000),
                capaciteMax: 10
            });
            mockReservationRepository.findOne.mockResolvedValue(null);
            mockReservationRepository.count.mockResolvedValue(10);
            await expect(service.create('e1', 'u1')).rejects.toThrow(BadRequestException);
        });

        it('should create reservation successfully', async () => {
            const event = {
                id: 'e1',
                statut: StatutEvenement.PUBLIE,
                dateHeureDebut: new Date(Date.now() + 86400000),
                capaciteMax: 10
            };
            mockEventRepository.findOne.mockResolvedValue(event);
            mockReservationRepository.findOne.mockResolvedValue(null);
            mockReservationRepository.count.mockResolvedValue(5);
            mockReservationRepository.create.mockReturnValue({ evenementId: 'e1', utilisateurId: 'u1' });
            mockReservationRepository.save.mockResolvedValue({ id: 'res1' });

            const result = await service.create('e1', 'u1');
            expect(result).toBeDefined();
            expect(mockReservationRepository.save).toHaveBeenCalled();
        });
    });
});
