import {
  Check,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import type { Relation } from 'typeorm';
import { MaintenanceRequest } from '../../maintenance-requests/entities/maintenance-request.entity.js';
import { SparePart } from '../../spare-parts/entities/spare-part.entity.js';

// Junction (associative) entity: resolves the M:N between MaintenanceRequest and SparePart
@Entity('partusage')
@Check('CHK_PartUsage_Quantity', '`QuantityUsed` > 0')
export class PartUsage {
  @PrimaryGeneratedColumn({ name: 'UsageID', type: 'int' })
  usageId: number;

  @Column({ name: 'RequestID', type: 'int' })
  requestId: number;

  @Column({ name: 'PartID', type: 'int' })
  partId: number;

  @Column({ name: 'QuantityUsed', type: 'int' })
  quantityUsed: number;

  @CreateDateColumn({
    name: 'DateUsed',
    type: 'datetime',
    precision: 0,
    default: () => 'CURRENT_TIMESTAMP',
  })
  dateUsed: Date;

  @ManyToOne(() => MaintenanceRequest, (req) => req.partUsages, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'RequestID' })
  request: Relation<MaintenanceRequest>;

  @ManyToOne(() => SparePart, (part) => part.usages, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'PartID' })
  part: Relation<SparePart>;
}
