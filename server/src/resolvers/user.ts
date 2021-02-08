import { User } from "../entities/User";
import { MyContext } from "src/types";
import argon2 from "argon2";
import {
    Arg,
    Ctx,
    Field,
    InputType,
    Mutation,
    ObjectType,
    Query,
    Resolver,
} from "type-graphql";
import { validateRegister } from "../utils/validateRegister";
import { EntityManager } from "@mikro-orm/postgresql";
import { Cookie_name } from "../constants";

@InputType()
export class UserNamePasswordInput {
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
    @Field(() => [FieldError], { nullable: true })
    public errors?: FieldError[];

    @Field(() => User, { nullable: true })
    public user?: User;
}

@Resolver()
export class UserResolver {
    // @Mutation(() => Boolean)
    // public forgotPassword(
    //     @Arg('email') email: string,
    //     @Ctx() { em }: MyContext
    // ) {
    //     return true;
    // }
    @Query(() => User, { nullable: true })
    public async currentUser(
        @Ctx() { req, em }: MyContext
    ): Promise<User | null> {
        if (!req.session.userId) {
            return null;
        }
        const user = await em.findOne(User, { id: req.session.userId });
        return user;
    }

    @Mutation(() => UserResponse)
    public async register(
        @Arg("options") options: UserNamePasswordInput,
        @Ctx() { em, req }: MyContext
    ): Promise<UserResponse> {
        const errors = validateRegister(options);

        if (errors) {
            return { errors };
        }

        const hashedPassword = await argon2.hash(options.password);
        let user;
        //  = em.create(User, {userName: options.userName, password: hashedPassword});
        try {
            const result = await (em as EntityManager)
                .createQueryBuilder(User)
                .getKnexQuery()
                .insert({
                    userName: options.userName,
                    password: hashedPassword,
                    created_at: new Date(),
                    updated_at: new Date(),
                }).returning('*');
            user =result[0];
            await em.persistAndFlush(user);
        } catch (err) {
            if (err.code === "23505") {
                return {
                    errors: [
                        {
                            field: "username",
                            message: "username already taken",
                        },
                    ],
                };
            }
        }
        req.session.userId = user?.id;
        return { user };
    }

    @Mutation(() => UserResponse)
    public async login(
        @Arg("options") options: UserNamePasswordInput,
        @Ctx() { em, req }: MyContext
    ): Promise<UserResponse> {
        const user = await em.findOne(User, { userName: options.userName });
        if (!user) {
            return {
                errors: [
                    {
                        field: "username",
                        message: "that username does not exist",
                    },
                ],
            };
        }
        const valid = await argon2.verify(user.password, options.password);
        if (!valid) {
            return {
                errors: [
                    {
                        field: "password",
                        message: "paswword invalid",
                    },
                ],
            };
        }

        req.session.userId = user.id;
        return { user };
    }

    @Mutation(() => Boolean)
    public logout(
        @Ctx() {req, res}: MyContext
    ) {
        return new Promise((resolve) => req.session.destroy((err: any) => {
            res.clearCookie(Cookie_name);
            if (err) {
                resolve(false);
                return;
            }

            resolve(true);
        }));
    }
}
