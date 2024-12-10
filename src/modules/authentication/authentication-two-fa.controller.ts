import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Get,
  Post,
} from '@nestjs/common';
import { Authentication } from './decorators/authentication.decorator';
import { AuthenticationService } from './authentication.service';
import { UserDecorator } from './decorators/user.decorator';
import { EntityWithId } from '@/common/types/types';
import { User } from '../user/user.entity';
import { IUser } from '../user/user.interface';
import { EnableTwoFaDto } from './dto/enable-two-fa.dto';

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
  async generate(@UserDecorator() user: EntityWithId<User>) {
    return await this.authenticationService.generateTwoFactorSecret(user);
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
    @UserDecorator() user: IUser,
    @Body() enableTwoFaDto: EnableTwoFaDto,
  ) {
    await this.authenticationService.enableTwoFactorSecret(
      user,
      enableTwoFaDto,
    );
  }
}
