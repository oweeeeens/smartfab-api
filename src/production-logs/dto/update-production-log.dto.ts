import { PartialType } from '@nestjs/mapped-types';
import { CreateProductionLogDto } from './create-production-log.dto.js';

// PATCH: correct any field of a log (e.g. a wrong unit count)
export class UpdateProductionLogDto extends PartialType(
  CreateProductionLogDto,
) {}
