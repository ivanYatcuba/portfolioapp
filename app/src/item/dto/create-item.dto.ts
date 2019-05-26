import { MinLength, MaxLength, IsNotEmpty, IsString } from "class-validator";

export class CreateItemDto {

    @IsString()
    @IsNotEmpty()
    @MaxLength(30)
    @MinLength(3)
    readonly title: string;

    @IsString()
    @IsNotEmpty()
    @MaxLength(30)
    @MinLength(3)
    readonly description: string;

}