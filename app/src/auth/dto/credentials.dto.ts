
import { IsString, IsNotEmpty, IsEmail, MaxLength, MinLength } from 'class-validator';

export class Credentials {

    @IsString()
    @IsNotEmpty()
    @IsEmail()
    @MaxLength(20)
    @MinLength(3)
    readonly email: string;

    @IsString()
    @IsNotEmpty()
    @MaxLength(30)
    @MinLength(6)
    readonly password: string;
}