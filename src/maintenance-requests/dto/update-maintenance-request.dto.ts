import {
  IsIn,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsPositive,
  IsString,
  MaxLength,
  ValidateIf,
} from 'class-validator';
import { PRIORITIES, REQUEST_STATUSES } from '../../common/constants.js';
import type { Priority, RequestStatus } from '../../common/constants.js';

/** PATCH: assign a technician and/or move the request through its workflow. */
export class UpdateMaintenanceRequestDto {
  // null un-assigns the technician
  @IsOptional()
  @ValidateIf((_, value) => value !== null)
  @IsInt()
  @IsPositive()
  assignedTo?: number | null;

  @IsOptional()
  @IsIn(REQUEST_STATUSES, {
    message: `status must be one of: ${REQUEST_STATUSES.join(', ')}`,
  })
  status?: RequestStatus;

  @IsOptional()
  @IsIn(PRIORITIES, {
    message: `priority must be one of: ${PRIORITIES.join(', ')}`,
  })
  priority?: Priority;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(2000)
  issueDescription?: string;
}
