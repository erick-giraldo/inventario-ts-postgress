import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Get,
  Post,
  Headers,
} from '@nestjs/common';
import { Authentication } from '../decorators/authentication.decorator';
import { AuthenticationService } from '../authentication.service';
import { UserDecorator } from '../decorators/user.decorator';
import { EntityWithId } from '@/common/types/types';
import { User } from '../../user/user.entity';
import { EnableTwoFaDto } from '../dto/enable-two-fa.dto';

@Controller('authentication/two-factor')
@ApiTags('authentication')
export class AuthenticationTwoFaController {
  constructor(private readonly authenticationService: AuthenticationService) {}

  @Get('generate')
  @HttpCode(HttpStatus.OK)
  @Authentication()
  @ApiOkResponse({
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'success',
        },
        data: {
          type: 'object',
          properties: {
            secret: {
              type: 'string',
            },
            otpAuthUrl: {
              type: 'string',
              format: 'uri',
            },
          },
        },
      },
    },
  })
  async generate(
    @UserDecorator() user: EntityWithId<User>,
    @Headers('x-session-id') sessionId: string,
  ) {
    return await this.authenticationService.generateTwoFactorSecret(
      user,
      sessionId,
    );
  }

  @Post('enable')
  @HttpCode(HttpStatus.OK)
  @Authentication()
  @ApiOkResponse({
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'success',
        },
      },
    },
  })
  async enabled(
    @UserDecorator() user: EntityWithId<User>,
    @Body() enableTwoFaDto: EnableTwoFaDto,
    @Headers('x-session-id') sessionId: string,
  ) {
    await this.authenticationService.enableTwoFactorSecret(
      user,
      enableTwoFaDto,
      sessionId,
    );
  }
}
