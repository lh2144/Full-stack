import {
  FormControl,
  FormLabel,
  Input,
  FormErrorMessage,
} from "@chakra-ui/react";
import { useField } from "formik";
import React, { InputHTMLAttributes } from "react";

type InputFieldProps = InputHTMLAttributes<HTMLInputElement> & {
    name: string;
    label: string;
}
 
export const InputField: React.FC<InputFieldProps> = ({label, size: _, ...props}) => {
  const [field, {error}] = useField(props);
  return (
    <FormControl isInvalid={!!error}>
        <FormLabel htmlFor="name">{label}</FormLabel>
      <Input {...field} {...props} id={field.name} placeholder="name" />
      {error ? <FormErrorMessage>{error}</FormErrorMessage> : null}
    </FormControl>
  );
};
