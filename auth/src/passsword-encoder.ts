import * as bcrypt from 'bcrypt';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PasswordEncoder {

    encodePassword(password: string): string {
        return bcrypt.hashSync(password, 10);
    }

    compareHases(plainTextPassword: string, passwordHash: string): boolean {
        return bcrypt.compareSync(plainTextPassword, passwordHash);
    }
}