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
import { CurrentUser } from '../common/decorators/current-user.decorator.js';
import type { AuthUser } from '../common/decorators/current-user.decorator.js';
import { ProductionLogsService } from './production-logs.service.js';
import { CreateProductionLogDto } from './dto/create-production-log.dto.js';
import { UpdateProductionLogDto } from './dto/update-production-log.dto.js';
import { ProductionLogQueryDto } from './dto/production-log-query.dto.js';

@Controller('production-logs')
export class ProductionLogsController {
  constructor(private readonly logsService: ProductionLogsService) {}

  // GET /api/v1/production-logs?machineId=4&shift=Morning
  @Get()
  findAll(@Query() query: ProductionLogQueryDto) {
    return this.logsService.findAll(query);
  }

  // GET /api/v1/production-logs/{id}
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.logsService.findOneDetailed(id);
  }

  // POST /api/v1/production-logs -> 201 Created (operators submit their shift)
  @Post()
  @Roles('Operator')
  create(@Body() dto: CreateProductionLogDto, @CurrentUser() user: AuthUser) {
    return this.logsService.create(dto, user.userId);
  }

  // PATCH /api/v1/production-logs/{id} -> correct a log
  @Patch(':id')
  @Roles('Operator', 'Supervisor', 'Admin')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateProductionLogDto,
    @CurrentUser() user: AuthUser,
  ) {
    return this.logsService.update(id, dto, user);
  }

  // DELETE /api/v1/production-logs/{id} -> 204 No Content
  @Delete(':id')
  @Roles('Supervisor', 'Admin')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.logsService.remove(id);
  }
}
