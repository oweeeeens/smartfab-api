import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PartUsage } from './entities/part-usage.entity.js';
import { MaintenanceRequestsModule } from '../maintenance-requests/maintenance-requests.module.js';
import { PartUsagesController } from './part-usages.controller.js';
import { PartUsagesService } from './part-usages.service.js';

@Module({
  imports: [TypeOrmModule.forFeature([PartUsage]), MaintenanceRequestsModule],
  controllers: [PartUsagesController],
  providers: [PartUsagesService],
})
export class PartUsagesModule {}
