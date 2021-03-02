import { Box, Flex, Heading, Link, Stack, Text } from "@chakra-ui/react";
import React from "react";
import { Layout } from "src/components/Layout";
import { UpdootSection } from "src/components/UpdootSection";
import { usePostsQuery } from "src/generated/graphqa";
import { withApollo } from "src/utils/withApollo";
import NextLink from 'next/link';
const Index = () => {
    const { data, error, loading, fetchMore, variables } = usePostsQuery({
        variables: {
            limit: 15,
            cursor: null,
        },
        notifyOnNetworkStatusChange: true,
    });

    if (!loading && !data) {
        return (
            <div>
                <div>unknown reason cause error</div>
                <div>{error?.message}</div>
            </div>
        );
    }

    return (
        <Layout>
            {!data && loading ? (
                <div>Loading...</div>
            ) : (
                <Stack spacing={8}>
                    {data!.posts.posts.map((p) =>
                        !p ? null : (
                            <Flex
                                key={p.id}
                                p={5}
                                shado w="md"
                                borderWidth="1px"
                            >
                                <UpdootSection post={p} />
                                <Box flex={1}>
                                    <NextLink
                                        href="/post/[id]"
                                        as={`/post/${p.id}`}
                                    >
                                        <Link>
                                            <Heading fontSize="xl">
                                                {p.title}
                                            </Heading>
                                        </Link>
                                    </NextLink>
                                    <Text>posted by {p.creator.username}</Text>
                                    <Flex align="center">
                                        <Text flex={1} mt={4}>
                                            {p.textSnippet}
                                        </Text>
                                    </Flex>
                                </Box>
                            </Flex>
                        )
                    )}
                </Stack>
            )}
        </Layout>
    );
};
export default withApollo({ ssr: true })(Index);
