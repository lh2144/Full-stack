import React from "react";
import { NavBar } from "src/components/navbar";
import { withUrqlClient } from "next-urql";
import { createUrqlClient } from "src/utils/createUrqlClient";
import { usePostsQuery } from "src/generated/graphqa";
import { Layout } from "src/components/Layout";
import { Flex, Stack } from "@chakra-ui/react";

const Index = () => {
    const { data, error, loading, fetchMore, variables } = usePostsQuery({
        variables: {
            limit: 15,
            cursor: null,
        },
        notifyOnNetworkStatusChange: true,
    });

    if (!loading && !data) {
        return <div>
            <div>unknown reason cause error</div>
            <div>{error?.message}</div>
        </div>;
    }

    return (
        <Layout>
            {!data && loading ? (<div>Loading...</div>) : (
                <Stack spacing={8}>
                    {data!.posts.posts.map((p) => 
                    !p ? null : (
                        <Flex></Flex>
                    ))}
                </Stack>
            )}
        </Layout>
    )
};
