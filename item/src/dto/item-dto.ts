import { UserInfo } from './user-info.dto';

export class ItemDto {

    id: number;

    user: UserInfo;

    title: string;

    description: string;

    image: string;

    createdAt: Date;
}