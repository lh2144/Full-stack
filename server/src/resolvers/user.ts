import argon2 from "argon2";
import jwt from "jsonwebtoken";
import { MyContext } from "src/types";
import {
    Arg,
    Ctx,
    Field,
    FieldResolver,
    Mutation,
    ObjectType,
    Query,
    Resolver,
    Root
} from "type-graphql";
import { getConnection } from "typeorm";
import { v4 } from "uuid";
import { User } from "../entities/User";
import { sendEmail } from "../utils/sendEmail";
import { validateRegister } from "../utils/validateRegister";
import { UserNamePasswordInput } from "./UserNamePasswordInput";

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

    @Field(() => String, { nullable: true })
    public token?: String;
}

@Resolver(User)
export class UserResolver {
    @FieldResolver(() => String)
    email(@Root() user: User, @Ctx() { auth }: MyContext) {
        // this is the current user and its ok to show them their own email
        if (auth.token.id === user.id) {
            return user.email;
        }
        // current user wants to see someone elses email
        return "";
    }

    @Mutation(() => UserResponse)
    public async changePassword(
        @Arg("newPassword") newPassword: string,
        @Ctx() { auth }: MyContext
    ): Promise<UserResponse> {
        if (newPassword.length <= 3) {
            return {
                errors: [
                    {
                        field: "newpassword",
                        message: "length must be grater than 3",
                    },
                ],
            };
        }

        const userId = auth.token.id;
        const user = await User.findOne(userId);
        if (!user) {
            return {
                errors: [
                    {
                        field: "id",
                        message: "user no long exists",
                    },
                ],
            };
        }
        await User.update(
            { id: userId },
            {
                password: await argon2.hash(newPassword),
            }
        );
        return { user };
    }

    @Mutation(() => Boolean)
    public async forgotPassword(@Arg("email") email: string) {
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return true;
        }
        const token = v4();
        // console.log(token);
        // try {
        //     // await redis.set(
        //     // FORGET_PASSWORD_PREFIX + token,
        //     // user.id,
        //     // "ex",
        //     // 1000 * 60 * 60 * 24 * 3);
        //     console.log("after redis");
        // } catch (err) {
        //     console.log(err);
        // }

        await sendEmail(
            email,
            `<a href="http://localhost:3000/change-password/${token}">reset password`
        );
        return true;
    }

    @Query(() => User, { nullable: true })
    public async currentUser(@Ctx() { auth }: MyContext): Promise<any> {
        if (!auth.isAuth) {
            return null;
        }
        return User.findOne(auth.token.id);
    }

    @Mutation(() => UserResponse)
    public async register(
        @Arg("options") options: UserNamePasswordInput,
        @Ctx() { }: MyContext
    ): Promise<UserResponse> {
        const errors = validateRegister(options);
        if (errors) {
            return { errors };
        }

        let user;
        let token;
        try {
            const hashedPassword = await argon2.hash(options.password);
            const result = await getConnection()
                .createQueryBuilder()
                .insert()
                .into(User)
                .values({
                    username: options.userName,
                    password: hashedPassword,
                    email: options.email,
                })
                .returning("*")
                .execute();

            user = result.raw[0];
            token = jwt.sign(
                { id: user.id, password: hashedPassword },
                "hanglian",
                { expiresIn: "1h" }
            );
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
        return {
            user,
            token,
        };
    }

    @Mutation(() => UserResponse)
    public async login(
        @Arg("usernameOrEmail") usernameOrEmail: string,
        @Arg("password") password: string,
        @Ctx() {}: MyContext
    ): Promise<UserResponse> {
        const user = await User.findOne(
            usernameOrEmail.includes("@")
                ? { where: {email: usernameOrEmail } }
                : { where : {username: usernameOrEmail } }
        );
        if (!user) {
            return {
                errors: [
                    {
                        field: "usernameOrEmail",
                        message: "that username does not exist",
                    },
                ],
            };
        }
        const valid = await argon2.verify(user.password, password);
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
        const token = jwt.sign(
            { id: user.id, password: user.password },
            "hanglian",
            { expiresIn: "1h" }
        );
        return { user, token };
    }

    @Mutation(() => Boolean)
    public logout() {
        return true;
    }
}
