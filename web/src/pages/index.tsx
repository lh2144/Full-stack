import React from "react";
import { NavBar } from "src/components/navbar";
import { withUrqlClient } from "next-urql";
import { createUrqlClient } from "src/utils/createUrqlClient";
import { usePostsQuery } from "src/generated/graphqa";

const Index = () => {
    const [{data}] = usePostsQuery();
    return (
        <>
            <NavBar />
            <div>Hello worl</div>
            {!data ? null : data.posts.map(p => <div key={p.id}>{p.title}</div>)}
        </>
    );
};

export default withUrqlClient(createUrqlClient, {ssr: true})(Index);
