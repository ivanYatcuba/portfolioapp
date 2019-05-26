import { IsString, IsNotEmpty, IsISO8601, IsEmail, IsMobilePhone, MaxLength, MinLength, IsOptional } from 'class-validator';
import { ApiModelProperty } from '@nestjs/swagger';

export class UpdateUserDto {

    @IsString()
    @IsNotEmpty()
    @MaxLength(30)
    @MinLength(3)
    @IsOptional()
    @ApiModelProperty({ type: String, description: "User full name" })
    readonly name: string;

    @IsString()
    @IsNotEmpty()
    @IsEmail()
    @MaxLength(20)
    @MinLength(3)
    @IsOptional()
    @ApiModelProperty({ type: String, description: "User register email" })
    readonly email: string;

    @IsString()
    @IsNotEmpty()
    @MaxLength(30)
    @MinLength(6)
    @IsOptional()
    @ApiModelProperty({ type: String, description: "Current user's password" })
    readonly currentPassword: string;

    @IsString()
    @IsNotEmpty()
    @MaxLength(30)
    @MinLength(6)
    @IsOptional()
    @ApiModelProperty({ type: String, description: "New user's password" })
    readonly newPassword: string;

    @IsISO8601()
    @IsOptional()
    @ApiModelProperty({ type: String, description: "Birthday date in ISO8601 format" })
    readonly birthday: string;

    @IsString()
    @IsNotEmpty()
    @IsMobilePhone("en-US")
    @IsOptional()
    @ApiModelProperty({ type: String, description: "Phone number in US format" })
    readonly phone: string;
}