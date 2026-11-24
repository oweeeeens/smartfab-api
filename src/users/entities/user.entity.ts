import {
  Check,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import type { Relation } from 'typeorm';
import { USER_ROLES, sqlInList } from '../../common/constants.js';
import type { UserRole } from '../../common/constants.js';
import { ProductionLine } from '../../production-lines/entities/production-line.entity.js';
import { ProductionLog } from '../../production-logs/entities/production-log.entity.js';
import { MaintenanceRequest } from '../../maintenance-requests/entities/maintenance-request.entity.js';

@Entity('user')
@Check('CHK_User_Role', `\`Role\` IN (${sqlInList(USER_ROLES)})`)
export class User {
  @PrimaryGeneratedColumn({ name: 'UserID', type: 'int' })
  userId: number;

  @Column({ name: 'FirstName', type: 'varchar', length: 50 })
  firstName: string;

  @Column({ name: 'LastName', type: 'varchar', length: 50 })
  lastName: string;

  @Column({ name: 'Email', type: 'varchar', length: 100, unique: true })
  email: string;

  // select: false -> the hash is never loaded unless explicitly requested
  @Column({ name: 'PasswordHash', type: 'varchar', length: 255, select: false })
  passwordHash: string;

  @Column({ name: 'Role', type: 'varchar', length: 20 })
  role: UserRole;

  @Column({
    name: 'ContactNumber',
    type: 'varchar',
    length: 15,
    nullable: true,
  })
  contactNumber: string | null;

  @CreateDateColumn({
    name: 'DateCreated',
    type: 'datetime',
    precision: 0,
    default: () => 'CURRENT_TIMESTAMP',
  })
  dateCreated: Date;

  @OneToMany(() => ProductionLine, (line) => line.supervisor)
  supervisedLines: Relation<ProductionLine[]>;

  @OneToMany(() => ProductionLog, (log) => log.operator)
  productionLogs: Relation<ProductionLog[]>;

  @OneToMany(() => MaintenanceRequest, (req) => req.reporter)
  reportedRequests: Relation<MaintenanceRequest[]>;

  @OneToMany(() => MaintenanceRequest, (req) => req.assignee)
  assignedRequests: Relation<MaintenanceRequest[]>;
}
