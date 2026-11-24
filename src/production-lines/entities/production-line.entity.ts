import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import type { Relation } from 'typeorm';
import { User } from '../../users/entities/user.entity.js';
import { Machine } from '../../machines/entities/machine.entity.js';

@Entity('productionline')
export class ProductionLine {
  @PrimaryGeneratedColumn({ name: 'LineID', type: 'int' })
  lineId: number;

  @Column({ name: 'LineName', type: 'varchar', length: 50, unique: true })
  lineName: string;

  @Column({ name: 'Location', type: 'varchar', length: 100 })
  location: string;

  @Column({ name: 'SupervisorID', type: 'int' })
  supervisorId: number;

  // Many lines -> one supervisor (User)
  @ManyToOne(() => User, (user) => user.supervisedLines, {
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'SupervisorID' })
  supervisor: Relation<User>;

  @OneToMany(() => Machine, (machine) => machine.line)
  machines: Relation<Machine[]>;
}
