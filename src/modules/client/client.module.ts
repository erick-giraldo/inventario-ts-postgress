import { Module } from '@nestjs/common';
import { ClientController } from './client.controller';
import { ClientService } from './client.service';
import { ClientRepository } from './client.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Client } from './client.entity';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [TypeOrmModule.forFeature([Client]), ConfigModule],
  controllers: [ClientController],
  providers: [ClientService, ClientRepository],
  exports: [ClientRepository]
})
export class ClientModule {}
