import { ObjectType, Field, Int } from "type-graphql";
import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    BaseEntity,
    ManyToOne,
    OneToMany,
} from "typeorm";
import { User } from "./User";
import { Updoot } from "./Updoot";

@ObjectType()
@Entity()
export class Post extends BaseEntity {
    @Field()
    @PrimaryGeneratedColumn()
    public id!: number;

    @Field()
    @Column()
    public title!: string;

    @Field()
    @Column()
    public text!: string;

    @Field()
    @Column({ type: "int", default: 0 })
    public points!: number;

    @Field(() => Int, { nullable: true })
    public voteStatus: number | null; // 1 or -1 or null

    @Field()
    @Column()
    public creatorId: number;

    @Field()
    @ManyToOne(() => User, (user) => user.posts)
    public creator: User;

    @OneToMany(() => Updoot, (updoot) => updoot.post)
    public updoots: Updoot[];

    @Field(() => String)
    @CreateDateColumn()
    public createdAt: Date;

    @Field(() => String)
    @UpdateDateColumn()
    public updatedAt: Date;
}