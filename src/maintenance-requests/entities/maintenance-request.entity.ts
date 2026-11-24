import {
  Check,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import type { Relation } from 'typeorm';
import {
  PRIORITIES,
  REQUEST_STATUSES,
  sqlInList,
} from '../../common/constants.js';
import type { Priority, RequestStatus } from '../../common/constants.js';
import { Machine } from '../../machines/entities/machine.entity.js';
import { User } from '../../users/entities/user.entity.js';
import { PartUsage } from '../../part-usages/entities/part-usage.entity.js';

@Entity('maintenancerequest')
@Check(
  'CHK_MaintenanceRequest_Priority',
  `\`Priority\` IN (${sqlInList(PRIORITIES)})`,
)
@Check(
  'CHK_MaintenanceRequest_Status',
  `\`Status\` IN (${sqlInList(REQUEST_STATUSES)})`,
)
export class MaintenanceRequest {
  @PrimaryGeneratedColumn({ name: 'RequestID', type: 'int' })
  requestId: number;

  @Column({ name: 'MachineID', type: 'int' })
  machineId: number;

  @Column({ name: 'ReportedBy', type: 'int' })
  reportedBy: number;

  // NULL until a technician is assigned
  @Column({ name: 'AssignedTo', type: 'int', nullable: true })
  assignedTo: number | null;

  @Column({ name: 'IssueDescription', type: 'text' })
  issueDescription: string;

  @Column({ name: 'Priority', type: 'varchar', length: 10 })
  priority: Priority;

  @Column({ name: 'Status', type: 'varchar', length: 20, default: 'Pending' })
  status: RequestStatus;

  @CreateDateColumn({
    name: 'DateReported',
    type: 'datetime',
    precision: 0,
    default: () => 'CURRENT_TIMESTAMP',
  })
  dateReported: Date;

  @Column({ name: 'DateCompleted', type: 'datetime', nullable: true })
  dateCompleted: Date | null;

  @ManyToOne(() => Machine, (machine) => machine.maintenanceRequests, {
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'MachineID' })
  machine: Relation<Machine>;

  // Two separate relationships to User: who reported it, and who is fixing it
  @ManyToOne(() => User, (user) => user.reportedRequests, {
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'ReportedBy' })
  reporter: Relation<User>;

  @ManyToOne(() => User, (user) => user.assignedRequests, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'AssignedTo' })
  assignee: Relation<User> | null;

  @OneToMany(() => PartUsage, (usage) => usage.request)
  partUsages: Relation<PartUsage[]>;
}
