import { Box, Button, Flex, Link } from "@chakra-ui/react";
import { Form, Formik } from "formik";
import { NextPage } from "next";
import NextLink from "next/link";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { InputField } from "../../components/inputField";
import { Wrapper } from "../../components/wrapper";
import {
    MeDocument,
    MeQuery,
    useChangePasswordMutation,
} from "../../generated/graphqa";
import { toErrorMap } from "../../utils/toErrorMap";
import { withApollo } from "../../utils/withApollo";

const ChangePassword: NextPage = () => {
    const router = useRouter();
    const [changePassword] = useChangePasswordMutation();
    const [tokenError, setTokenError] = useState("");
    return (
        <Wrapper variant="small">
            <Formik
                initialValues={{ newPassword: "" }}
                onSubmit={async (values, { setErrors }) => {
                    const response = await changePassword({
                        variables: {
                            newPassword: values.newPassword,
                        },
                        update: (cache, { data }) => {
                            cache.writeQuery<MeQuery>({
                                query: MeDocument,
                                data: {
                                    __typename: "Query",
                                    currentUser: data?.changePassword.user,
                                },
                            });
                        },
                    });
                    if (response.data?.changePassword.errors) {
                        const errorMap = toErrorMap(
                            response.data.changePassword.errors
                        );
                        if ("token" in errorMap) {
                            setTokenError(errorMap.token);
                        }
                        setErrors(errorMap);
                    } else if (response.data?.changePassword.user) {
                        // worked
                        router.push("/");
                    }
                }}
            >
                {({ isSubmitting }) => (
                    <Form>
                        <InputField
                            name="newPassword"
                            placeholder="new password"
                            label="New Password"
                            type="password"
                        />
                        {tokenError ? (
                            <Flex>
                                <Box mr={2} style={{ color: "red" }}>
                                    {tokenError}
                                </Box>
                                <NextLink href="/forgot-password">
                                    <Link>click here to get a new one</Link>
                                </NextLink>
                            </Flex>
                        ) : null}
                        <Button
                            mt={4}
                            type="submit"
                            isLoading={isSubmitting}
                            variantColor="teal"
                        >
                            change password
                        </Button>
                    </Form>
                )}
            </Formik>
        </Wrapper>
    );
};

export default withApollo({ ssr: false })(ChangePassword);
