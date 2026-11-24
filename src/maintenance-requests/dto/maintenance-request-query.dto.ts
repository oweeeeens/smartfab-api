import { Type } from 'class-transformer';
import { IsIn, IsInt, IsOptional, IsPositive } from 'class-validator';
import { PRIORITIES, REQUEST_STATUSES } from '../../common/constants.js';
import type { Priority, RequestStatus } from '../../common/constants.js';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto.js';

/** GET /maintenance-requests?status=Pending&priority=High&machineId=4&assignedTo=7 */
export class MaintenanceRequestQueryDto extends PaginationQueryDto {
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
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  machineId?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  assignedTo?: number;
}
