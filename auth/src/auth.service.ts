import { Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ClientProxy } from '@nestjs/microservices';

import { Credentials } from './dto/credentials.dto';
import { JwtPayload } from './dto/jwt-payload.interface';
import { RegisterUserDto } from './dto/register-user.dto';
import { UserInfo } from './dto/user-info.dto';

@Injectable()
export class AuthService {
  constructor(
    @Inject('USER_SERVICE') private readonly userService: ClientProxy,
    private readonly jwtService: JwtService) { }

  async register(registerUserDto: RegisterUserDto) {
    return this.userService
      .send<UserInfo>({ cmd: 'user-register' }, registerUserDto)
      .toPromise().then(() => {
        return this.signIn(new Credentials(registerUserDto.email, registerUserDto.password));
      });
  }

  async signIn(credentials: Credentials) {
    const expiresIn = 6000 * 60;
    const user = await this.userService
      .send<UserInfo>({ cmd: 'user-login' }, credentials)
      .toPromise();
    const token = this.jwtService.sign({ email: user.email, expiresIn: expiresIn });
    return { token: token };
  }

  async validateUser(signedUser: JwtPayload): Promise<UserInfo> {
    if (signedUser && signedUser.email) {
      return this.userService
        .send<UserInfo>({ cmd: 'user-find-by-email' }, signedUser.email)
        .toPromise();
    }
  }
}