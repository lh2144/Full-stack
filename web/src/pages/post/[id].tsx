import { DeleteIcon, EditIcon } from "@chakra-ui/icons";
import { Box, Heading, IconButton, Link } from "@chakra-ui/react";
import React from "react";
import { Layout } from "src/components/Layout";
import { useDeletePostMutation, useMeQuery } from "src/generated/graphqa";
import { useGetPostFromUrl } from "src/utils/useGetPostFormURL";
import NextLink from "next/link";
const Post = ({}) => {
    const { data, error, loading } = useGetPostFromUrl();
    const { data: medata } = useMeQuery();
    const [deletePost] = useDeletePostMutation();
    let deleteButton;

    if (loading) {
        return (
            <Layout>
                <div>loading...</div>
            </Layout>
        );
    }

    if (error) {
        return <div>{error.message}</div>;
    }

    if (!data?.post) {
        return (
            <Layout>
                <Box>no post found</Box>
            </Layout>
        );
    }
    if (data?.post) {
        if (medata?.currentUser?.id !== data.post.creator.id) {
            deleteButton = null;
        } else {
            let id = data.post.id;
            deleteButton = (
                <Box>
                    <NextLink href="/post/edit/[id]" as={`/post/edit/${id}`}>
                        <IconButton
                            as={Link}
                            mr={4}
                            icon={<EditIcon></EditIcon>}
                            aria-label="Edit Post"
                        ></IconButton>
                    </NextLink>
                    <IconButton
                        icon={<DeleteIcon></DeleteIcon>}
                        aria-label="Delete Post"
                        onClick={() => {
                            deletePost({
                                variables: { id },
                                update: (cache) => {
                                    cache.evict({ id: "Post:" + id });
                                },
                            });
                        }}
                    ></IconButton>
                </Box>
            );
        }
    }
    return (
        <Layout>
            <Heading mb={4}>{data.post.title}</Heading>
            <Box mb={4}>{data.post.text}</Box>
            {deletePost}
        </Layout>
    );
};

export default Post;
