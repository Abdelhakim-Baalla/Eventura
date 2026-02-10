import { Controller, Post, Get, Body, Request } from '@nestjs/common';
import { ReservationsService } from './reservations.service';

@Controller('reservations')
export class ReservationsController {
    constructor(private readonly reservationsService: ReservationsService) { }

    @Post()
    async create(@Body('evenementId') evenementId: string, @Request() req) {
        const userId = req.user.id;
        return this.reservationsService.create(evenementId, userId);
    }

    @Get('my')
    async findMy(@Request() req) {
        const userId = req.user.id;
        return this.reservationsService.findMyReservations(userId);
    }
}
