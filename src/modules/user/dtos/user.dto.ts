import { Type } from "class-transformer";
import {
  IsNotEmpty,
  IsString,
  IsOptional,
  MaxLength,
  IsEmail,
  IsInt,
  IsIn,
  IsDateString,
  IsNumberString,
  MinLength,
  Length,
  IsBoolean,
  ValidateNested,
} from "class-validator";
import { UserRoleDto } from "./user-role.dto";
import { IsUnique } from "../../../validators/is-unique.decorator";

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  name: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  @IsUnique('User', 'username', { message: 'This username is already registered.' })
  username: string;

  @IsNotEmpty()
  @IsEmail()
  @MaxLength(255)
  @IsUnique('User', 'email', { message: 'This email is already registered.' })
  email: string;

  @IsOptional()
  @IsNumberString({ no_symbols: true })
  @Length(11, 13)
  @IsUnique('User', 'mobile', { message: 'This mobile is already registered.' })
  mobile?: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  @MaxLength(255)
  password: string;

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => UserRoleDto)
  role: UserRoleDto;

  @IsOptional()
  @IsBoolean()
  // @IsIn([0, 1], { message: "is_active must be either 0 or 1" })
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
