import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
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
import {
    ApiBearerAuth,
    ApiCreatedResponse,
    ApiForbiddenResponse,
    ApiNotFoundResponse,
    ApiOkResponse,
    ApiOperation,
    ApiUnauthorizedResponse,
    ApiUnprocessableEntityResponse,
    ApiUseTags,
} from '@nestjs/swagger';

import { CurrentUser } from '../user/user.decorator';
import { User } from '../user/user.entity';
import { CreateItemDto } from './dto/create-item.dto';
import { SearchItemQuery } from './dto/item-search.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import { Item } from './item.entity';
import { ItemService } from './item.service';

@ApiBearerAuth()
@ApiUseTags('item')
@Controller('api/item')
export class ItemController {
    constructor(
        private readonly itemService: ItemService, ) { }

    @ApiOperation({ title: 'Create new item' })
    @ApiCreatedResponse({ description: 'New item created' })
    @ApiUnauthorizedResponse({ description: 'Not authorized' })
    @Put()
    @HttpCode(201)
    @UseGuards(AuthGuard("jwt"))
    createItem(
        @Body() createItemDto: CreateItemDto,
        @CurrentUser() currentUser: User): Promise<Item> {
        return this.itemService.createItem(currentUser, createItemDto);
    }

    @ApiOperation({ title: 'Update existing item' })
    @ApiOkResponse({ description: 'Item updated' })
    @ApiUnprocessableEntityResponse({ description: 'Data validation error.' })
    @ApiNotFoundResponse({ description: 'Item with this id not found' })
    @ApiForbiddenResponse({ description: 'You cannot modify this item' })
    @ApiUnauthorizedResponse({ description: 'Not authorized' })
    @Put(":id")
    @UseGuards(AuthGuard("jwt"))
    updateItem(
        @Param('id') id: number,
        @Body() updateItemDto: UpdateItemDto): Promise<Item> {
        return this.itemService.updateItem(id, updateItemDto);
    }

    @ApiOperation({ title: 'Get existing item by id' })
    @ApiOkResponse({ description: 'Item details' })
    @ApiNotFoundResponse({ description: 'Item with this id not found' })
    @ApiForbiddenResponse({ description: 'You cannot modify this item' })
    @ApiUnauthorizedResponse({ description: 'Not authorized' })
    @Get(":id")
    @UseGuards(AuthGuard("jwt"))
    getItem(@Param('id') id: number): Promise<Item> {
        return this.itemService.getItem(id);
    }

    @ApiOperation({ title: 'Remove item by id' })
    @ApiOkResponse({ description: 'Removed item details' })
    @ApiNotFoundResponse({ description: 'Item with this id not found' })
    @ApiForbiddenResponse({ description: 'You cannot modify this item' })
    @ApiUnauthorizedResponse({ description: 'Not authorized' })
    @Delete(":id")
    @UseGuards(AuthGuard("jwt"))
    deleteItem(@Param('id') id: number): Promise<Item> {
        return this.itemService.removeItem(id);
    }

    @ApiOperation({ title: 'Attach image to item' })
    @ApiCreatedResponse({ description: 'Image successfuly added' })
    @ApiNotFoundResponse({ description: 'Item with this id not found' })
    @ApiForbiddenResponse({ description: 'You cannot modify this item' })
    @ApiUnauthorizedResponse({ description: 'Not authorized' })
    @Post(':id/image')
    @UseInterceptors(FileInterceptor('file'))
    uploadItemFile(@Param('id') id: number, @UploadedFile() file) {
        return this.itemService.updateItemImage(id, file.path);
    }

    @ApiOperation({ title: 'Remove image from item' })
    @ApiOkResponse({ description: 'Image successfuly removed' })
    @ApiNotFoundResponse({ description: 'Item with this id not found' })
    @ApiForbiddenResponse({ description: 'You cannot modify this item' })
    @ApiUnauthorizedResponse({ description: 'Not authorized' })
    @Delete(':id/image')
    deleteFile(@Param('id') id: number) {
        return this.itemService.deleteItemImage(id);
    }

    @ApiOperation({ title: 'Search items by filter' })
    @ApiOkResponse({ description: 'Filtered items' })
    @ApiUnauthorizedResponse({ description: 'Not authorized' })
    @Get()
    @UseGuards(AuthGuard("jwt"))
    searchItems(@Query() itemSearchQuery: SearchItemQuery): Promise<Item[]> {
        return this.itemService.searchItems(itemSearchQuery);
    }
}
