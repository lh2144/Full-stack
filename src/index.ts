import { MikroORM } from '@mikro-orm/core';
import { __prod__ } from './constants';
import { Post } from './entities/Post';
import mikroConfig from './mikro-orm.config';
import express from 'express';

const main = async () => {
    const orm = await MikroORM.init(mikroConfig);

    const post = orm.em.create(Post, {title: 'my first post'});
    await orm.em.persistAndFlush(post);

    const app = express();
    app.get('/', (_, res) => {
        res.send('hello')
    });
    app.listen(4000, () => {})
}


main().catch((err) => console.log(err));