import {
  Check,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import type { Relation } from 'typeorm';
import { SHIFTS, sqlInList } from '../../common/constants.js';
import type { Shift } from '../../common/constants.js';
import { Machine } from '../../machines/entities/machine.entity.js';
import { User } from '../../users/entities/user.entity.js';

@Entity('productionlog')
@Check('CHK_ProductionLog_Shift', `\`Shift\` IN (${sqlInList(SHIFTS)})`)
@Check('CHK_ProductionLog_UnitsProduced', '`UnitsProduced` >= 0')
@Check('CHK_ProductionLog_UnitsDefective', '`UnitsDefective` >= 0')
@Check('CHK_ProductionLog_Downtime', '`DowntimeMinutes` >= 0')
export class ProductionLog {
  @PrimaryGeneratedColumn({ name: 'LogID', type: 'int' })
  logId: number;

  @Column({ name: 'MachineID', type: 'int' })
  machineId: number;

  @Column({ name: 'OperatorID', type: 'int' })
  operatorId: number;

  @Column({ name: 'ShiftDate', type: 'date' })
  shiftDate: string;

  @Column({ name: 'Shift', type: 'varchar', length: 10 })
  shift: Shift;

  @Column({ name: 'UnitsProduced', type: 'int', default: 0 })
  unitsProduced: number;

  @Column({ name: 'UnitsDefective', type: 'int', default: 0 })
  unitsDefective: number;

  @Column({ name: 'DowntimeMinutes', type: 'int', default: 0 })
  downtimeMinutes: number;

  @ManyToOne(() => Machine, (machine) => machine.productionLogs, {
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'MachineID' })
  machine: Relation<Machine>;

  @ManyToOne(() => User, (user) => user.productionLogs, {
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'OperatorID' })
  operator: Relation<User>;
}
