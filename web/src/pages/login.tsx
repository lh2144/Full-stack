import React from "react";
import { Formik, Form } from "formik";
import { Wrapper } from "src/components/wrapper";
import { InputField } from "src/components/inputField";
import { Box, Button } from "@chakra-ui/react";
import { MeDocument, MeQuery, useLoginMutation } from "src/generated/graphqa";
import { toErrorMap } from "src/utils/toErrorMap";
import { useRouter } from "next/router";
import { withApollo } from "src/utils/withApollo";

export const Login: React.FC<{}> = ({}) => {
    const [login] = useLoginMutation();
    const router = useRouter();
    return (
        <Wrapper variant="small">
            <Formik
                initialValues={{ usernameOrEmail: "", password: "" }}
                onSubmit={async (values, { setErrors }) => {
                    const response = await login({
                        variables: values,
                        update: (cache, { data }) => {
                            cache.writeQuery<MeQuery>({
                                query: MeDocument,
                                data: {
                                    __typename: "Query",
                                    currentUser: data?.login.user,
                                },
                            });
                            cache.evict({ fieldName: "posts" });
                        },
                    });
                    if (response.data?.login.errors) {
                        setErrors(toErrorMap(response.data.login.errors));
                    } else if (response.data?.login.user) {
                        if (response.data.login.token) {
                            localStorage.setItem(
                                "token",
                                response.data?.login.token
                            );
                        }
                        router.push("/");
                    }
                }}
            >
                {({ isSubmitting }) => (
                    <Form>
                        <InputField
                            name="usernameOrEmail"
                            placeholder="usernameOrEmail"
                            label="Username or Email"
                        />
                        <Box mt={4}>
                            <InputField
                                name="password"
                                placeholder="password"
                                label="Password"
                                type="password"
                            />
                        </Box>
                        <Button
                            type="submit"
                            isLoading={isSubmitting}
                            colorScheme="teal"
                        >
                            Login
                        </Button>
                    </Form>
                )}
            </Formik>
        </Wrapper>
    );
};

export default withApollo({ ssr: false })(Login);
