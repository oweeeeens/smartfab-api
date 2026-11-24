import {
  Check,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import type { Relation } from 'typeorm';
import { MACHINE_STATUSES, sqlInList } from '../../common/constants.js';
import type { MachineStatus } from '../../common/constants.js';
import { ProductionLine } from '../../production-lines/entities/production-line.entity.js';
import { ProductionLog } from '../../production-logs/entities/production-log.entity.js';
import { MaintenanceRequest } from '../../maintenance-requests/entities/maintenance-request.entity.js';
import { MaintenanceSchedule } from '../../maintenance-schedules/entities/maintenance-schedule.entity.js';

@Entity('machine')
@Check('CHK_Machine_Status', `\`Status\` IN (${sqlInList(MACHINE_STATUSES)})`)
export class Machine {
  @PrimaryGeneratedColumn({ name: 'MachineID', type: 'int' })
  machineId: number;

  @Column({ name: 'LineID', type: 'int' })
  lineId: number;

  @Column({ name: 'MachineName', type: 'varchar', length: 50 })
  machineName: string;

  @Column({ name: 'Model', type: 'varchar', length: 50, nullable: true })
  model: string | null;

  @Column({ name: 'SerialNumber', type: 'varchar', length: 50, unique: true })
  serialNumber: string;

  @Column({ name: 'Status', type: 'varchar', length: 20, default: 'Running' })
  status: MachineStatus;

  @Column({ name: 'InstallationDate', type: 'date', nullable: true })
  installationDate: string | null;

  // Many machines -> one production line
  @ManyToOne(() => ProductionLine, (line) => line.machines, {
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'LineID' })
  line: Relation<ProductionLine>;

  @OneToMany(() => ProductionLog, (log) => log.machine)
  productionLogs: Relation<ProductionLog[]>;

  @OneToMany(() => MaintenanceRequest, (req) => req.machine)
  maintenanceRequests: Relation<MaintenanceRequest[]>;

  @OneToMany(() => MaintenanceSchedule, (schedule) => schedule.machine)
  maintenanceSchedules: Relation<MaintenanceSchedule[]>;
}
