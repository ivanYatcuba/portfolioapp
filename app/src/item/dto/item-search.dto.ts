import { IsIn, IsInt, IsNotEmpty, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export enum OrderBy {
    asc,
    desc,
}

export enum OrderType {
    createdAt,
    title,
}

export class SearchItemQuery {

    @IsString()
    @IsNotEmpty()
    @MaxLength(30)
    @MinLength(3)
    @IsOptional()
    readonly title: string;

    @IsOptional()
    readonly userId: number;

    @IsOptional()
    @IsIn([OrderBy.asc, OrderBy.desc])
    readonly orderBy: OrderBy = OrderBy.desc;

    @IsOptional()
    @IsIn([OrderType.createdAt, OrderType.title])
    readonly orderType: OrderType = OrderType.createdAt;

}