import { SetMetadata } from '@nestjs/common';
import type { UserRole } from '../constants.js';

export const ROLES_KEY = 'roles';

/** Restricts a route to the listed roles. Routes without @Roles() allow any logged-in user. */
export const Roles = (...roles: UserRole[]) => SetMetadata(ROLES_KEY, roles);
