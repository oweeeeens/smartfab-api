import { Type } from 'class-transformer';
import { IsIn, IsInt, IsOptional, IsPositive } from 'class-validator';
import { MACHINE_STATUSES } from '../../common/constants.js';
import type { MachineStatus } from '../../common/constants.js';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto.js';

/** GET /machines?status=Down&lineId=2&page=1&limit=20 */
export class MachineQueryDto extends PaginationQueryDto {
  @IsOptional()
  @IsIn(MACHINE_STATUSES, {
    message: `status must be one of: ${MACHINE_STATUSES.join(', ')}`,
  })
  status?: MachineStatus;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  lineId?: number;
}
