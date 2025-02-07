import {
  Body,
  Controller,
  Get,
  Headers,
  HttpCode,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { MapResponseToDto } from '@/common/decorators/map-response-to-dto.decorator';
import { AuthenticationService } from '../authentication.service';
import { SignInResponseDto } from '../dto/sign-in-response-data.dto';
import { CreateUserDto } from '../dto/create-user.dto';
import { SignInDto } from '../dto/sign-in.dto';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { SignUpResponseDto } from '../dto/sign-up-response-data.dto';
import { Authentication } from '../decorators/authentication.decorator';
import { UserDecorator } from '../decorators/user.decorator';
import { EntityWithId } from '@/common/types/types';
import { User } from '../../user/user.entity';
import { UpdatePasswordDto } from '../dto/update-password.dto';

@Controller('authentication')
@ApiTags('authentication')
export class AuthenticationController {
  constructor(private readonly authenticationService: AuthenticationService) {}

  @Post('sign-up')
  @HttpCode(HttpStatus.OK)
  @MapResponseToDto(SignUpResponseDto)
  async signUpUser(@Body() user: CreateUserDto) {
    return await this.authenticationService.signUpUser(user);
  }

  @Post('sign-in')
  @HttpCode(HttpStatus.OK)
  @MapResponseToDto(SignInResponseDto)
  async signIn(@Body() signInDto: SignInDto) {
    return await this.authenticationService.signIn(signInDto);
  }

  @Post('log-out')
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
  async logOut(@Headers('x-session-id') sessionId: string) {
    await this.authenticationService.logOut(sessionId);
  }

  @Get('info')
  @Authentication()
  @MapResponseToDto(SignInResponseDto)
  async info(@UserDecorator() user: EntityWithId<User>) {
    return user;
  }

  @Post('change-password')
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
  async changePassword(
    @UserDecorator() user: EntityWithId<User>,
    @Body() updatePasswordDto: UpdatePasswordDto,
    @Headers('x-session-id') sessionId: string,
  ) {
    await this.authenticationService.updatePassword(
      user,
      updatePasswordDto,
      sessionId,
    );
  }
}
