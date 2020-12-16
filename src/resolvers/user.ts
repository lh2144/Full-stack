import { User } from "../entities/User";
import { MyContext } from "src/types";
import argon2 from 'argon2';
import { Arg, Ctx, Field, InputType, Mutation, ObjectType, Resolver } from "type-graphql";

@InputType() 
class UserNamePaswwordInput {
    @Field()
    public userName: string;
    @Field()
    public password: string;
}

@ObjectType()
class FieldError {
    @Field()
    public field: string;
    
    @Field()
    public message: string;
}

@ObjectType()
class UserResponse {
    @Field(() => [FieldError], { nullable: true})
    public errors?: FieldError[];

    @Field(() => User, { nullable: true})
    public user?: User;
}

@Resolver()
export class UserResolver {
    @Mutation(() => User)
    public async register(
        @Arg('options') options: UserNamePaswwordInput,
        @Ctx() {em}: MyContext
    ): Promise<UserResponse> {
        const hashedPassword = await argon2.hash(options.password);
        const user = em.create(User, {userName: options.userName, password: hashedPassword});
        await em.persistAndFlush(user);
        return {user};
    }

    @Mutation(() => UserResponse)
    public async login(
        @Arg('options') options: UserNamePaswwordInput,
        @Ctx() {em}: MyContext
    ): Promise<UserResponse>{
        const user = await em.findOne(User, {userName: options.userName});
        if (!user) {
            return {
                errors: [{
                    field: 'username',
                    message: 'that username does not exist'
                }],
            };
        }
        const valid  = await argon2.verify(user.password, options.password)
        if (!valid) {
            return {
                errors: [{
                    field: 'password',
                    message: 'paswword invalid'
                }]
            };
        }
        return {user};
    }
}