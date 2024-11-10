import { Module } from '@nestjs/common';
import { CategoryController } from './category.controller';
import { CategoryService } from './category.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryRepository } from './category.repository';
import { Category } from './category.entity';
import { MONGODB_CONNEXION_NAME } from 'src/utils/constants';

@Module({
  imports: [TypeOrmModule.forFeature([Category], MONGODB_CONNEXION_NAME)],
  controllers: [CategoryController],
  providers: [CategoryService, CategoryRepository],
  exports: [CategoryService, CategoryRepository],
})
export class CategoryModule {}
