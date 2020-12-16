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

const main = async () => {
    const RedisStore = connectRedis(session);
    const redisClient = redis.createClient();
    const orm = await MikroORM.init(mikroConfig);
    console.log(orm.em, 'fdsf');
    await orm.getMigrator().up();

    const app = express();
    const apolloServer = new ApolloServer({
        schema: await buildSchema({
            resolvers: [PostResolver, UserResolver],
            validate: false,
        }),
        context: () => ({ em: orm.em }),
    });
    app.use(
        session({
            name: 'hang',
            store: new RedisStore({ client: redisClient }),
            secret: 'whatsupman',
            resave: false,
        })
    );
    apolloServer.applyMiddleware({ app });
    app.listen(4000, () => {
        console.log('server started on localhost: 4000');
    });
};

main().catch((err) => console.log(err));
