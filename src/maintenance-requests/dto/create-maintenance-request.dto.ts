import {
  IsIn,
  IsInt,
  IsNotEmpty,
  IsPositive,
  IsString,
  MaxLength,
} from 'class-validator';
import { PRIORITIES } from '../../common/constants.js';
import type { Priority } from '../../common/constants.js';

/**
 * The reporter (ReportedBy) is NOT sent by the client: it is taken from the JWT,
 * so a user can't file a request in someone else's name.
 */
export class CreateMaintenanceRequestDto {
  @IsInt()
  @IsPositive()
  machineId: number;

  @IsString()
  @IsNotEmpty()
  @MaxLength(2000)
  issueDescription: string;

  @IsIn(PRIORITIES, {
    message: `priority must be one of: ${PRIORITIES.join(', ')}`,
  })
  priority: Priority;
}
