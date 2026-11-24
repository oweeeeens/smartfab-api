import { Transform } from 'class-transformer';
import { IsBoolean, IsOptional } from 'class-validator';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto.js';

/** GET /spare-parts?lowStock=true&page=1&limit=20 */
export class SparePartQueryDto extends PaginationQueryDto {
  // true -> only parts at or below their reorder level (need restocking)
  @IsOptional()
  @Transform(({ value }) =>
    value === 'true' ? true : value === 'false' ? false : value,
  )
  @IsBoolean({ message: 'lowStock must be true or false' })
  lowStock?: boolean;
}
