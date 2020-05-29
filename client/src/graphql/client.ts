import {  ApolloClient, ApolloLink, HttpLink, InMemoryCache} from 'apollo-boost';

const httpUrl = '/graphql';

export const getAccessToken = (): string  => { return window.localStorage.getItem('accessToken') as string};

export const saveInLocalStorage = (accessToken: string) => {
  window.localStorage.setItem('accessToken', accessToken);
}

export const removeFromLocalStorage = () => {
  window.localStorage.removeItem('accessToken');
}

const httpLink = ApolloLink.from([
  new ApolloLink((operation, forward) => {
    const token = getAccessToken();
    if (token) {
      operation.setContext({headers: {'x-token': `${token}`}});
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