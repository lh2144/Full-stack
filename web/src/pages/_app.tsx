import { ColorModeProvider, CSSReset, ThemeProvider } from "@chakra-ui/react";
import React from "react";
import { createClient, Provider, useMutation } from "urql";

import theme from "../theme";

const client = createClient({ url: "http://localhost:4000/graphql",
    fetchOptions: {
        credentials: "include"
    }
});
function MyApp({ Component, pageProps }) {
    const [] = useMutation("");
    return (
        <Provider value={client}>
            <ThemeProvider theme={theme}>
                <ColorModeProvider
                    options={{
                        useSystemColorMode: true,
                    }}
                >
                    <CSSReset />
                    <Component {...pageProps} />
                </ColorModeProvider>
            </ThemeProvider>
        </Provider>
    );
}

export default MyApp;
