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
  Put,
  Query,
} from '@nestjs/common';
import { Roles } from '../common/decorators/roles.decorator.js';
import { MachinesService } from './machines.service.js';
import { CreateMachineDto } from './dto/create-machine.dto.js';
import { ReplaceMachineDto } from './dto/replace-machine.dto.js';
import { UpdateMachineStatusDto } from './dto/update-machine-status.dto.js';
import { MachineQueryDto } from './dto/machine-query.dto.js';

@Controller('machines')
export class MachinesController {
  constructor(private readonly machinesService: MachinesService) {}

  // GET /api/v1/machines?status=Down&lineId=2&page=1&limit=20 (any logged-in user)
  @Get()
  findAll(@Query() query: MachineQueryDto) {
    return this.machinesService.findAll(query);
  }

  // GET /api/v1/machines/{id}
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.machinesService.findOne(id);
  }

  // POST /api/v1/machines -> 201 Created
  @Post()
  @Roles('Admin')
  create(@Body() dto: CreateMachineDto) {
    return this.machinesService.create(dto);
  }

  // PUT /api/v1/machines/{id} -> replace all details
  @Put(':id')
  @Roles('Admin')
  replace(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: ReplaceMachineDto,
  ) {
    return this.machinesService.replace(id, dto);
  }

  // PATCH /api/v1/machines/{id} -> update status only
  @Patch(':id')
  @Roles('Admin', 'Supervisor', 'Technician')
  updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateMachineStatusDto,
  ) {
    return this.machinesService.updateStatus(id, dto);
  }

  // DELETE /api/v1/machines/{id} -> 204 No Content
  @Delete(':id')
  @Roles('Admin')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.machinesService.remove(id);
  }
}
