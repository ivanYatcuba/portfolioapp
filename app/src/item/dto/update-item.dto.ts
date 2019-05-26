import { MinLength, MaxLength, IsNotEmpty, IsString, IsOptional } from "class-validator";

export class UpdateItemDto {

    @IsString()
    @IsNotEmpty()
    @MaxLength(30)
    @MinLength(3)
    @IsOptional()
    readonly title: string;

    @IsString()
    @IsNotEmpty()
    @MaxLength(30)
    @MinLength(3)
    @IsOptional()
    readonly description: string;

}