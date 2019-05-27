import { Body, ClassSerializerInterceptor, Controller, Post, UseInterceptors, UseFilters } from '@nestjs/common';
import { ApiConflictResponse, ApiCreatedResponse, ApiNotFoundResponse, ApiOperation, ApiUseTags, ApiUnprocessableEntityResponse } from '@nestjs/swagger';

import { AuthService } from './auth.service';
import { Credentials } from './dto/credentials.dto';
import { RegisterUserDto } from './dto/register-user.dto';
import { Token } from './dto/token.interface';
import { Http2RpcExceptionFilter } from './exception/http-rpc-exception.filter';
import { Rpc2HttpExceptionFilter } from './exception/rpc-http-exception.filter';
import { MessagePattern } from '@nestjs/microservices';
import { JwtPayload } from './dto/jwt-payload.interface';
import { UserInfo } from './dto/user-info.dto';

@ApiUseTags('auth')
@Controller("api/auth")
export class AuthController {
    constructor(
        private readonly authService: AuthService, ) { }

    @ApiOperation({ title: 'Register new user' })
    @ApiCreatedResponse({ description: 'User sucessfully registered. Returns bearer token' })
    @ApiConflictResponse({ description: 'User with this email already exists.' })
    @ApiUnprocessableEntityResponse({ description: 'Data validation error.' })
    @Post("register")
    @UseFilters(Rpc2HttpExceptionFilter)
    registerUser(@Body() registerUserDto: RegisterUserDto): Promise<Token> {
        return this.authService.register(registerUserDto);
    }

    @ApiOperation({ title: 'Authorize user' })
    @ApiCreatedResponse({ description: 'User authorized. New token returned.' })
    @ApiNotFoundResponse({ description: 'User With such credentials not found' })
    @ApiUnprocessableEntityResponse({ description: 'Data validation error.' })
    @Post("login")
    @UseFilters(Rpc2HttpExceptionFilter)
    registerUloginser(@Body() credentials: Credentials): Promise<Token> {
        return this.authService.signIn(credentials);
    }

    @UseFilters(Http2RpcExceptionFilter)
    @MessagePattern({ cmd: 'auth-validate' })
    validateUser(signedUser: JwtPayload): Promise<UserInfo> {
        return this.authService.validateUser(signedUser);
    }
}