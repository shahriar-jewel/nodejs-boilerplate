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

  export class CreateRoleDto {
    @IsNotEmpty()
    @IsString()
    @MaxLength(255)
    @IsUnique('Role', 'name', { message: 'Role name must be unique' })
    name: string;

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
