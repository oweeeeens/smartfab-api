import { IsInt, IsPositive } from 'class-validator';

/** The request ID comes from the URL: /maintenance-requests/{id}/part-usages */
export class CreatePartUsageDto {
  @IsInt()
  @IsPositive()
  partId: number;

  @IsInt()
  @IsPositive({ message: 'quantityUsed must be greater than 0' })
  quantityUsed: number;
}
