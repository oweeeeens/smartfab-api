import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductionLog } from './entities/production-log.entity.js';
import { Machine } from '../machines/entities/machine.entity.js';
import { ProductionLogsController } from './production-logs.controller.js';
import { ProductionLogsService } from './production-logs.service.js';

@Module({
  imports: [TypeOrmModule.forFeature([ProductionLog, Machine])],
  controllers: [ProductionLogsController],
  providers: [ProductionLogsService],
})
export class ProductionLogsModule {}
