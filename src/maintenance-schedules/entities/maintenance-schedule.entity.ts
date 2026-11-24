import {
  Check,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import type { Relation } from 'typeorm';
import { Machine } from '../../machines/entities/machine.entity.js';

@Entity('maintenanceschedule')
@Check('CHK_MaintenanceSchedule_Frequency', '`FrequencyDays` > 0')
export class MaintenanceSchedule {
  @PrimaryGeneratedColumn({ name: 'ScheduleID', type: 'int' })
  scheduleId: number;

  @Column({ name: 'MachineID', type: 'int' })
  machineId: number;

  @Column({ name: 'TaskDescription', type: 'varchar', length: 255 })
  taskDescription: string;

  @Column({ name: 'FrequencyDays', type: 'int' })
  frequencyDays: number;

  @Column({ name: 'LastPerformed', type: 'date', nullable: true })
  lastPerformed: string | null;

  @Column({ name: 'NextDueDate', type: 'date' })
  nextDueDate: string;

  @ManyToOne(() => Machine, (machine) => machine.maintenanceSchedules, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'MachineID' })
  machine: Relation<Machine>;
}
