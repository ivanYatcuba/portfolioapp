import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { CurrentUser } from './user.decorator';
import { User } from './user.entity';
import { UserService } from './user.service';

@Controller("api/user")
export class UserController {
    constructor(
        private readonly userService: UserService, ) { }

    @Get()
    @UseGuards(AuthGuard("jwt"))
    getMyUserInfo(@CurrentUser('email') currentUserEmail: string): Promise<User> {
        return this.userService.findByEmail(currentUserEmail);
    }
}
