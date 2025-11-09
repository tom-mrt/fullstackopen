import ReactDom from 'react-dom/client';
import App from './App.jsx'

import { ApolloClient, HttpLink, InMemoryCache, split } from '@apollo/client';
import { ApolloProvider } from "@apollo/client/react";
import { SetContextLink } from '@apollo/client/link/context';

import { getMainDefinition } from '@apollo/client/utilities';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { createClient } from 'graphql-ws';

const authlink = new SetContextLink((_, { headers }) => {
  const token = localStorage.getItem("phonenumbers-user-token")
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : null,
    }
  }
})

const httplink = new HttpLink({ uri: "http://localhost:4000" })

const wslink = new GraphQLWsLink(
  createClient({ url: "ws://localhost:4000" })
)

const splitlink = split(
  ({ query }) => {
    const definition = getMainDefinition(query)
    return (
      definition.kind === "OperationDefinition" && 
      definition.operation === "subscription"
    )
  },
  wslink,
  authlink.concat(httplink)
)

const client = new ApolloClient({
  link: splitlink,
  cache: new InMemoryCache(),
})


  // Providerでラップすることで、アプリ内の全てのコンポーネントからクライアントにアクセスできる
ReactDom.createRoot(document.getElementById('root')).render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>
)
