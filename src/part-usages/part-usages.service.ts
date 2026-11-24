import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { PartUsage } from './entities/part-usage.entity.js';
import { SparePart } from '../spare-parts/entities/spare-part.entity.js';
import { MaintenanceRequest } from '../maintenance-requests/entities/maintenance-request.entity.js';
import { MaintenanceRequestsService } from '../maintenance-requests/maintenance-requests.service.js';
import { CreatePartUsageDto } from './dto/create-part-usage.dto.js';

@Injectable()
export class PartUsagesService {
  constructor(
    @InjectRepository(PartUsage)
    private readonly usagesRepository: Repository<PartUsage>,
    private readonly requestsService: MaintenanceRequestsService,
    private readonly dataSource: DataSource,
  ) {}

  /** Parts used in one maintenance request (404 if the request doesn't exist). */
  async findForRequest(requestId: number) {
    await this.requestsService.findOne(requestId);
    return this.usagesRepository.find({
      where: { requestId },
      relations: { part: true },
      order: { usageId: 'ASC' },
    });
  }

  /**
   * Records that a part was used in a repair AND takes it out of stock.
   * Both happen in one transaction: if anything fails, neither is saved.
   */
  async create(requestId: number, dto: CreatePartUsageDto) {
    const usageId = await this.dataSource.transaction(async (manager) => {
      const request = await manager.findOneBy(MaintenanceRequest, {
        requestId,
      });
      if (!request) {
        throw new NotFoundException(
          `No maintenance request exists with ID ${requestId}.`,
        );
      }
      if (request.status === 'Cancelled') {
        throw new BadRequestException(
          'Parts cannot be recorded on a cancelled request.',
        );
      }

      // Lock the part row so two technicians can't take the last unit at the same time
      const part = await manager.findOne(SparePart, {
        where: { partId: dto.partId },
        lock: { mode: 'pessimistic_write' },
      });
      if (!part) {
        throw new NotFoundException(
          `No spare part exists with ID ${dto.partId}.`,
        );
      }
      if (part.quantityOnHand < dto.quantityUsed) {
        throw new BadRequestException(
          `Not enough stock for ${part.partName}: ${part.quantityOnHand} on hand, ${dto.quantityUsed} requested.`,
        );
      }

      part.quantityOnHand -= dto.quantityUsed;
      await manager.save(part);

      const usage = manager.create(PartUsage, {
        requestId,
        partId: dto.partId,
        quantityUsed: dto.quantityUsed,
      });
      return (await manager.save(usage)).usageId;
    });

    return this.usagesRepository.findOne({
      where: { usageId },
      relations: { part: true },
    });
  }
}
