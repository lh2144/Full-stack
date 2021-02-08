import "reflect-metadata";
import { MikroORM } from "@mikro-orm/core";
import { Cookie_name, __prod__ } from "./constants";
import mikroConfig from "./mikro-orm.config";
import express from "express";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import { PostResolver } from "./resolvers/post";
import { UserResolver } from "./resolvers/user";
import Redis from "ioredis";
import session from "express-session";
import connectRedis from "connect-redis";
import { MyContext } from "./types";

const main = async () => {
    // sendEmail('hang@lian.com', 'hello ther')

    const orm = await MikroORM.init(mikroConfig);
    await orm.getMigrator().up();

    const app = express();
    const RedisStore = connectRedis(session);
    const redis = new Redis();
    app.use(
        session({
            name: Cookie_name,
            store: new RedisStore({ client: redis, disableTouch: true }),
            cookie: {
                maxAge: 1000 * 3600 * 24 * 365,
                httpOnly: true,
                secure: __prod__,
                sameSite: "lax",
            },
            secret: "whatsupman",
            resave: false,
        })
    );
    const apolloServer = new ApolloServer({
        schema: await buildSchema({
            resolvers: [PostResolver, UserResolver],
            validate: false,
        }),
        context: ({ req, res }): MyContext => ({ em: orm.em, req, res, redis }),
    });
    apolloServer.applyMiddleware({
        app,
        cors: { origin: "http://localhost:3000", credentials: true },
        
    });
    app.listen(4000, () => {
        console.log("server started on localhost: 4000");
    });
};

main().catch((err) => console.log(err));
