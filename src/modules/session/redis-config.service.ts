// import { Injectable } from '@nestjs/common';
// import {
//   RedisModuleOptions,
//   RedisOptionsFactory,
// } from '@liaoliaots/nestjs-redis';
// import { ConfigService } from '@nestjs/config';
// import { EnvironmentVariables } from '@/common/config/environment-variables';

// @Injectable()
// export class RedisConfigService implements RedisOptionsFactory {
//   constructor(private readonly configService: ConfigService<EnvironmentVariables, true>) {}

//   createRedisOptions(): RedisModuleOptions {
//     return {
//       config: {
//         username: this.configService.get('REDIS_USERNAME'), // "default"
//         password: this.configService.get('REDIS_PASSWORD'), // Tu contraseña
//         host: this.configService.get('REDIS_HOST'), // obliging-midge-54069.upstash.io
//         port: this.configService.get<number>('REDIS_PORT'), // 6379
//         db: 0, // Upstash normalmente usa el DB 0
//         tls: {}, // Habilita la conexión segura
//         maxRetriesPerRequest: null, // Deshabilita el límite de reintentos por solicitud
//         connectTimeout: 10000, // Tiempo de espera para conexión
//         onClientCreated: (client) => {
//           client.on('connect', () => {
//             console.log('Redis client connected');
//           });
//           client.on('error', (err) => {
//             console.error('Redis client error:', err);
//           });
//         },
//       },
//     };
//   }

// }

import { Injectable } from '@nestjs/common';
import {
  RedisModuleOptions,
  RedisOptionsFactory,
} from '@liaoliaots/nestjs-redis';
import { ConfigService } from '@nestjs/config';
import { EnvironmentVariables } from '@/common/config/environment-variables';

@Injectable()
export class RedisConfigService implements RedisOptionsFactory {
  constructor(
    private readonly configService: ConfigService<EnvironmentVariables, true>,
  ) {}

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
