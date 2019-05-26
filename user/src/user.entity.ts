import { Entity, Column, PrimaryGeneratedColumn, BeforeInsert, BeforeUpdate, } from 'typeorm';
import { Exclude } from 'class-transformer';
import { PasswordEncoder } from './passsword-encoder';

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 50, unique: true })
    email: string;

    @Exclude()
    @Column('text', { select: false })
    password: string;

    @Column({ length: 120 })
    name: string;

    @Column('datetime')
    birthDay: Date;

    @Column()
    phone: string;

    @BeforeInsert()
    @BeforeUpdate()
    async hashPassword() {
        //todo use auth microservice to encode password
        if (this.password) {
            this.password = new PasswordEncoder().encodePassword(this.password);
        }
    }
}