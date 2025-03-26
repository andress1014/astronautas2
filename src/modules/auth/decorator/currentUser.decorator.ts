// src/modules/auth/decorator/currentUser.decorator.ts
import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserPayload } from '../types/userPayload.type';

export const CurrentUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): UserPayload => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
