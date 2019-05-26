import { Controller, Get, UseGuards, Put, Body } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { CurrentUser } from './user.decorator';
import { User } from './user.entity';
import { UserService } from './user.service';
import { UpdateUserDto } from './update-user.dto';

@Controller("api/user")
export class UserController {
    constructor(
        private readonly userService: UserService, ) { }

    @Get()
    @UseGuards(AuthGuard("jwt"))
    getMyUserInfo(@CurrentUser('id') currentUserId: number): Promise<User> {
        return this.userService.findById(currentUserId);
    }

    @Put()
    @UseGuards(AuthGuard("jwt"))
    updateMyUserInfo(
        @Body() updateUserDto: UpdateUserDto,
        @CurrentUser('id') currentUserId: number): Promise<User> {
        return this.userService.updateUser(currentUserId, updateUserDto);
    }
}
