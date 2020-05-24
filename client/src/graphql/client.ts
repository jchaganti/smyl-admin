import {  ApolloClient, ApolloLink, HttpLink, InMemoryCache} from 'apollo-boost';

const httpUrl = '/graphql';

export const getAccessToken = (): string  => {return 'abc'}

const httpLink = ApolloLink.from([
  new ApolloLink((operation, forward) => {
    const token = getAccessToken();
    if (token) {
      operation.setContext({headers: {'authorization': `Bearer ${token}`}});
    }
    return forward(operation);
  }),
  new HttpLink({uri: httpUrl})
]);

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: httpLink,
  defaultOptions: {query: {fetchPolicy: 'no-cache'}}
}); 

export default client;