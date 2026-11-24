import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { Roles } from '../common/decorators/roles.decorator.js';
import { PartUsagesService } from './part-usages.service.js';
import { CreatePartUsageDto } from './dto/create-part-usage.dto.js';

// Nested resource: part usages always belong to one maintenance request
@Controller('maintenance-requests/:id/part-usages')
export class PartUsagesController {
  constructor(private readonly usagesService: PartUsagesService) {}

  // GET /api/v1/maintenance-requests/{id}/part-usages
  @Get()
  findForRequest(@Param('id', ParseIntPipe) requestId: number) {
    return this.usagesService.findForRequest(requestId);
  }

  // POST /api/v1/maintenance-requests/{id}/part-usages -> 201 Created
  @Post()
  @Roles('Technician', 'Supervisor', 'Admin')
  create(
    @Param('id', ParseIntPipe) requestId: number,
    @Body() dto: CreatePartUsageDto,
  ) {
    return this.usagesService.create(requestId, dto);
  }
}
