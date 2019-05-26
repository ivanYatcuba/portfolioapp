import { IsEmail, IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';
import { ApiModelProperty } from '@nestjs/swagger';

export class Credentials {

    @IsString()
    @IsNotEmpty()
    @IsEmail()
    @MaxLength(20)
    @MinLength(3)
    @ApiModelProperty({ type: String })
    readonly email: string;

    @IsString()
    @IsNotEmpty()
    @MaxLength(30)
    @MinLength(6)
    @ApiModelProperty({ type: String })
    readonly password: string;

    constructor(email: string, password: string) {
        this.email = email;
        this.password = password;
    }
}