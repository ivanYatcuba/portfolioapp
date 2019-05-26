import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Post,
    Put,
    Query,
    UploadedFile,
    UseGuards,
    UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';

import { CurrentUser } from '../user/user.decorator';
import { User } from '../user/user.entity';
import { CreateItemDto } from './dto/create-item.dto';
import { SearchItemQuery } from './dto/item-search.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import { Item } from './item.entity';
import { ItemService } from './item.service';

@Controller('api/item')
export class ItemController {
    constructor(
        private readonly itemService: ItemService, ) { }


    @Put()
    @UseGuards(AuthGuard("jwt"))
    createItem(
        @Body() createItemDto: CreateItemDto,
        @CurrentUser() currentUser: User): Promise<Item> {
        return this.itemService.createItem(currentUser, createItemDto);
    }

    @Put(":id")
    @UseGuards(AuthGuard("jwt"))
    updateItem(
        @Param('id') id: number,
        @Body() updateItemDto: UpdateItemDto): Promise<Item> {
        return this.itemService.updateItem(id, updateItemDto);
    }

    @Get(":id")
    @UseGuards(AuthGuard("jwt"))
    getItem(@Param('id') id: number): Promise<Item> {
        return this.itemService.getItem(id);
    }

    @Delete(":id")
    @UseGuards(AuthGuard("jwt"))
    deleteItem(@Param('id') id: number): Promise<Item> {
        return this.itemService.removeItem(id);
    }

    @Post(':id/image')
    @UseInterceptors(FileInterceptor('file'))
    uploadItemFile(@Param('id') id: number, @UploadedFile() file) {
        return this.itemService.updateItemImage(id, file.path);
    }

    @Delete(':id/image')
    deleteFile(@Param('id') id: number) {
        return this.itemService.deleteItemImage(id);
    }

    @Get()
    @UseGuards(AuthGuard("jwt"))
    searchItems(@Query() itemSearchQuery: SearchItemQuery): Promise<Item[]> {
        return this.itemService.searchItems(itemSearchQuery);
    }
}
