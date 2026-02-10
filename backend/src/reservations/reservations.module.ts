import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReservationsService } from './reservations.service';
import { ReservationsController } from './reservations.controller';
import { Reservation } from '../users/entities/reservation.entity';
import { Event } from '../users/entities/event.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Reservation, Event])],
    controllers: [ReservationsController],
    providers: [ReservationsService],
    exports: [ReservationsService],
})
export class ReservationsModule { }
