import { Field, ObjectType } from "type-graphql";
import {
    BaseEntity,
    Column,
    CreateDateColumn,
    Entity,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from "typeorm";
import { Post } from "./Post";
import { Updoot } from "./Updoot";

@ObjectType()
@Entity()
export class User extends BaseEntity {
    @Field()
    @PrimaryGeneratedColumn()
    public id!: number;

    @Field()
    @Column({ unique: true })
    public username!: string;

    @Field()
    @Column({ unique: true })
    public email!: string;

    @Column()
    public password!: string;

    @OneToMany(() => Post, (post) => post.creator)
    public posts: Post[];

    @OneToMany(() => Updoot, (updoot) => updoot.user)
    public updoots: Updoot[];

    @Field(() => String)
    @CreateDateColumn()
    public createdAt: Date;

    @Field(() => String)
    @UpdateDateColumn()
    public updatedAt: Date;
}
