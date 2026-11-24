import { IsIn, IsOptional } from 'class-validator';
import { USER_ROLES } from '../../common/constants.js';
import type { UserRole } from '../../common/constants.js';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto.js';

/** GET /users?role=Technician&page=1&limit=20 */
export class UserQueryDto extends PaginationQueryDto {
  @IsOptional()
  @IsIn(USER_ROLES, {
    message: `role must be one of: ${USER_ROLES.join(', ')}`,
  })
  role?: UserRole;
}
