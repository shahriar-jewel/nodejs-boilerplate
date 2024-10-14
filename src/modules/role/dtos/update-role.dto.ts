import {
    IsOptional,
    IsString,
    MaxLength,
    IsInt,
    IsDateString,
    IsBoolean
} from "class-validator";

export class UpdateRoleDto {
    @IsOptional()
    @IsString()
    @MaxLength(255)
    name?: string;

    @IsOptional()
    @IsBoolean()
    isActive?: boolean;

    @IsOptional()
    @IsInt()
    updatedBy?: number;

    @IsOptional()
    @IsDateString()
    updatedAt?: string;
}
