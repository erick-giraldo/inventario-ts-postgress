import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfirmationCodeRepository } from './confirmation-code.repository';
import { User } from '../user/user.entity';
import { ConfirmationCodeType } from './confirmation-code-type.enum';

@Injectable()
export class ConfirmationCodeService {
  constructor(private readonly confirmationCodeRepository: ConfirmationCodeRepository) {}

  async generate(user: User, type: ConfirmationCodeType) {
    const random = Math.floor(100000 + Math.random() * 900000).toString()

    return await this.confirmationCodeRepository.store({
      user,
      type,
      code: `${random.slice(0, 3)}-${random.slice(3)}`,
      expiresAt: new Date(Date.now() + 60 * 60 * 1000),
    });
  }

  async verify(user: User, code: string, type: ConfirmationCodeType) {
    const confirmationCode = await this.confirmationCodeRepository.findOne({
      where: {
        code,
        type,
        user: {
          id: user.id
        },
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