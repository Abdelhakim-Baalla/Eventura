import { Controller, Post, Put, Body, Param, Request, Get, Patch, Delete } from '@nestjs/common';
import { EventsService } from './events.service';
import { CreateEventDto } from './dto/create-event.dto';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../common/enums/role.enum';
import { Public } from '../common/decorators/public.decorator';

@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) { }

  @Get('seed')
  async seedCategories() {
    return this.eventsService.seedCategories();
  }

  @Get('categories')
  async getCategories() {
    return this.eventsService.findAllCategories();
  }

  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @Get('admin/stats')
  async getStats(@Request() req) {
    const adminId = req.user.id;
    return this.eventsService.getStats(adminId);
  }

  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @Get('admin')
  async findAllForAdmin(@Request() req) {
    const userId = req.user.id;
    return this.eventsService.findAllForAdmin(userId);
  }

  @Public()
  @Get()
  async findAllPublished() {
    return this.eventsService.findAllPublished();
  }

  @Public()
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.eventsService.findOne(id);
  }

  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @Post()
  async create(@Body() createEventDto: CreateEventDto, @Request() req) {
    const createurId = req.user.id;
    return this.eventsService.create(createEventDto, createurId);
  }

  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateEventDto: Partial<CreateEventDto>,
  ) {
    return this.eventsService.update(id, updateEventDto);
  }

  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @Patch(':id/publish')
  async publish(@Param('id') id: string) {
    return this.eventsService.publish(id);
  }

  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @Patch(':id/cancel')
  async cancel(@Param('id') id: string) {
    return this.eventsService.cancel(id);
  }

  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.eventsService.remove(id);
  }
}
