import { Controller, Get, Post, Body, UseInterceptors, ClassSerializerInterceptor, SerializeOptions } from '@nestjs/common';
import { Credentials } from './dto/credentials.dto';
import { UserService } from '../user/user.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { User } from '../user/user.entity';
import { AuthService } from './auth.service';

@UseInterceptors(ClassSerializerInterceptor)
@Controller("api/auth")
export class AuthController {
    constructor(
        private readonly userService: UserService,
        private readonly authService: AuthService, ) { }

    @Post("register")
    @SerializeOptions({
        excludePrefixes: ["password"]
    })
    registerUser(@Body() registerUserDto: RegisterUserDto): Promise<User> {
        return this.userService.registerUser(registerUserDto);
    }

    @Get("login")
    registerUloginser(@Body() credentials: Credentials): Promise<string> {
        return this.authService.signIn(credentials);
    }
}