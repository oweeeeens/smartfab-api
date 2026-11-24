import { IsIn } from 'class-validator';
import { MACHINE_STATUSES } from '../../common/constants.js';
import type { MachineStatus } from '../../common/constants.js';

/** PATCH body: only the status changes. */
export class UpdateMachineStatusDto {
  @IsIn(MACHINE_STATUSES, {
    message: `status must be one of: ${MACHINE_STATUSES.join(', ')}`,
  })
  status: MachineStatus;
}
