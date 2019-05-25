import { Body, ClassSerializerInterceptor, Controller, Post, UseInterceptors } from '@nestjs/common';

import { UserService } from '../user/user.service';
import { AuthService } from './auth.service';
import { Credentials } from './dto/credentials.dto';
import { RegisterUserDto } from './dto/register-user.dto';
import { Token } from './dto/token.interface';

@UseInterceptors(ClassSerializerInterceptor)
@Controller("api/auth")
export class AuthController {
    constructor(
        private readonly userService: UserService,
        private readonly authService: AuthService, ) { }

    @Post("register")
    registerUser(@Body() registerUserDto: RegisterUserDto): Promise<Token> {
        return this.authService.register(registerUserDto);
    }

    @Post("login")
    registerUloginser(@Body() credentials: Credentials): Promise<Token> {
        return this.authService.signIn(credentials);
    }
}