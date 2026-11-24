/**
 * Seeds the database with starter data so the API can be tested right away.
 * Run with: npm run seed
 *
 * It only inserts data when the User table is empty, so it is safe to run twice.
 */
import 'reflect-metadata';
import { existsSync } from 'node:fs';
import bcrypt from 'bcryptjs';
import { DataSource } from 'typeorm';
import { entities } from './entities.js';
import { applyCheckConstraints } from './check-constraints.service.js';
import { User } from '../users/entities/user.entity.js';
import { ProductionLine } from '../production-lines/entities/production-line.entity.js';
import { Machine } from '../machines/entities/machine.entity.js';
import { MaintenanceSchedule } from '../maintenance-schedules/entities/maintenance-schedule.entity.js';
import { SparePart } from '../spare-parts/entities/spare-part.entity.js';

if (existsSync('.env')) process.loadEnvFile('.env');

const dataSource = new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST ?? 'localhost',
  port: Number(process.env.DB_PORT ?? 3306),
  username: process.env.DB_USERNAME ?? 'root',
  password: process.env.DB_PASSWORD ?? '',
  database: process.env.DB_NAME ?? 'smartfab',
  entities,
  synchronize: true,
});

async function seed() {
  await dataSource.initialize();
  await applyCheckConstraints(dataSource);

  const users = dataSource.getRepository(User);
  if ((await users.count()) > 0) {
    console.log('Database already has users. Seed skipped.');
    return;
  }

  const password = process.env.SEED_DEFAULT_PASSWORD ?? 'ChangeMe123!';
  const passwordHash = await bcrypt.hash(password, 10);

  const [, supervisor] = await users.save([
    {
      firstName: 'System',
      lastName: 'Admin',
      email: 'admin@smartfab.com',
      role: 'Admin',
      passwordHash,
    },
    {
      firstName: 'Maria',
      lastName: 'Santos',
      email: 'supervisor@smartfab.com',
      role: 'Supervisor',
      passwordHash,
      contactNumber: '09170000001',
    },
    {
      firstName: 'Juan',
      lastName: 'Dela Cruz',
      email: 'operator@smartfab.com',
      role: 'Operator',
      passwordHash,
      contactNumber: '09170000002',
    },
    {
      firstName: 'Ana',
      lastName: 'Reyes',
      email: 'technician@smartfab.com',
      role: 'Technician',
      passwordHash,
      contactNumber: '09170000003',
    },
    {
      firstName: 'Carlo',
      lastName: 'Mendoza',
      email: 'manager@smartfab.com',
      role: 'Manager',
      passwordHash,
    },
  ]);

  const [lineA, lineB] = await dataSource.getRepository(ProductionLine).save([
    {
      lineName: 'Assembly Line A',
      location: 'Building 1',
      supervisorId: supervisor.userId,
    },
    {
      lineName: 'Machining Line B',
      location: 'Building 2',
      supervisorId: supervisor.userId,
    },
  ]);

  const [lathe, press] = await dataSource.getRepository(Machine).save([
    {
      lineId: lineB.lineId,
      machineName: 'CNC Lathe 1',
      model: 'HL-200',
      serialNumber: 'SN-88231',
      status: 'Running',
      installationDate: '2024-03-10',
    },
    {
      lineId: lineB.lineId,
      machineName: 'Press 3',
      model: 'HP-50',
      serialNumber: 'SN-77120',
      status: 'Idle',
      installationDate: '2023-11-02',
    },
    {
      lineId: lineA.lineId,
      machineName: 'Conveyor 1',
      model: 'CV-10',
      serialNumber: 'SN-55001',
      status: 'Running',
      installationDate: '2022-06-15',
    },
  ]);

  await dataSource.getRepository(MaintenanceSchedule).save([
    {
      machineId: lathe.machineId,
      taskDescription: 'Lubricate spindle and gears',
      frequencyDays: 30,
      lastPerformed: '2026-10-25',
      nextDueDate: '2026-11-24',
    },
    {
      machineId: press.machineId,
      taskDescription: 'Inspect hydraulic hoses',
      frequencyDays: 90,
      nextDueDate: '2026-12-15',
    },
  ]);

  await dataSource.getRepository(SparePart).save([
    {
      partName: 'Spindle Bearing',
      partNumber: 'BRG-6205',
      quantityOnHand: 12,
      reorderLevel: 5,
      unitCost: 850.0,
    },
    {
      partName: 'Drive Belt',
      partNumber: 'BLT-A42',
      quantityOnHand: 3,
      reorderLevel: 4,
      unitCost: 420.5,
    },
    {
      partName: 'Hydraulic Hose',
      partNumber: 'HYD-H12',
      quantityOnHand: 8,
      reorderLevel: 2,
      unitCost: 1200.0,
    },
  ]);

  console.log('Seed complete. Users (all with the seed password):');
  console.log(
    '  admin@smartfab.com, supervisor@smartfab.com, operator@smartfab.com,',
  );
  console.log('  technician@smartfab.com, manager@smartfab.com');
}

seed()
  .catch((error) => {
    console.error('Seed failed:', error);
    process.exitCode = 1;
  })
  .finally(() => dataSource.destroy());
