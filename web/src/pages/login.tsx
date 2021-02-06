import React from "react";
import { Formik, Form } from "formik";
import { Wrapper } from "src/components/wrapper";
import { InputField } from "src/components/inputField";
import { Box, Button } from "@chakra-ui/react";
import { useLoginMutation } from "src/generated/graphqa";
import { toErrorMap } from "src/utils/toErrorMap";
import { useRouter } from 'next/router';

export const login: React.FC<{}> = ({}) => {
    const [, login] = useLoginMutation();
    const router = useRouter();
    return (
        <Wrapper variant="small">
            <Formik
                initialValues={{ userName: "", password: "" }}
                onSubmit={async (values, { setErrors }) => {
                    const response = await login({options: values});
                    if (response.data?.login.errors) {
                        setErrors(toErrorMap(response.data.login.errors));
                    } else if (response.data?.login.user) {
                        router.push('/');
                    }
                }}
            >
                {({ isSubmitting }) => (
                    <Form>
                        <InputField
                            name="username"
                            placeholder="username"
                            label="username"
                        />
                        <Box mt={4}>
                            <InputField
                                name="password"
                                placeholder="password"
                                label="password"
                                type="password"
                            />
                        </Box>
                        <Button
                            type="submit"
                            isLoading={isSubmitting}
                            variantColor="teal"
                        ></Button>
                    </Form>
                )}
            </Formik>
        </Wrapper>
    );
};

export default login;
