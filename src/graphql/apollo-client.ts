import { ApolloClient, InMemoryCache } from '@apollo/client/core';
import { createApolloProvider } from '@vue/apollo-option';

export const apolloClient = new ApolloClient({
  uri: 'http://localhost:4000/graphql', // TODO: use env variable
  cache: new InMemoryCache()
});

export const apolloProvider = createApolloProvider({
  defaultClient: apolloClient
});
