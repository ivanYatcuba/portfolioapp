import { MinLength, MaxLength, IsNotEmpty, IsString } from "class-validator";
import { ApiModelProperty } from "@nestjs/swagger";

export class CreateItemDto {

    @IsString()
    @IsNotEmpty()
    @MaxLength(30)
    @MinLength(3)
    @ApiModelProperty({ type: String, description: "Item title" })
    readonly title: string;

    @IsString()
    @IsNotEmpty()
    @MaxLength(30)
    @MinLength(3)
    @ApiModelProperty({ type: String, description: "Item description" })
    readonly description: string;

}