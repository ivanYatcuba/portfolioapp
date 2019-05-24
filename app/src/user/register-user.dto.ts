import { IsString, IsInt, IsDateString, IsNotEmpty, IsISO8601, IsEmail, IsMobilePhone, IsDate, MaxLength, MinLength } from 'class-validator';

export class RegisterUserDto {
    
    @IsString()
    @IsNotEmpty()
    @MaxLength(30)
    @MinLength(3)
    readonly name: string;
    
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

    @IsDateString()
    readonly birthday: string;
    
    @IsString()
    @IsNotEmpty()
    @IsMobilePhone("en-US")
    readonly phone: string;
}