import { createWithApollo } from "./createWithApollo";
import { ApolloClient, createHttpLink, InMemoryCache } from "@apollo/client";
import { PaginatedPosts } from "../generated/graphqa";
import { setContext } from "@apollo/client/link/context";

const httplink = createHttpLink({
    uri: "http://localhost:4000/graphql",
});

const authLink = setContext((_, { headers }) => {
    const token = localStorage.getItem("token");
    return {
        headers: {
            ...headers,
            authorization: token ? `Bearer ${token}` : "",
        },
    };
});
const createClient = () =>
    new ApolloClient({
        link: authLink.concat(httplink),
        credentials: "include",
        cache: new InMemoryCache({
            typePolicies: {
                Query: {
                    fields: {
                        posts: {
                            keyArgs: false,
                            merge(
                                existing: PaginatedPosts | undefined,
                                incoming: PaginatedPosts
                            ): PaginatedPosts {
                                return {
                                    ...incoming,
                                    posts: [
                                        ...(existing?.posts || []),
                                        ...incoming.posts,
                                    ],
                                };
                            },
                        },
                    },
                },
            },
        }),
    });

export const withApollo = createWithApollo(createClient);
