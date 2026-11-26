import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductionLine } from './entities/production-line.entity.js';

@Injectable()
export class ProductionLinesService {
  constructor(
    @InjectRepository(ProductionLine)
    private readonly linesRepository: Repository<ProductionLine>,
  ) {}

  /** All production lines, used for machine forms and filters. */
  findAll() {
    return this.linesRepository.find({ order: { lineName: 'ASC' } });
  }
}
