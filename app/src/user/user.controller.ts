import { Body, Controller, Get, NotFoundException, Param, Put, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
    ApiBearerAuth,
    ApiNotFoundResponse,
    ApiOkResponse,
    ApiOperation,
    ApiUnauthorizedResponse,
    ApiUnprocessableEntityResponse,
    ApiUseTags,
} from '@nestjs/swagger';

import { SearchUserQuery } from './dto/search-user-query.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { CurrentUser } from './user.decorator';
import { User } from './user.entity';
import { UserService } from './user.service';

@ApiBearerAuth()
@ApiUseTags('user')
@Controller("api/user")
export class UserController {
    constructor(
        private readonly userService: UserService, ) { }

    @ApiOperation({ title: 'Get my user info' })
    @ApiOkResponse({ description: 'My user info' })
    @ApiUnauthorizedResponse({ description: 'Not authorized' })
    @Get("me")
    @UseGuards(AuthGuard("jwt"))
    getMyUserInfo(@CurrentUser('id') currentUserId: number): Promise<User> {
        return this.userService.findById(currentUserId);
    }

    @ApiOperation({ title: 'Update my user info' })
    @ApiOkResponse({ description: 'My user info with updates' })
    @ApiUnauthorizedResponse({ description: 'Not authorized' })
    @ApiUnprocessableEntityResponse({ description: 'Data validation error.' })
    @Put("me")
    @UseGuards(AuthGuard("jwt"))
    updateMyUserInfo(
        @Body() updateUserDto: UpdateUserDto,
        @CurrentUser('id') currentUserId: number): Promise<User> {
        return this.userService.updateUser(currentUserId, updateUserDto);
    }

    @ApiOperation({ title: 'Get user info by id' })
    @ApiOkResponse({ description: 'User info' })
    @ApiUnauthorizedResponse({ description: 'Not authorized' })
    @ApiNotFoundResponse({ description: 'User with this id not found' })
    @Get(":id")
    @UseGuards(AuthGuard("jwt"))
    async getUserById(@Param('id') id: number): Promise<User> {
        const user = await this.userService.findById(id);
        if (!user) {
            throw new NotFoundException();
        }
        return user;
    }

    @ApiOperation({ title: 'Search user by filter' })
    @ApiOkResponse({ description: 'Filtered users' })
    @ApiUnauthorizedResponse({ description: 'Not authorized' })
    @ApiUnprocessableEntityResponse({ description: 'Data validation error.' })
    @Get()
    @UseGuards(AuthGuard("jwt"))
    async searchUsers(@Query() userSearchQuery: SearchUserQuery): Promise<User[]> {
        return this.userService.findUsers(userSearchQuery);
    }
}
