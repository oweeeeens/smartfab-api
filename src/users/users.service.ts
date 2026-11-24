import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import bcrypt from 'bcryptjs';
import { User } from './entities/user.entity.js';
import { CreateUserDto } from './dto/create-user.dto.js';
import { UpdateUserDto } from './dto/update-user.dto.js';
import type { UserRole } from '../common/constants.js';

const SALT_ROUNDS = 10;

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  findAll(role?: UserRole) {
    return this.usersRepository.find({
      where: role ? { role } : {},
      order: { userId: 'ASC' },
    });
  }

  async findOne(userId: number) {
    const user = await this.usersRepository.findOneBy({ userId });
    if (!user) throw new NotFoundException(`No user exists with ID ${userId}.`);
    return user;
  }

  /** Used only by login: loads the password hash, which is hidden by default. */
  findByEmailWithPassword(email: string) {
    return this.usersRepository
      .createQueryBuilder('user')
      .addSelect('user.passwordHash')
      .where('user.email = :email', { email })
      .getOne();
  }

  async create(dto: CreateUserDto) {
    await this.ensureEmailIsFree(dto.email);
    const { password, ...rest } = dto;
    const user = this.usersRepository.create({
      ...rest,
      passwordHash: await bcrypt.hash(password, SALT_ROUNDS),
    });
    const saved = await this.usersRepository.save(user);
    return this.findOne(saved.userId); // re-read so the hash is not returned
  }

  async update(userId: number, dto: UpdateUserDto) {
    const user = await this.findOne(userId);
    if (dto.email && dto.email !== user.email) {
      await this.ensureEmailIsFree(dto.email);
    }
    const { password, ...rest } = dto;
    Object.assign(user, rest);
    if (password) {
      user.passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
    }
    await this.usersRepository.save(user);
    return this.findOne(userId);
  }

  async remove(userId: number) {
    const user = await this.findOne(userId);
    await this.usersRepository.remove(user);
  }

  private async ensureEmailIsFree(email: string) {
    if (await this.usersRepository.existsBy({ email })) {
      throw new ConflictException(`${email} is already registered.`);
    }
  }
}
