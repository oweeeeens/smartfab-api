import { Type } from 'class-transformer';
import {
  IsDateString,
  IsIn,
  IsInt,
  IsOptional,
  IsPositive,
} from 'class-validator';
import { SHIFTS } from '../../common/constants.js';
import type { Shift } from '../../common/constants.js';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto.js';

/** GET /production-logs?machineId=4&shiftDate=2026-10-24&shift=Morning */
export class ProductionLogQueryDto extends PaginationQueryDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  machineId?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  operatorId?: number;

  @IsOptional()
  @IsDateString({ strict: true }, { message: 'shiftDate must be YYYY-MM-DD' })
  shiftDate?: string;

  @IsOptional()
  @IsIn(SHIFTS, { message: `shift must be one of: ${SHIFTS.join(', ')}` })
  shift?: Shift;
}
