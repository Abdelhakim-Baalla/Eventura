import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../src/users/entities/user.entity';
import { Role } from '../src/common/enums/role.enum';
import { Repository } from 'typeorm';

describe('Eventura Flow (e2e)', () => {
    let app: INestApplication;
    let userRepository: Repository<User>;

    jest.setTimeout(60000);

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
        userRepository = moduleFixture.get<Repository<User>>(getRepositoryToken(User));
        await app.init();
    });

    afterAll(async () => {
        if (app) await app.close();
    });

    let userToken: string;
    let adminToken: string;
    let categoryId: string;
    let eventId: string;

    const testUser = {
        email: `user_${Date.now()}@test.com`,
        password: 'Password123!',
        nom: 'User',
        prenom: 'Test',
        telephone: '0601020304'
    };

    const testAdmin = {
        email: `admin_${Date.now()}@test.com`,
        password: 'AdminPassword123!',
        nom: 'Admin',
        prenom: 'System',
        telephone: '0600000000'
    };

    it('Complete Success Scenario Flow', async () => {
        // 1. Register Participant
        const regRes = await request(app.getHttpServer())
            .post('/auth/register')
            .send(testUser);
        expect(regRes.status).toBe(201);

        // 2. Login Participant
        const loginRes = await request(app.getHttpServer())
            .post('/auth/login')
            .send({ email: testUser.email, password: testUser.password });
        expect(loginRes.status).toBe(201);
        userToken = loginRes.body.access_token;

        // 3. Setup Admin
        const regAdminRes = await request(app.getHttpServer())
            .post('/auth/register')
            .send(testAdmin);
        expect(regAdminRes.status).toBe(201);

        const user = await userRepository.findOne({ where: { email: testAdmin.email } });
        user.role = Role.ADMIN;
        await userRepository.save(user);

        const loginAdminRes = await request(app.getHttpServer())
            .post('/auth/login')
            .send({ email: testAdmin.email, password: testAdmin.password });
        expect(loginAdminRes.status).toBe(201);
        adminToken = loginAdminRes.body.access_token;

        // 4. Admin creates category
        const catRes = await request(app.getHttpServer())
            .post('/categories')
            .set('Authorization', `Bearer ${adminToken}`)
            .send({ nom: `Cat_${Date.now()}` });
        expect(catRes.status).toBe(201);
        categoryId = catRes.body.id;

        // 5. Admin creates event
        const eventRes = await request(app.getHttpServer())
            .post('/events')
            .set('Authorization', `Bearer ${adminToken}`)
            .send({
                titre: 'E2E Event Test',
                description: 'E2E description',
                dateHeureDebut: new Date(Date.now() + 86400000).toISOString(),
                dateHeureFin: new Date(Date.now() + 172800000).toISOString(),
                lieu: 'E2E Location',
                capaciteMax: 10,
                prix: 10,
                categorieId: categoryId
            });

        if (eventRes.status !== 201) {
            console.error('Event Creation Failed:', eventRes.body);
        }
        expect(eventRes.status).toBe(201);
        eventId = eventRes.body.id;

        // 6. Admin publishes event
        const pubRes = await request(app.getHttpServer())
            .patch(`/events/${eventId}/publish`)
            .set('Authorization', `Bearer ${adminToken}`);
        expect(pubRes.status).toBe(200);

        // 7. User makes reservation
        const reservRes = await request(app.getHttpServer())
            .post('/reservations')
            .set('Authorization', `Bearer ${userToken}`)
            .send({ evenementId: eventId });
        expect(reservRes.status).toBe(201);

        // 8. Admin confirms reservation
        const adminResList = await request(app.getHttpServer())
            .get('/reservations/admin')
            .set('Authorization', `Bearer ${adminToken}`);
        expect(adminResList.status).toBe(200);

        const reservation = adminResList.body.find((r: any) => r.evenement.id === eventId);
        expect(reservation).toBeDefined();

        const confRes = await request(app.getHttpServer())
            .patch(`/reservations/${reservation.id}/status`)
            .set('Authorization', `Bearer ${adminToken}`)
            .send({ statut: 'CONFIRME' });
        expect(confRes.status).toBe(200);
    });
});
