import { Controller, Get } from '@nestjs/common';
import { ProductionLinesService } from './production-lines.service.js';

@Controller('production-lines')
export class ProductionLinesController {
  constructor(private readonly linesService: ProductionLinesService) {}

  // GET /api/v1/production-lines (any logged-in user)
  @Get()
  findAll() {
    return this.linesService.findAll();
  }
}
