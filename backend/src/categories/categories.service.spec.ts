import { Test, TestingModule } from '@nestjs/testing';
import { CategoriesService } from './categories.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Category } from '../users/entities/category.entity';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';

describe('CategoriesService', () => {
    let service: CategoriesService;
    let repository: Repository<Category>;

    const mockRepository = {
        find: jest.fn(),
        findOne: jest.fn(),
        create: jest.fn(),
        save: jest.fn(),
        remove: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                CategoriesService,
                {
                    provide: getRepositoryToken(Category),
                    useValue: mockRepository,
                },
            ],
        }).compile();

        service = module.get<CategoriesService>(CategoriesService);
        repository = module.get<Repository<Category>>(getRepositoryToken(Category));
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('findAll', () => {
        it('should return an array of categories', async () => {
            mockRepository.find.mockResolvedValue([{ id: '1', nom: 'Cat1' }]);
            const result = await service.findAll();
            expect(result).toHaveLength(1);
            expect(result[0].nom).toBe('Cat1');
        });
    });

    describe('remove', () => {
        it('should throw NotFoundException if category not found', async () => {
            mockRepository.findOne.mockResolvedValue(null);
            await expect(service.remove('1')).rejects.toThrow(NotFoundException);
        });

        it('should remove category if found', async () => {
            mockRepository.findOne.mockResolvedValue({ id: '1' });
            await service.remove('1');
            expect(mockRepository.remove).toHaveBeenCalled();
        });
    });
});
