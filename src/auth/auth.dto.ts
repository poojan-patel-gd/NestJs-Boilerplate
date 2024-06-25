import { ApiProperty } from "@nestjs/swagger";
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsStrongPassword,
} from "class-validator";
import { SuccessResponse } from "../shared/types/SuccessResponse";

export class RegisterDTO {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  firstName: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  lastName: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  userName: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsStrongPassword()
  @IsOptional()
  password?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  socialId?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  socialType?: string;
}

export class AuthResponseDTO extends SuccessResponse {
  data?: any;
  message: string;
  statusCode: number;
  meta?: any;
}