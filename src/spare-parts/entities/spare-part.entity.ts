import {
  Check,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import type { Relation } from 'typeorm';
import { PartUsage } from '../../part-usages/entities/part-usage.entity.js';

// MySQL returns DECIMAL as a string; convert it to a number for the JSON response
const decimalToNumber = {
  to: (value: number) => value,
  from: (value: string | null) => (value === null ? null : Number(value)),
};

@Entity('sparepart')
@Check('CHK_SparePart_Quantity', '`QuantityOnHand` >= 0')
@Check('CHK_SparePart_Reorder', '`ReorderLevel` >= 0')
@Check('CHK_SparePart_UnitCost', '`UnitCost` >= 0')
export class SparePart {
  @PrimaryGeneratedColumn({ name: 'PartID', type: 'int' })
  partId: number;

  @Column({ name: 'PartName', type: 'varchar', length: 100 })
  partName: string;

  @Column({ name: 'PartNumber', type: 'varchar', length: 50, unique: true })
  partNumber: string;

  @Column({ name: 'QuantityOnHand', type: 'int', default: 0 })
  quantityOnHand: number;

  @Column({ name: 'ReorderLevel', type: 'int', default: 0 })
  reorderLevel: number;

  @Column({
    name: 'UnitCost',
    type: 'decimal',
    precision: 10,
    scale: 2,
    transformer: decimalToNumber,
  })
  unitCost: number;

  @OneToMany(() => PartUsage, (usage) => usage.part)
  usages: Relation<PartUsage[]>;
}
