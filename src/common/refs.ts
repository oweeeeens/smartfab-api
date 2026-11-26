import type { User } from '../users/entities/user.entity.js';
import type { Machine } from '../machines/entities/machine.entity.js';

/**
 * Small summaries of related records, embedded in responses so clients can show
 * names instead of raw IDs. Only safe, non-sensitive fields are included.
 */
export interface UserRef {
  userId: number;
  firstName: string;
  lastName: string;
}

export interface MachineRef {
  machineId: number;
  machineName: string;
}

export function toUserRef(user: User | null | undefined): UserRef | null {
  if (!user) return null;
  return {
    userId: user.userId,
    firstName: user.firstName,
    lastName: user.lastName,
  };
}

export function toMachineRef(
  machine: Machine | null | undefined,
): MachineRef | null {
  if (!machine) return null;
  return { machineId: machine.machineId, machineName: machine.machineName };
}
