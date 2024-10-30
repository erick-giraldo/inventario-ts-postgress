import { applyDecorators, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { SessionGuard } from '../guards/session.guard';
import { Roles } from './roles.decorator';
// import { RolesGuard } from '../guards/roles.guard';

export function Authentication(roles?: string[]) {
  return roles
    ? applyDecorators(
        ApiBearerAuth('session-id'),
        Roles(roles),
        UseGuards(
          SessionGuard,
          //  RolesGuard
          ),
        ApiUnauthorizedResponse({
          schema: {
            type: 'object',
            properties: {
              statusCode: {
                type: 'integer',
                example: 401,
              },
              message: {
                type: 'string',
              },
            },
          },
        }),
        ApiForbiddenResponse(),
      )
    : applyDecorators(
        ApiBearerAuth('session-id'),
        UseGuards(SessionGuard),
        ApiUnauthorizedResponse({
          schema: {
            type: 'object',
            properties: {
              statusCode: {
                type: 'integer',
                example: 401,
              },
              message: {
                type: 'string',
              },
            },
          },
        }),
      );
}
