import { IsString, IsNotEmpty, IsISO8601, IsEmail, IsMobilePhone, MaxLength, MinLength } from 'class-validator';
import { ApiModelProperty } from '@nestjs/swagger';

export class RegisterUserDto {

    @IsString()
    @IsNotEmpty()
    @MaxLength(30)
    @MinLength(3)
    @ApiModelProperty({ type: String, description: "User full name" })
    readonly name: string;

    @IsString()
    @IsNotEmpty()
    @IsEmail()
    @MaxLength(20)
    @MinLength(3)
    @ApiModelProperty({ type: String, description: "User register email" })
    readonly email: string;

    @IsString()
    @IsNotEmpty()
    @MaxLength(30)
    @MinLength(6)
    @ApiModelProperty({ type: String, description: "User password" })
    readonly password: string;

    @IsISO8601()
    @ApiModelProperty({ type: String, description: "Birthday date in ISO8601 format" })
    readonly birthday: string;

    @IsString()
    @IsNotEmpty()
    @IsMobilePhone("en-US")
    @ApiModelProperty({ type: String, description: "Phone number in US format" })
    readonly phone: string;
}