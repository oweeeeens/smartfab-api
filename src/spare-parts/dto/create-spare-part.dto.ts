import {
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';

export class CreateSparePartDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  partName: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  partNumber: string;

  @IsOptional()
  @IsInt()
  @Min(0, { message: 'quantityOnHand cannot be negative' })
  quantityOnHand?: number;

  @IsOptional()
  @IsInt()
  @Min(0, { message: 'reorderLevel cannot be negative' })
  reorderLevel?: number;

  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0, { message: 'unitCost cannot be negative' })
  unitCost: number;
}
