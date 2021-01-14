import { Box } from '@chakra-ui/react';
import React, { Children } from 'react';
interface WrapperProps {}

export const Wrapper: React.FC<WrapperProps> = ({}) => {
    return (
        <Box mt={8} mx="auto" maxW="800px" w="100%">
            {Children}
        </Box>
    );
}