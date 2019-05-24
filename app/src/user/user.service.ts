import { InjectRepository } from "@nestjs/typeorm";
import { User } from "./user.entity";
import { Repository } from "typeorm";
import { Injectable } from '@nestjs/common';
import { RegisterUserDto } from "./register-user.dto";

@Injectable()
export class UserService {

    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) { }

    findAll(): Promise<User[]> {
        return this.userRepository.find();
    }

    findByEmail(email: string): Promise<User> {
        return this.userRepository.findOne({ email: email })
    }

    save(user: User): Promise<User> {
        return this.userRepository.save(user);
    }

    registerUser(userDto: RegisterUserDto): Promise<User> {
        let user = new User();
        user.email = userDto.email;
        user.name = userDto.name;
        user.password = userDto.password;
        user.birthDay = new Date(userDto.birthday);
        user.phone = userDto.phone;
        return this.userRepository.save(user);
    }
}