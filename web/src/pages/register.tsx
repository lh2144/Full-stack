import React from "react";
import { Formik, Form } from "formik";
import { Wrapper } from "src/components/wrapper";
import { InputField } from "src/components/inputField";
import { Box, Button } from "@chakra-ui/react";

interface registerProps {}
export const register: React.FC<registerProps> = ({}) => {
  return (
    <Wrapper>
      <Formik
        initialValues={{ name: "", password: "" }}
        onSubmit={(values, actions) => {
          setTimeout(() => {
            alert(JSON.stringify(values, null, 2));
            actions.setSubmitting(false);
          }, 1000);
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
            <Button type="submit" isLoading={isSubmitting} variantColor="teal"></Button>
          </Form>
        )}
      </Formik>
    </Wrapper>
  );
};

export default register;
