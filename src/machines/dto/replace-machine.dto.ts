import { OmitType } from '@nestjs/mapped-types';
import { IsIn } from 'class-validator';
import { MACHINE_STATUSES } from '../../common/constants.js';
import type { MachineStatus } from '../../common/constants.js';
import { CreateMachineDto } from './create-machine.dto.js';

/**
 * PUT body: the full machine. Same rules as create, but status is required.
 * Optional fields that are left out (model, installationDate) are cleared.
 */
export class ReplaceMachineDto extends OmitType(CreateMachineDto, [
  'status',
] as const) {
  @IsIn(MACHINE_STATUSES, {
    message: `status must be one of: ${MACHINE_STATUSES.join(', ')}`,
  })
  status: MachineStatus;
}
