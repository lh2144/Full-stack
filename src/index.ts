import 'reflect-metadata';
import { MikroORM } from '@mikro-orm/core';
import { __prod__ } from './constants';
import mikroConfig from './mikro-orm.config';
import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import { buildSchema } from 'type-graphql';
import { PostResolver } from './resolvers/post';
import { UserResolver } from './resolvers/user';
import redis from 'redis';
import session from 'express-session';
import connectRedis from 'connect-redis';
import { MyContext } from './types';

const main = async () => {
    const RedisStore = connectRedis(session);
    const redisClient = redis.createClient();
    const orm = await MikroORM.init(mikroConfig);
    await orm.getMigrator().up();

    const app = express();
    app.use(
        session({
            name: 'hang',
            store: new RedisStore({ client: redisClient, disableTouch: true }),
            cookie: {
                maxAge: 1000 * 3600 * 24 * 365,
                httpOnly: true,
                secure: __prod__,
                sameSite: 'lax'
            },
            secret: 'whatsupman',
            resave: false,
        })
    );
    const apolloServer = new ApolloServer({
        schema: await buildSchema({
            resolvers: [PostResolver, UserResolver],
            validate: false,
        }),
        context: ({req, res}): MyContext => ({ em: orm.em, req, res }),
    });
    apolloServer.applyMiddleware({ app });
    app.listen(4000, () => {
        console.log('server started on localhost: 4000');
    });
};

main().catch((err) => console.log(err));
