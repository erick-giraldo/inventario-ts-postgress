import { Module } from '@nestjs/common';
import { BrandController } from './brand.controller';
import { BrandService } from './brand.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Brand } from './brand.entity';
import { MONGODB_CONNEXION_NAME } from 'src/utils/constants';
import { BrandRepository } from './brand.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Brand], MONGODB_CONNEXION_NAME)],
  controllers: [BrandController],
  providers: [BrandService, BrandRepository],
  exports: [BrandService, BrandRepository],
})
export class BrandModule {}
