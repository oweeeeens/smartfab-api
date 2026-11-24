import {
  IsEmail,
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { USER_ROLES } from '../../common/constants.js';
import type { UserRole } from '../../common/constants.js';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  firstName: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  lastName: string;

  @IsEmail({}, { message: 'email must be a valid email address' })
  @MaxLength(100)
  email: string;

  @IsString()
  @MinLength(8, { message: 'password must be at least 8 characters' })
  @MaxLength(72) // bcrypt only uses the first 72 bytes
  password: string;

  @IsIn(USER_ROLES, {
    message: `role must be one of: ${USER_ROLES.join(', ')}`,
  })
  role: UserRole;

  @IsOptional()
  @Matches(/^[0-9+\- ]{7,15}$/, {
    message: 'contactNumber must be 7-15 digits',
  })
  contactNumber?: string;
}
