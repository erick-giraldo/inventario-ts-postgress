import { Injectable } from '@nestjs/common';
import {
  RedisModuleOptions,
  RedisOptionsFactory,
} from '@liaoliaots/nestjs-redis';
import { ConfigService } from '@nestjs/config';
import { EnvironmentVariables } from '@/common/config/environment-variables';

@Injectable()
export class RedisConfigService implements RedisOptionsFactory {
  constructor(private readonly configService: ConfigService<EnvironmentVariables, true>) {}

  createRedisOptions(): RedisModuleOptions {
    return {
      config: {
        username: this.configService.get('REDIS_USERNAME'),
        password: this.configService.get('REDIS_PASSWORD'),
        host: this.configService.get('REDIS_HOST'),
        port: this.configService.get('REDIS_PORT'),
        db: this.configService.get('REDIS_DB'),
        onClientCreated: (client) => {
          client.on('connect', () => {
            console.log('Redis client connected');
          });
        },
      },
    };
  }
}