import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import bcrypt from 'bcryptjs';
import { UsersService } from '../users/users.service.js';
import { LoginDto } from './dto/login.dto.js';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  /** Verifies email + password and returns a signed JWT. */
  async login(dto: LoginDto) {
    const user = await this.usersService.findByEmailWithPassword(dto.email);

    // Same message for "no such user" and "wrong password" so attackers can't probe emails
    const passwordOk = user
      ? await bcrypt.compare(dto.password, user.passwordHash)
      : false;
    if (!user || !passwordOk) {
      throw new UnauthorizedException('Invalid email or password.');
    }

    const payload = { sub: user.userId, email: user.email, role: user.role };
    return {
      accessToken: await this.jwtService.signAsync(payload),
      tokenType: 'Bearer',
      user: {
        userId: user.userId,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
      },
    };
  }

  /** Returns the full profile of the logged-in user. */
  profile(userId: number) {
    return this.usersService.findOne(userId);
  }
}
