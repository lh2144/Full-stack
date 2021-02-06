import { Box, Button, Flex, Link } from "@chakra-ui/react";
import React from "react";
import NextLink from "next/link";
import { useLogoutMutation, useMeQuery } from "src/generated/graphqa";

interface NavBarProps {}

export const NavBar: React.FC<NavBarProps> = ({}) => {
    const [{fetching: logoutFetching}, logout] = useLogoutMutation();
    const [{ data, fetching }] = useMeQuery();
    let body;
    if (fetching) {
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
            <Flex>
                <Box mr={2}>{data.currentUser}</Box>
                <Button variant="link" onClick={() => {
                    logout();
                }} isLoading={logoutFetching}>
                    Logout
                </Button>
            </Flex>
        )
    }
    return (
        <Flex bg="tan" p={4}>
            <Box ml={"auto"}>
                {body}
            </Box>
        </Flex>
    );
};
