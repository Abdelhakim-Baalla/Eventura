import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
} from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../common/enums/role.enum';
import { Public } from '../common/decorators/public.decorator';

@Controller('categories')
export class CategoriesController {
    constructor(private readonly categoriesService: CategoriesService) { }

    @Roles(Role.ADMIN, Role.SUPER_ADMIN)
    @Post()
    create(@Body() createCategoryDto: { nom: string; description?: string }) {
        return this.categoriesService.create(createCategoryDto);
    }

    @Public()
    @Get()
    findAll() {
        return this.categoriesService.findAll();
    }

    @Public()
    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.categoriesService.findOne(id);
    }

    @Roles(Role.ADMIN, Role.SUPER_ADMIN)
    @Patch(':id')
    update(
        @Param('id') id: string,
        @Body() updateCategoryDto: { nom?: string; description?: string },
    ) {
        return this.categoriesService.update(id, updateCategoryDto);
    }

    @Roles(Role.ADMIN, Role.SUPER_ADMIN)
    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.categoriesService.remove(id);
    }
}
