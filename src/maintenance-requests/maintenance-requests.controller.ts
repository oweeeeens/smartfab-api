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
import { MaintenanceRequestsService } from './maintenance-requests.service.js';
import { CreateMaintenanceRequestDto } from './dto/create-maintenance-request.dto.js';
import { UpdateMaintenanceRequestDto } from './dto/update-maintenance-request.dto.js';
import { MaintenanceRequestQueryDto } from './dto/maintenance-request-query.dto.js';

@Controller('maintenance-requests')
export class MaintenanceRequestsController {
  constructor(private readonly requestsService: MaintenanceRequestsService) {}

  // GET /api/v1/maintenance-requests?status=Pending&priority=High
  @Get()
  findAll(@Query() query: MaintenanceRequestQueryDto) {
    return this.requestsService.findAll(query);
  }

  // GET /api/v1/maintenance-requests/{id}
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.requestsService.findOneDetailed(id);
  }

  // POST /api/v1/maintenance-requests -> 201 Created (report an issue)
  @Post()
  @Roles('Operator', 'Supervisor', 'Admin')
  create(
    @Body() dto: CreateMaintenanceRequestDto,
    @CurrentUser() user: AuthUser,
  ) {
    return this.requestsService.create(dto, user.userId);
  }

  // PATCH /api/v1/maintenance-requests/{id} -> assign technician / update status
  @Patch(':id')
  @Roles('Supervisor', 'Technician', 'Admin')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateMaintenanceRequestDto,
  ) {
    return this.requestsService.update(id, dto);
  }

  // DELETE /api/v1/maintenance-requests/{id} -> 204 No Content
  @Delete(':id')
  @Roles('Admin')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.requestsService.remove(id);
  }
}
