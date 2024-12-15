import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { MapResponseToDto } from '@/common/decorators/map-response-to-dto.decorator';
import { AuthenticationService } from '../authentication.service';
import { SignInResponseDto } from '../dto/sign-in-response-data.dto';
import { CreateUserDto } from '../dto/create-user.dto';
import { SignInDto } from '../dto/sign-in.dto';
import { ApiTags } from '@nestjs/swagger';
import { SignUpResponseDto } from '../dto/sign-up-response-data.dto';

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
}
