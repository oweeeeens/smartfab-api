import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto.js';

// PATCH: every field from CreateUserDto becomes optional, with the same validation rules
export class UpdateUserDto extends PartialType(CreateUserDto) {}
