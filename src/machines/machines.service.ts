import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Machine } from './entities/machine.entity.js';
import { ProductionLine } from '../production-lines/entities/production-line.entity.js';
import { CreateMachineDto } from './dto/create-machine.dto.js';
import { ReplaceMachineDto } from './dto/replace-machine.dto.js';
import { UpdateMachineStatusDto } from './dto/update-machine-status.dto.js';
import { MachineQueryDto } from './dto/machine-query.dto.js';

@Injectable()
export class MachinesService {
  constructor(
    @InjectRepository(Machine)
    private readonly machinesRepository: Repository<Machine>,
    @InjectRepository(ProductionLine)
    private readonly linesRepository: Repository<ProductionLine>,
  ) {}

  findAll(query: MachineQueryDto) {
    return this.machinesRepository.find({
      where: {
        ...(query.status && { status: query.status }),
        ...(query.lineId && { lineId: query.lineId }),
      },
      order: { machineId: 'ASC' },
      skip: query.skip,
      take: query.limit,
    });
  }

  async findOne(machineId: number) {
    const machine = await this.machinesRepository.findOneBy({ machineId });
    if (!machine) {
      throw new NotFoundException(`No machine exists with ID ${machineId}.`);
    }
    return machine;
  }

  async create(dto: CreateMachineDto) {
    await this.ensureLineExists(dto.lineId);
    await this.ensureSerialIsFree(dto.serialNumber);
    const machine = this.machinesRepository.create(dto);
    const saved = await this.machinesRepository.save(machine);
    return this.findOne(saved.machineId);
  }

  /** PUT: replaces every field of the machine. */
  async replace(machineId: number, dto: ReplaceMachineDto) {
    const machine = await this.findOne(machineId);
    await this.ensureLineExists(dto.lineId);
    if (dto.serialNumber !== machine.serialNumber) {
      await this.ensureSerialIsFree(dto.serialNumber);
    }
    Object.assign(machine, {
      lineId: dto.lineId,
      machineName: dto.machineName,
      model: dto.model ?? null,
      serialNumber: dto.serialNumber,
      status: dto.status,
      installationDate: dto.installationDate ?? null,
    });
    await this.machinesRepository.save(machine);
    return this.findOne(machineId);
  }

  /** PATCH: changes only the operating status. */
  async updateStatus(machineId: number, dto: UpdateMachineStatusDto) {
    const machine = await this.findOne(machineId);
    machine.status = dto.status;
    await this.machinesRepository.save(machine);
    return machine;
  }

  async remove(machineId: number) {
    const machine = await this.findOne(machineId);
    await this.machinesRepository.remove(machine);
  }

  private async ensureLineExists(lineId: number) {
    if (!(await this.linesRepository.existsBy({ lineId }))) {
      throw new NotFoundException(
        `No production line exists with ID ${lineId}.`,
      );
    }
  }

  private async ensureSerialIsFree(serialNumber: string) {
    if (await this.machinesRepository.existsBy({ serialNumber })) {
      throw new ConflictException(
        `A machine with serial number ${serialNumber} is already registered.`,
      );
    }
  }
}
