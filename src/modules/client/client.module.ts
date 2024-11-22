import { Module } from '@nestjs/common';
import { ClientController } from './client.controller';
import { ClientService } from './client.service';
import { ClientRepository } from './client.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MONGODB_CONNEXION_NAME } from 'src/utils/constants';
import { Client } from './client.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Client], MONGODB_CONNEXION_NAME)],
  controllers: [ClientController],
  providers: [ClientService, ClientRepository]
})
export class ClientModule {}
