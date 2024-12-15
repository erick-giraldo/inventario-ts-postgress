import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { AuthenticationService } from '../authentication.service';
import { ConfirmDto, SetActivateDto } from '../dto/confirm.dto';
import { ResendCodeDto } from '../dto/resend-code.dto';

@Controller('authentication/code')
@ApiTags('authentication')
export class AuthenticationCodeController {
  constructor(private readonly authenticationService: AuthenticationService) {}

  @Post('confirm')
  @HttpCode(HttpStatus.OK)
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
  async confirm(@Body() confirmDto: ConfirmDto) {
    await this.authenticationService.confirm(confirmDto);
  }

  @Post('resend')
  @HttpCode(HttpStatus.OK)
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
  async resendCode(@Body() resendCodeDto: ResendCodeDto) {
    await this.authenticationService.resendCode(resendCodeDto);
  }

  @Post('set-activate')
  @HttpCode(HttpStatus.OK)
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
  async setActivateUser(@Body() setActivateDto: SetActivateDto) {
    await this.authenticationService.setPassActivateUser(setActivateDto);
  }
}
