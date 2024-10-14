// role.dto.ts
import { IsNotEmpty, IsString } from "class-validator";

export class UserRoleDto {
  @IsNotEmpty()
  @IsString()
  id: string;

  @IsNotEmpty()
  @IsString()
  name: string;
}
