import React from 'react';
import { Formik, Form } from 'formik';
import {  FormControl, FormLabel, Input } from '@chakra-ui/react';
import { Wrapper } from 'src/components/wrapper';

interface registerProps { }
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
        {(values, handleChange) => (
          <Form>
            <FormControl>
              <FormLabel htmlFor="username">First name</FormLabel>
              <Input value={values.username} onChange={handleChange} id="username" placeholder="name" />
              {/* <FormErrorMessage>{form.errors.name}</FormErrorMessage> */}
            </FormControl>
          </Form>
        )}
      </Formik>
    </Wrapper>

    );
}

export default register;