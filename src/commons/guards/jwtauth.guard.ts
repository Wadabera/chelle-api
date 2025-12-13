import { applyDecorators, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

export function jwtAuthGuard(type: string = 'jwt') {
  return applyDecorators(UseGuards(AuthGuard(type)));
}
