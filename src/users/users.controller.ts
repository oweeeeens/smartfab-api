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
import { UserQueryDto } from './dto/user-query.dto.js';
import { UsersService } from './users.service.js';
import { CreateUserDto } from './dto/create-user.dto.js';
import { UpdateUserDto } from './dto/update-user.dto.js';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // GET /api/v1/users?role=Technician&page=1&limit=20
  @Get()
  @Roles('Admin', 'Manager', 'Supervisor')
  findAll(@Query() query: UserQueryDto) {
    return this.usersService.findAll(query);
  }

  // GET /api/v1/users/{id}
  @Get(':id')
  @Roles('Admin', 'Manager', 'Supervisor')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.findOne(id);
  }

  // POST /api/v1/users -> 201 Created
  @Post()
  @Roles('Admin')
  create(@Body() dto: CreateUserDto) {
    return this.usersService.create(dto);
  }

  // PATCH /api/v1/users/{id}
  @Patch(':id')
  @Roles('Admin')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateUserDto) {
    return this.usersService.update(id, dto);
  }

  // DELETE /api/v1/users/{id} -> 204 No Content
  @Delete(':id')
  @Roles('Admin')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.remove(id);
  }
}
