import { Test, TestingModule } from '@nestjs/testing';
import { EventsService } from './events.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Event } from '../users/entities/event.entity';
import { Category } from '../users/entities/category.entity';
import { Reservation } from '../users/entities/reservation.entity';
import { Repository } from 'typeorm';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { StatutEvenement } from '../common/enums/statut-evenement.enum';

describe('EventsService', () => {
    let service: EventsService;
    let eventRepository: Repository<Event>;
    let categoryRepository: Repository<Category>;

    const mockEventRepository = {
        find: jest.fn(),
        findOne: jest.fn(),
        create: jest.fn(),
        save: jest.fn(),
        remove: jest.fn(),
    };

    const mockCategoryRepository = {
        find: jest.fn(),
        findOne: jest.fn(),
        save: jest.fn(),
        create: jest.fn(),
    };

    const mockReservationRepository = {
        find: jest.fn(),
        count: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                EventsService,
                {
                    provide: getRepositoryToken(Event),
                    useValue: mockEventRepository,
                },
                {
                    provide: getRepositoryToken(Category),
                    useValue: mockCategoryRepository,
                },
                {
                    provide: getRepositoryToken(Reservation),
                    useValue: mockReservationRepository,
                },
            ],
        }).compile();

        service = module.get<EventsService>(EventsService);
        eventRepository = module.get<Repository<Event>>(getRepositoryToken(Event));
        categoryRepository = module.get<Repository<Category>>(getRepositoryToken(Category));
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('create', () => {
        it('should throw NotFoundException if category does not exist', async () => {
            mockCategoryRepository.findOne.mockResolvedValue(null);
            const dto = { titre: 'Test', categorieId: 'invalid' } as any;
            await expect(service.create(dto, 'user1')).rejects.toThrow(NotFoundException);
        });

        it('should throw BadRequestException if end date is before start date', async () => {
            mockCategoryRepository.findOne.mockResolvedValue({ id: 'cat1' });
            const dto = {
                titre: 'Test',
                categorieId: 'cat1',
                dateHeureDebut: '2025-01-02',
                dateHeureFin: '2025-01-01',
            } as any;
            await expect(service.create(dto, 'user1')).rejects.toThrow(BadRequestException);
        });

        it('should create an event successfully', async () => {
            const category = { id: 'cat1' };
            const dto = {
                titre: 'Test',
                categorieId: 'cat1',
                dateHeureDebut: '2025-01-01',
                dateHeureFin: '2025-01-02',
                capaciteMax: 100,
            } as any;
            mockCategoryRepository.findOne.mockResolvedValue(category);
            mockEventRepository.create.mockReturnValue(dto);
            mockEventRepository.save.mockResolvedValue({ id: 'event1', ...dto });

            const result = await service.create(dto, 'user1');
            expect(result).toBeDefined();
            expect(mockEventRepository.save).toHaveBeenCalled();
        });
    });

    describe('publish', () => {
        it('should throw NotFoundException if event not found', async () => {
            mockEventRepository.findOne.mockResolvedValue(null);
            await expect(service.publish('1')).rejects.toThrow(NotFoundException);
        });

        it('should throw BadRequestException if not a draft', async () => {
            mockEventRepository.findOne.mockResolvedValue({ id: '1', statut: StatutEvenement.PUBLIE });
            await expect(service.publish('1')).rejects.toThrow(BadRequestException);
        });

        it('should set status to published', async () => {
            const event = { id: '1', statut: StatutEvenement.BROUILLON };
            mockEventRepository.findOne.mockResolvedValue(event);
            mockEventRepository.save.mockImplementation(e => Promise.resolve(e));

            const result = await service.publish('1');
            expect(result.statut).toBe(StatutEvenement.PUBLIE);
        });
    });

    describe('getStats', () => {
        it('should calculate stats correctly', async () => {
            const now = new Date();
            const events = [
                {
                    id: 'e1',
                    prix: 50,
                    capaciteMax: 100,
                    dateHeureDebut: new Date(now.getTime() + 86400000), // Demain
                    reservations: [
                        { statut: 'CONFIRME' },
                        { statut: 'EN_ATTENTE' },
                    ],
                },
            ];
            mockEventRepository.find.mockResolvedValue(events);

            const stats = await service.getStats('admin1');
            expect(stats.totalEvents).toBe(1);
            expect(stats.upcomingEvents).toBe(1);
            expect(stats.totalConfirmed).toBe(1);
            expect(stats.totalRevenue).toBe(50);
            expect(stats.occupancyRate).toBe(1); // 1/100
        });
    });

    describe('findOne', () => {
        it('should calculate remaining places correctly', async () => {
            const event = {
                id: 'e1',
                capaciteMax: 10,
                reservations: [
                    { statut: 'CONFIRME' },
                    { statut: 'CONFIRME' },
                    { statut: 'EN_ATTENTE' },
                ],
            };
            mockEventRepository.findOne.mockResolvedValue(event);

            const result = await service.findOne('e1');
            expect(result.placesRestantes).toBe(8); // 10 - 2
        });
    });
});
