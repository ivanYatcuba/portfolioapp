import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { JwtPayload } from './dto/jwt-payload.interface';
import { UserInfo } from './dto/user-info.dto';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(@Inject('AUTH_SERVICE') private readonly authService: ClientProxy, ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: 'secretKey',
    });
  }

  async validate(payload: JwtPayload): Promise<UserInfo> {
    const user = await this.authService.send<UserInfo>({ cmd: "auth-validate" }, payload).toPromise();
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}