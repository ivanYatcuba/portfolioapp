import { InjectRepository } from "@nestjs/typeorm";
import { User } from "./user.entity";
import { Repository } from "typeorm";
import { Injectable, NotFoundException, NotAcceptableException, ConflictException } from '@nestjs/common';
import { RegisterUserDto } from "../auth/dto/register-user.dto";
import { Credentials } from "../auth/dto/credentials.dto";
import { PasswordEncoder } from "../auth/passsword-encoder";

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

    async registerUser(userDto: RegisterUserDto): Promise<User> {
        const userExists = (await this.userRepository.count({ email: userDto.email })) > 0
        if (userExists) {
            throw new ConflictException("User with this email already exists")
        }
        let user = new User();
        user.email = userDto.email;
        user.name = userDto.name;
        user.password = userDto.password;
        user.birthDay = new Date(userDto.birthday);
        user.phone = userDto.phone;
        return this.userRepository.save(user);
    }

    public async login(credentials: Credentials): Promise<User> {
        const user = await this.findByEmail(credentials.email);

        if (!user) {
            throw new NotFoundException('User not found');
        }

        if (new PasswordEncoder().compareHases(credentials.password, user.password)) {
            throw new NotFoundException('User not found');
        }

        return user;
    }
}