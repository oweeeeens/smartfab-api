import {
  IsDateString,
  IsIn,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsPositive,
  IsString,
  MaxLength,
} from 'class-validator';
import { MACHINE_STATUSES } from '../../common/constants.js';
import type { MachineStatus } from '../../common/constants.js';

export class CreateMachineDto {
  @IsInt()
  @IsPositive()
  lineId: number;

  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  machineName: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  model?: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  serialNumber: string;

  // Defaults to 'Running' when not sent
  @IsOptional()
  @IsIn(MACHINE_STATUSES, {
    message: `status must be one of: ${MACHINE_STATUSES.join(', ')}`,
  })
  status?: MachineStatus;

  @IsOptional()
  @IsDateString(
    { strict: true },
    { message: 'installationDate must be YYYY-MM-DD' },
  )
  installationDate?: string;
}
