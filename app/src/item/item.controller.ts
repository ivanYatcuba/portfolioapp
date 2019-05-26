import { Controller, Put, UseGuards, Body } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CurrentUser } from '../user/user.decorator';
import { Item } from './item.entity';
import { CreateItemDto } from './dto/create-item.dto';
import { ItemService } from './item.service';
import { User } from '../user/user.entity';

@Controller('api/item')
export class ItemController {
    constructor(
        private readonly itemService: ItemService, ) { }

    @Put()
    @UseGuards(AuthGuard("jwt"))
    createItem(
        @Body() updateUserDto: CreateItemDto,
        @CurrentUser() currentUser: User): Promise<Item> {
        return this.itemService.createItem(currentUser, updateUserDto);
    }

}
