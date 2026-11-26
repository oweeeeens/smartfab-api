import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductionLine } from './entities/production-line.entity.js';
import { ProductionLinesController } from './production-lines.controller.js';
import { ProductionLinesService } from './production-lines.service.js';

@Module({
  imports: [TypeOrmModule.forFeature([ProductionLine])],
  controllers: [ProductionLinesController],
  providers: [ProductionLinesService],
})
export class ProductionLinesModule {}
