import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SparePart } from './entities/spare-part.entity.js';
import { CreateSparePartDto } from './dto/create-spare-part.dto.js';
import { UpdateSparePartDto } from './dto/update-spare-part.dto.js';
import { SparePartQueryDto } from './dto/spare-part-query.dto.js';

@Injectable()
export class SparePartsService {
  constructor(
    @InjectRepository(SparePart)
    private readonly partsRepository: Repository<SparePart>,
  ) {}

  findAll(query: SparePartQueryDto) {
    const qb = this.partsRepository
      .createQueryBuilder('part')
      .orderBy('part.partId', 'ASC')
      .skip(query.skip)
      .take(query.limit);
    if (query.lowStock === true) {
      qb.where('part.quantityOnHand <= part.reorderLevel');
    }
    return qb.getMany();
  }

  async findOne(partId: number) {
    const part = await this.partsRepository.findOneBy({ partId });
    if (!part) {
      throw new NotFoundException(`No spare part exists with ID ${partId}.`);
    }
    return part;
  }

  async create(dto: CreateSparePartDto) {
    await this.ensurePartNumberIsFree(dto.partNumber);
    const saved = await this.partsRepository.save(
      this.partsRepository.create(dto),
    );
    return this.findOne(saved.partId);
  }

  async update(partId: number, dto: UpdateSparePartDto) {
    const part = await this.findOne(partId);
    if (dto.partNumber && dto.partNumber !== part.partNumber) {
      await this.ensurePartNumberIsFree(dto.partNumber);
    }
    Object.assign(part, dto);
    await this.partsRepository.save(part);
    return this.findOne(partId);
  }

  async remove(partId: number) {
    const part = await this.findOne(partId);
    await this.partsRepository.remove(part);
  }

  private async ensurePartNumberIsFree(partNumber: string) {
    if (await this.partsRepository.existsBy({ partNumber })) {
      throw new ConflictException(
        `A spare part with part number ${partNumber} already exists.`,
      );
    }
  }
}
