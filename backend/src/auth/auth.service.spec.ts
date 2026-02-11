import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { ConflictException, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

jest.mock('bcrypt');

describe('AuthService', () => {
    let service: AuthService;
    let userRepository: Repository<User>;
    let jwtService: JwtService;

    const mockUserRepository = {
        findOne: jest.fn(),
        create: jest.fn(),
        save: jest.fn(),
    };

    const mockJwtService = {
        signAsync: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AuthService,
                {
                    provide: getRepositoryToken(User),
                    useValue: mockUserRepository,
                },
                {
                    provide: JwtService,
                    useValue: mockJwtService,
                },
            ],
        }).compile();

        service = module.get<AuthService>(AuthService);
        userRepository = module.get<Repository<User>>(getRepositoryToken(User));
        jwtService = module.get<JwtService>(JwtService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('register', () => {
        it('should throw ConflictException if email exists', async () => {
            mockUserRepository.findOne.mockResolvedValue({ id: 'u1' });
            await expect(service.register({ email: 'test@test.com', password: '123' } as any)).rejects.toThrow(ConflictException);
        });

        it('should register successfully', async () => {
            mockUserRepository.findOne.mockResolvedValue(null);
            (bcrypt.hash as jest.Mock).mockResolvedValue('hashed');
            mockUserRepository.create.mockReturnValue({ email: 'test@test.com' });
            mockUserRepository.save.mockResolvedValue({ id: 'u1' });

            const result = await service.register({ email: 'test@test.com', password: '123' } as any);
            expect(result.message).toBe('Inscription réussie');
            expect(mockUserRepository.save).toHaveBeenCalled();
        });
    });

    describe('login', () => {
        it('should throw UnauthorizedException if user not found', async () => {
            mockUserRepository.findOne.mockResolvedValue(null);
            await expect(service.login({ email: 'test@test.com', password: '123' } as any)).rejects.toThrow(UnauthorizedException);
        });

        it('should throw UnauthorizedException if password incorrect', async () => {
            mockUserRepository.findOne.mockResolvedValue({ id: 'u1', password: 'hashed' });
            (bcrypt.compare as jest.Mock).mockResolvedValue(false);
            await expect(service.login({ email: 'test@test.com', password: '123' } as any)).rejects.toThrow(UnauthorizedException);
        });

        it('should return token if login successful', async () => {
            const user = { id: 'u1', email: 'test@test.com', password: 'hashed', role: 'PARTICIPANT' };
            mockUserRepository.findOne.mockResolvedValue(user);
            (bcrypt.compare as jest.Mock).mockResolvedValue(true);
            mockJwtService.signAsync.mockResolvedValue('token123');

            const result = await service.login({ email: 'test@test.com', password: '123' } as any);
            expect(result.access_token).toBe('token123');
            expect(result.user.email).toBe('test@test.com');
        });
    });
});
