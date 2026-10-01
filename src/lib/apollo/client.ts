import { HttpLink } from "@apollo/client";
import {
    ApolloClient,
    InMemoryCache,
    registerApolloClient,
} from "@apollo/client-integration-nextjs";

const graphqlEndpoint = process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT;

if (!graphqlEndpoint) {
    throw new Error("NEXT_PUBLIC_GRAPHQL_ENDPOINT is not configured");
}

export const { getClient, query, PreloadQuery } = registerApolloClient(() => {
    return new ApolloClient({
        cache: new InMemoryCache(),
        link: new HttpLink({
            uri: graphqlEndpoint,
        }),
    });
});