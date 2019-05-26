import { IsString, IsNotEmpty, IsISO8601, IsEmail, IsMobilePhone, MaxLength, MinLength, IsOptional } from 'class-validator';

export class UpdateUserDto {
    
    @IsString()
    @IsNotEmpty()
    @MaxLength(30)
    @MinLength(3)
    @IsOptional()
    readonly name: string;
    
    @IsString()
    @IsNotEmpty()
    @IsEmail()
    @MaxLength(20)
    @MinLength(3)
    @IsOptional()
    readonly email: string;
    
    @IsString()
    @IsNotEmpty()
    @MaxLength(30)
    @MinLength(6)
    @IsOptional()
    readonly currentPassword: string;

    @IsString()
    @IsNotEmpty()
    @MaxLength(30)
    @MinLength(6)
    @IsOptional()
    readonly newPassword: string;

    @IsISO8601()
    @IsOptional()
    readonly birthday: string;
    
    @IsString()
    @IsNotEmpty()
    @IsMobilePhone("en-US")
    @IsOptional()
    readonly phone: string;
}