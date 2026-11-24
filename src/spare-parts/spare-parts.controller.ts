import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { Roles } from '../common/decorators/roles.decorator.js';
import { SparePartsService } from './spare-parts.service.js';
import { CreateSparePartDto } from './dto/create-spare-part.dto.js';
import { UpdateSparePartDto } from './dto/update-spare-part.dto.js';
import { SparePartQueryDto } from './dto/spare-part-query.dto.js';

@Controller('spare-parts')
export class SparePartsController {
  constructor(private readonly partsService: SparePartsService) {}

  // GET /api/v1/spare-parts?lowStock=true&page=1&limit=20
  @Get()
  findAll(@Query() query: SparePartQueryDto) {
    return this.partsService.findAll(query);
  }

  // GET /api/v1/spare-parts/{id}
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.partsService.findOne(id);
  }

  // POST /api/v1/spare-parts -> 201 Created
  @Post()
  @Roles('Admin', 'Supervisor')
  create(@Body() dto: CreateSparePartDto) {
    return this.partsService.create(dto);
  }

  // PATCH /api/v1/spare-parts/{id} -> e.g. restock quantity
  @Patch(':id')
  @Roles('Admin', 'Supervisor')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateSparePartDto,
  ) {
    return this.partsService.update(id, dto);
  }

  // DELETE /api/v1/spare-parts/{id} -> 204 No Content
  @Delete(':id')
  @Roles('Admin')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.partsService.remove(id);
  }
}
