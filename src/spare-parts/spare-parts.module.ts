import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SparePart } from './entities/spare-part.entity.js';
import { SparePartsController } from './spare-parts.controller.js';
import { SparePartsService } from './spare-parts.service.js';

@Module({
  imports: [TypeOrmModule.forFeature([SparePart])],
  controllers: [SparePartsController],
  providers: [SparePartsService],
})
export class SparePartsModule {}
