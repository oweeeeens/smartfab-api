// Allowed values taken from the CHECK constraints in the Lab 04 Data Dictionary

export const USER_ROLES = [
  'Operator',
  'Technician',
  'Supervisor',
  'Manager',
  'Admin',
] as const;
export type UserRole = (typeof USER_ROLES)[number];

export const MACHINE_STATUSES = [
  'Running',
  'Idle',
  'Down',
  'Under Maintenance',
] as const;
export type MachineStatus = (typeof MACHINE_STATUSES)[number];

export const SHIFTS = ['Morning', 'Afternoon', 'Night'] as const;
export type Shift = (typeof SHIFTS)[number];

export const PRIORITIES = ['Low', 'Medium', 'High', 'Critical'] as const;
export type Priority = (typeof PRIORITIES)[number];

export const REQUEST_STATUSES = [
  'Pending',
  'In Progress',
  'Completed',
  'Cancelled',
] as const;
export type RequestStatus = (typeof REQUEST_STATUSES)[number];

/** Builds the SQL list used inside a CHECK (... IN (...)) constraint. */
export const sqlInList = (values: readonly string[]) =>
  values.map((v) => `'${v}'`).join(',');
