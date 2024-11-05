import {
  Body,
  Controller,
  Get,
  Headers,
  HttpCode,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { MapResponseToDto } from '@/common/decorators/map-response-to-dto.decorator';
import { User } from '../user/user.entity';
import { AuthenticationService } from './authentication.service';
import { UserDecorator } from './decorators/user.decorator';
import { Authentication } from './decorators/authentication.decorator';
import { SignInResponseDto } from './dto/sign-in-response-data.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { EntityWithId } from '@/common/types/types';
import { CreateUserDto } from './dto/create-user.dto';
import { SignInDto } from './dto/sign-in.dto';

@Controller('authentication')
@ApiTags('authentication')
export class AuthenticationController {
  constructor(private readonly authenticationService: AuthenticationService) {}

  @Post('sign-up')
  @HttpCode(HttpStatus.OK)
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
            masterKey: {
              type: 'string',
            },
          },
        },
      },
    },
  })
  async signUpUser(@Body() user: CreateUserDto) {
    console.log("🚀 ~ AuthenticationController ~ signUpUser ~ user:", user)
    return {
      masterKey: await this.authenticationService.signUpUser(user),
    };
  }

  @Post('sign-in')
  @HttpCode(HttpStatus.OK)
  @MapResponseToDto(SignInResponseDto)
  async signIn(@Body() signInDto: SignInDto) {
    return await this.authenticationService.signIn(signInDto);
  }


  // @Post('log-out')
  // @HttpCode(HttpStatus.OK)
  // @Authentication()
  // @ApiOkResponse({
  //   schema: {
  //     type: 'object',
  //     properties: {
  //       message: {
  //         type: 'string',
  //         example: 'success',
  //       },
  //     },
  //   },
  // })
  // async logOut(@Headers('x-session-id') sessionId: string) {
  //   await this.authenticationService.logOut(sessionId);
  // }

  // @Get('info')
  // @Authentication()
  // @MapResponseToDto(SignInResponseDto)
  // async info(@UserDecorator() user: EntityWithId<User>) {
  //   return user;
  // }

  // @Post('change-password')
  // @Authentication()
  // @ApiOkResponse({
  //   schema: {
  //     type: 'object',
  //     properties: {
  //       message: {
  //         type: 'string',
  //         example: 'success',
  //       },
  //     },
  //   },
  // })
  // async changePassword(
  //   @UserDecorator() user: EntityWithId<User>,
  //   @Body() updatePasswordDto: UpdatePasswordDto,
  //   @Headers('x-session-id') sessionId: string,
  // ) {
  //   await this.authenticationService.updatePassword(
  //     user,
  //     updatePasswordDto,
  //     sessionId,
  //   );
  // }

  
}
