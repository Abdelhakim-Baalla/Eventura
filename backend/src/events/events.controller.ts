import { Controller, Post, Put, Body, Param, Request, Get } from '@nestjs/common';
import { EventsService } from './events.service';
import { CreateEventDto } from './dto/create-event.dto';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../common/enums/role.enum';

@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) { }

  @Get('categories')
  async getCategories() {
    return this.eventsService.findAllCategories();
  }

  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @Post()
  async create(@Body() createEventDto: CreateEventDto, @Request() req) {
    const createurId = req.user.sub;
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
}
