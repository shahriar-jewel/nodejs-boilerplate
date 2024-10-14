import {
    IsNotEmpty,
    IsString,
    IsOptional,
    MaxLength,
    IsInt,
    IsDateString,
    IsBoolean
  } from "class-validator";

  export class UpdatePermissionDto {
    @IsNotEmpty()
    @IsString()
    @MaxLength(255)
    name: string;

    @IsNotEmpty()
    @IsString()
    @MaxLength(255)
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
