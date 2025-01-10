import { Module } from '@nestjs/common';
import { RedisModule } from '@liaoliaots/nestjs-redis';
import { ConfigModule } from '@nestjs/config';
import { SessionService } from './session.service';
import { RedisConfigService } from './redis-config.service';

@Module({
  imports: [
    ConfigModule.forRoot(),
    RedisModule.forRootAsync({
      imports: [ConfigModule],
      useClass: RedisConfigService,
    }),
  ],
  providers: [SessionService],
  exports: [SessionService, RedisModule],
})
export class SessionModule {}