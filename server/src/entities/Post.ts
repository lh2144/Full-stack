import { Entity, PrimaryKey, Property } from "@mikro-orm/core";
import { Field, Int, ObjectType } from "type-graphql";
import { Column, CreateDateColumn, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@ObjectType()
@Entity()
export class Post {
    @PrimaryGeneratedColumn()
    @Field(() => Int)
    public id!: number;

    @Field(() => String)
    @CreateDateColumn({})
    public createdAt: Date;

    @Field(() => String)
    @UpdateDateColumn({})
    public updatedAt: Date;

    @Field()
    @Column({})
    public title!: string;
}
