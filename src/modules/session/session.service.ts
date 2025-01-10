import { Injectable } from '@nestjs/common';
import { RedisService } from '@liaoliaots/nestjs-redis';
import Redis from 'ioredis';
import { User } from '../user/user.entity';
import { v4 as uuid } from 'uuid';

@Injectable()
export class SessionService {
  private readonly redis: Redis;

  private static readonly PREFIX = 'account-provider-v2:session:';

  constructor(private readonly redisService: RedisService) {
    this.redis = this.redisService.getOrThrow();
  }

  async createSession(user: Omit<User, 'toJSON'>) {
    const id = uuid();

    await this.redis.set(
      `${SessionService.PREFIX}${id}`,
      JSON.stringify(user),
      'EX',
      60 * 60 * 4,
    );

    return id;
  }

  getSession(id: string) {
    return this.redis.get(`${SessionService.PREFIX}${id}`);
  }

  async deleteSession(id: string) {
    await this.redis.del(`${SessionService.PREFIX}${id}`);
  }

  async updateSession(id: string, user: Partial<User>) {
    const session = await this.getSession(id);
    if (!session) return;

    const parsedSession = JSON.parse(session);
    const updatedSession = {
      ...parsedSession,
      ...user,
    };

    await this.redis.set(
      `${SessionService.PREFIX}${id}`,
      JSON.stringify(updatedSession),
      'EX',
      60 * 60 * 24,
    );
  }
}
