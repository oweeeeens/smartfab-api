import {
  IsDateString,
  IsIn,
  IsInt,
  IsOptional,
  IsPositive,
  Min,
} from 'class-validator';
import { SHIFTS } from '../../common/constants.js';
import type { Shift } from '../../common/constants.js';

/** OperatorID is NOT sent by the client: it is taken from the JWT. */
export class CreateProductionLogDto {
  @IsInt()
  @IsPositive()
  machineId: number;

  @IsDateString({ strict: true }, { message: 'shiftDate must be YYYY-MM-DD' })
  shiftDate: string;

  @IsIn(SHIFTS, { message: `shift must be one of: ${SHIFTS.join(', ')}` })
  shift: Shift;

  @IsOptional()
  @IsInt()
  @Min(0, { message: 'unitsProduced cannot be negative' })
  unitsProduced?: number;

  @IsOptional()
  @IsInt()
  @Min(0, { message: 'unitsDefective cannot be negative' })
  unitsDefective?: number;

  @IsOptional()
  @IsInt()
  @Min(0, { message: 'downtimeMinutes cannot be negative' })
  downtimeMinutes?: number;
}
