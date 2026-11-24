import { PartialType } from '@nestjs/mapped-types';
import { CreateSparePartDto } from './create-spare-part.dto.js';

// PATCH: send only the fields that change (e.g. { "quantityOnHand": 20 } after a restock)
export class UpdateSparePartDto extends PartialType(CreateSparePartDto) {}
