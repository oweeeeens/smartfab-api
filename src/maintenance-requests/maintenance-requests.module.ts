import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MaintenanceRequest } from './entities/maintenance-request.entity.js';
import { Machine } from '../machines/entities/machine.entity.js';
import { User } from '../users/entities/user.entity.js';
import { MaintenanceRequestsController } from './maintenance-requests.controller.js';
import { MaintenanceRequestsService } from './maintenance-requests.service.js';

@Module({
  imports: [TypeOrmModule.forFeature([MaintenanceRequest, Machine, User])],
  controllers: [MaintenanceRequestsController],
  providers: [MaintenanceRequestsService],
  exports: [MaintenanceRequestsService],
})
export class MaintenanceRequestsModule {}
