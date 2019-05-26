import { MinLength, MaxLength, IsNotEmpty, IsString, IsOptional } from "class-validator";
import { ApiModelProperty } from "@nestjs/swagger";

export class UpdateItemDto {

    @IsString()
    @IsNotEmpty()
    @MaxLength(30)
    @MinLength(3)
    @IsOptional()
    @ApiModelProperty({ type: String, description: "Item title" })
    readonly title: string;

    @IsString()
    @IsNotEmpty()
    @MaxLength(30)
    @MinLength(3)
    @IsOptional()
    @ApiModelProperty({ type: String, description: "Item title" })
    readonly description: string;

}