import { Box, Button, Flex, Heading, Link } from "@chakra-ui/react";
import React from "react";
import NextLink from "next/link";
import { useLogoutMutation, useMeQuery } from "src/generated/graphqa";
import { isServer } from "src/utils/isServer";
import { useRouter } from "next/router";
import { useApolloClient } from "@apollo/client";

interface NavBarProps {}

export const NavBar: React.FC<NavBarProps> = ({}) => {
    const router = useRouter();
    const [logout, { loading: logoutFetching }] = useLogoutMutation();
    const { data, loading } = useMeQuery({
        skip: isServer(),
    });
    const apolloClient = useApolloClient();
    let body;
    if (loading) {
    } else if (!data?.currentUser) {
        body = (
            <>
                <NextLink href="/login">
                    <Link mr={2}>login</Link>
                </NextLink>
                <NextLink href="/register">
                    <Link>register</Link>
                </NextLink>
            </>
        );
    } else {
        body = (
            <Flex align="center">
                <NextLink href="/create-post">
                    <Button as={Link} mr={4}>
                        create post
                    </Button>
                </NextLink>
                <Box mr={2}>{data.currentUser.username}</Box>
                <Button
                    onClick={async () => {
                        await logout();
                        await apolloClient.resetStore();
                        localStorage.removeItem('token');
                    }}
                    isLoading={logoutFetching}
                    variant="link"
                >
                    logout
                </Button>
            </Flex>
        );
    }
    return (
        <Flex zIndex={1} position="sticky" top={0} bg="tan" p={4}>
            <Flex flex={1} m="auto" align="center" maxW={800}>
                <NextLink href="/">
                    <Link>
                        <Heading>Simple reddit</Heading>
                    </Link>
                </NextLink>
                <Box ml={"auto"}>{body}</Box>
            </Flex>
        </Flex>
    );
};
