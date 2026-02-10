import { Controller, Post, Get, Body, Request, Patch, Param } from '@nestjs/common';
import { ReservationsService } from './reservations.service';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../common/enums/role.enum';
import { StatutReservation } from '../common/enums/statut-reservation.enum';

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

    @Roles(Role.ADMIN, Role.SUPER_ADMIN)
    @Get('admin')
    async findAllForAdmin(@Request() req) {
        const adminId = req.user.id;
        return this.reservationsService.findAllForAdmin(adminId);
    }

    @Roles(Role.ADMIN, Role.SUPER_ADMIN)
    @Patch(':id/status')
    async updateStatus(
        @Param('id') id: string,
        @Body('statut') statut: StatutReservation,
        @Request() req
    ) {
        const adminId = req.user.id;
        return this.reservationsService.updateStatus(id, statut, adminId);
    }
}
