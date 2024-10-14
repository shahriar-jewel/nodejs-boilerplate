import {
    IsNotEmpty,
    IsString,
    IsOptional,
    MaxLength,
    IsInt,
    IsDateString,
    IsBoolean
  } from "class-validator";
  import { IsUnique } from '../../../validators/is-unique.decorator';

  export class CreatePermissionDto {
    @IsNotEmpty()
    @IsString()
    @MaxLength(255)
    name: string;

    @IsNotEmpty()
    @IsString()
    @MaxLength(255)
    @IsUnique('Permission', 'code', { message: 'Permission code must be unique' })
    code: string;

    @IsOptional()
    @IsString()
    @MaxLength(255)
    description: string;

    @IsOptional()
    @IsBoolean()
    isActive?: boolean;

    @IsOptional()
    @IsInt()
    createdBy?: number;

    @IsOptional()
    @IsInt()
    updatedBy?: number;

    @IsOptional()
    @IsDateString()
    createdAt?: string;

    @IsOptional()
    @IsDateString()
    updatedAt?: string;
  }
