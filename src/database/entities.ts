import { User } from '../users/entities/user.entity.js';
import { ProductionLine } from '../production-lines/entities/production-line.entity.js';
import { Machine } from '../machines/entities/machine.entity.js';
import { ProductionLog } from '../production-logs/entities/production-log.entity.js';
import { MaintenanceRequest } from '../maintenance-requests/entities/maintenance-request.entity.js';
import { MaintenanceSchedule } from '../maintenance-schedules/entities/maintenance-schedule.entity.js';
import { SparePart } from '../spare-parts/entities/spare-part.entity.js';
import { PartUsage } from '../part-usages/entities/part-usage.entity.js';

// All 8 tables from the Lab 04 ERD.
// Table names are lowercase because MySQL/MariaDB on Windows stores them that way
// (lower_case_table_names=1); column names keep the PascalCase from the Data Dictionary.
export const entities = [
  User,
  ProductionLine,
  Machine,
  ProductionLog,
  MaintenanceRequest,
  MaintenanceSchedule,
  SparePart,
  PartUsage,
];
