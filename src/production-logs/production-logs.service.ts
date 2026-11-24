import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductionLog } from './entities/production-log.entity.js';
import { Machine } from '../machines/entities/machine.entity.js';
import { CreateProductionLogDto } from './dto/create-production-log.dto.js';
import { UpdateProductionLogDto } from './dto/update-production-log.dto.js';
import { ProductionLogQueryDto } from './dto/production-log-query.dto.js';
import type { AuthUser } from '../common/decorators/current-user.decorator.js';

@Injectable()
export class ProductionLogsService {
  constructor(
    @InjectRepository(ProductionLog)
    private readonly logsRepository: Repository<ProductionLog>,
    @InjectRepository(Machine)
    private readonly machinesRepository: Repository<Machine>,
  ) {}

  findAll(query: ProductionLogQueryDto) {
    return this.logsRepository.find({
      where: {
        ...(query.machineId && { machineId: query.machineId }),
        ...(query.operatorId && { operatorId: query.operatorId }),
        ...(query.shiftDate && { shiftDate: query.shiftDate }),
        ...(query.shift && { shift: query.shift }),
      },
      order: { shiftDate: 'DESC', logId: 'DESC' },
      skip: query.skip,
      take: query.limit,
    });
  }

  async findOne(logId: number) {
    const log = await this.logsRepository.findOneBy({ logId });
    if (!log) {
      throw new NotFoundException(`No production log exists with ID ${logId}.`);
    }
    return log;
  }

  /** Submit a shift log. The operator is the logged-in user. */
  async create(dto: CreateProductionLogDto, operatorId: number) {
    await this.ensureMachineExists(dto.machineId);
    const log = this.logsRepository.create({ ...dto, operatorId });
    this.ensureDefectsWithinOutput(log);
    const saved = await this.logsRepository.save(log);
    return this.findOne(saved.logId);
  }

  async update(logId: number, dto: UpdateProductionLogDto, user: AuthUser) {
    const log = await this.findOne(logId);

    // Operators may only correct their own logs; supervisors/admins may correct any
    if (user.role === 'Operator' && log.operatorId !== user.userId) {
      throw new ForbiddenException('Operators can only edit their own logs.');
    }
    if (dto.machineId) await this.ensureMachineExists(dto.machineId);

    Object.assign(log, dto);
    this.ensureDefectsWithinOutput(log);
    await this.logsRepository.save(log);
    return this.findOne(logId);
  }

  async remove(logId: number) {
    const log = await this.findOne(logId);
    await this.logsRepository.remove(log);
  }

  private async ensureMachineExists(machineId: number) {
    if (!(await this.machinesRepository.existsBy({ machineId }))) {
      throw new NotFoundException(`No machine exists with ID ${machineId}.`);
    }
  }

  private ensureDefectsWithinOutput(log: ProductionLog) {
    if ((log.unitsDefective ?? 0) > (log.unitsProduced ?? 0)) {
      throw new BadRequestException(
        'unitsDefective cannot be greater than unitsProduced.',
      );
    }
  }
}
