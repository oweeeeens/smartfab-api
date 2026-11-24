import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MaintenanceRequest } from './entities/maintenance-request.entity.js';
import { Machine } from '../machines/entities/machine.entity.js';
import { User } from '../users/entities/user.entity.js';
import { CreateMaintenanceRequestDto } from './dto/create-maintenance-request.dto.js';
import { UpdateMaintenanceRequestDto } from './dto/update-maintenance-request.dto.js';
import { MaintenanceRequestQueryDto } from './dto/maintenance-request-query.dto.js';

@Injectable()
export class MaintenanceRequestsService {
  constructor(
    @InjectRepository(MaintenanceRequest)
    private readonly requestsRepository: Repository<MaintenanceRequest>,
    @InjectRepository(Machine)
    private readonly machinesRepository: Repository<Machine>,
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  findAll(query: MaintenanceRequestQueryDto) {
    return this.requestsRepository.find({
      where: {
        ...(query.status && { status: query.status }),
        ...(query.priority && { priority: query.priority }),
        ...(query.machineId && { machineId: query.machineId }),
        ...(query.assignedTo && { assignedTo: query.assignedTo }),
      },
      order: { requestId: 'DESC' }, // newest first
      skip: query.skip,
      take: query.limit,
    });
  }

  async findOne(requestId: number) {
    const request = await this.requestsRepository.findOneBy({ requestId });
    if (!request) {
      throw new NotFoundException(
        `No maintenance request exists with ID ${requestId}.`,
      );
    }
    return request;
  }

  /** Report a machine issue. reportedBy comes from the logged-in user. */
  async create(dto: CreateMaintenanceRequestDto, reportedBy: number) {
    if (
      !(await this.machinesRepository.existsBy({ machineId: dto.machineId }))
    ) {
      throw new NotFoundException(
        `No machine exists with ID ${dto.machineId}.`,
      );
    }
    const request = this.requestsRepository.create({
      machineId: dto.machineId,
      issueDescription: dto.issueDescription,
      priority: dto.priority,
      reportedBy,
      status: 'Pending',
    });
    const saved = await this.requestsRepository.save(request);
    return this.findOne(saved.requestId);
  }

  /** Assign a technician and/or update the status, priority or description. */
  async update(requestId: number, dto: UpdateMaintenanceRequestDto) {
    const request = await this.findOne(requestId);

    if (dto.assignedTo !== undefined && dto.assignedTo !== null) {
      await this.ensureIsTechnician(dto.assignedTo);
    }

    Object.assign(request, dto);

    // Business rule: DateCompleted is set when the request is completed, cleared otherwise
    if (dto.status) {
      request.dateCompleted = dto.status === 'Completed' ? new Date() : null;
    }

    await this.requestsRepository.save(request);
    return this.findOne(requestId);
  }

  /** Deletes the request; its PartUsage rows are removed by ON DELETE CASCADE. */
  async remove(requestId: number) {
    const request = await this.findOne(requestId);
    await this.requestsRepository.remove(request);
  }

  private async ensureIsTechnician(userId: number) {
    const user = await this.usersRepository.findOneBy({ userId });
    if (!user) throw new NotFoundException(`No user exists with ID ${userId}.`);
    if (user.role !== 'Technician') {
      throw new BadRequestException(
        `User ${userId} has the role ${user.role}; only Technicians can be assigned.`,
      );
    }
  }
}
