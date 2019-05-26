import { IsIn, IsInt, IsNotEmpty, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export enum OrderBy {
    asc,
    desc,
}

export enum OrderType {
    createdAt,
    description,
}

export class SearchItemQuery {

    @IsString()
    @IsNotEmpty()
    @MaxLength(30)
    @MinLength(3)
    @IsOptional()
    readonly title: string;

    @IsString()
    @IsOptional()
    readonly description: string;

    @IsOptional()
    @IsIn([OrderBy[OrderBy.asc], OrderBy[OrderBy.desc]])
    readonly orderBy: string = OrderBy[OrderBy.desc];

    @IsOptional()
    @IsIn([OrderType[OrderType.createdAt], OrderType[OrderType.description]])
    readonly orderType: string = OrderType[OrderType.createdAt];

}