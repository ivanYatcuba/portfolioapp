import { User } from '../user/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, BeforeInsert } from 'typeorm';

@Entity()
export class Item {

    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(type => User, user => user.id, { nullable: false, eager: true })
    user: User;

    @Column({ length: 120, nullable: false, })
    title: string;

    @Column({ length: 120, nullable: false, })
    description: string;

    @Column({ length: 120, })
    image: string = "";

    @Column('datetime', { nullable: false, })
    createdAt: Date;

    @BeforeInsert()
    async createAt() {
        this.createdAt = new Date();
    }

}