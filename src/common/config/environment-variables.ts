import {
  IsBoolean,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { Environment } from '../enums/environment.enum';

export class EnvironmentVariables {
  @IsInt()
  @IsOptional()
  PORT?: number = 3000;

  @IsNotEmpty()
  @IsString()
  @IsOptional()
  REDIS_USERNAME?: string = 'default';

  @IsNotEmpty()
  @IsString()
  REDIS_HOST: string;

  @IsInt()
  REDIS_PORT: number;

  @IsInt()
  @IsOptional()
  REDIS_DB?: number = 0;

  @IsNotEmpty()
  @IsString()
  @IsOptional()
  REDIS_PASSWORD?: string;

  @IsNotEmpty()
  @IsString()
  POSTGRES_HOST: string;

  @IsInt()
  POSTGRES_PORT: number;

  @IsNotEmpty()
  @IsString()
  POSTGRES_NAME: string;

  @IsNotEmpty()
  @IsString()
  POSTGRES_USERNAME: string;

  @IsNotEmpty()
  @IsString()
  POSTGRES_PASSWORD: string;

  @IsNotEmpty()
  @IsString()
  MONGODB_HOST: string;

  @IsInt()
  MONGODB_PORT: number;

  @IsNotEmpty()
  @IsString()
  MONGODB_NAME: string;

  @IsNotEmpty()
  @IsString()
  @IsOptional()
  MONGODB_USERNAME?: string;

  @IsNotEmpty()
  @IsString()
  @IsOptional()
  MONGODB_PASSWORD?: string;

  @IsNotEmpty()
  @IsString()
  @IsOptional()
  MONGODB_AUTH_SOURCE?: string

  @IsEnum(Environment)
  @IsOptional()
  NODE_ENV?: Environment = Environment.DEVELOPMENT;

  @IsBoolean()
  @IsOptional()
  USER_REGISTER?: boolean = true

  @IsNotEmpty()
  @IsString()
  JWT_SECRET: string

  @IsNotEmpty()
  @IsString()
  SECRET_KEY: string

  @IsNotEmpty()
  @IsString()
  SESSION_SECRET: string

  @IsNotEmpty()
  @IsString()
  FRONTEND_HOST: string
}