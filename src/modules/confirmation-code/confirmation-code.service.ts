import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfirmationCodeRepository } from './confirmation-code.repository';
import { ConfirmationCodeType } from './confirmation-code-type.enum';
import { IUser } from '../user/user.interface';

@Injectable()
export class ConfirmationCodeService {
  constructor(
    private readonly confirmationCodeRepository: ConfirmationCodeRepository,
  ) {}

  async generate(user: string, type: ConfirmationCodeType) {
    const random = Math.floor(100000 + Math.random() * 900000).toString();

    return await this.confirmationCodeRepository.store({
      user,
      type,
      code: `${random.slice(0, 3)}-${random.slice(3)}`,
      expiresAt: new Date(Date.now() + 60 * 60 * 1000),
      isUsed: false
    });
  }

  async verify(user: IUser, code: string, type: ConfirmationCodeType) {
    const confirmationCode = await this.confirmationCodeRepository.findOne({
      where: {
        code,
        type,
        user: String(user.id),
        isUsed: false
      }
    })
    if (!confirmationCode) {
      throw new UnauthorizedException('Invalid confirmation code');
    }

    return await this.confirmationCodeRepository.store({
      ...confirmationCode,
      isUsed: true
    })
  }
}
