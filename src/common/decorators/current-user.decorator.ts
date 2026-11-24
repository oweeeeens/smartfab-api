import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import type { UserRole } from '../constants.js';

/** Shape of the user attached to the request after the JWT is verified. */
export interface AuthUser {
  userId: number;
  email: string;
  role: UserRole;
}

/** Injects the logged-in user (from the JWT) into a controller method. */
export const CurrentUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): AuthUser =>
    ctx.switchToHttp().getRequest().user,
);
