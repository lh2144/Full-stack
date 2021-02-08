import React from "react";
import { Formik, Form } from "formik";
import { Wrapper } from "src/components/wrapper";
import { InputField } from "src/components/inputField";
import { Box, Button } from "@chakra-ui/react";
import { useRegisterMutation } from "src/generated/graphqa";
import { toErrorMap } from "src/utils/toErrorMap";
import { useRouter } from 'next/router';
import { withUrqlClient } from "next-urql";
import { createUrqlClient } from "src/utils/createUrqlClient";

interface registerProps {}
// const REGISTER_MUT = `
// mutation Register($username: String, $password: String!) {
//   register(options: { username: $username, password: $password}) {
//     errors {
//       field
//       message
//     }
//     ueser {
//       id
//       username
//     }
//   }
// }
// `;
export const Register: React.FC<registerProps> = ({}) => {
    const [, register] = useRegisterMutation();
    const router = useRouter();
    return (
        <Wrapper variant="small">
            <Formik
                initialValues={{ username: "", password: "" }}
                onSubmit={async (values, { setErrors }) => {
                    const response = await register(values);
                    if (response.data?.register.errors) {
                        setErrors(toErrorMap(response.data.register.errors));
                    } else if (response.data?.register.user) {
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

export default withUrqlClient(createUrqlClient)(Register);
