import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";

import { ApolloClient, HttpLink, InMemoryCache, split } from '@apollo/client';
import { ApolloProvider } from "@apollo/client/react";
import { SetContextLink } from '@apollo/client/link/context';
import { getMainDefinition } from '@apollo/client/utilities'
import { GraphQLWsLink } from '@apollo/client/link/subscriptions'
import { createClient } from 'graphql-ws'


const authlink = new SetContextLink((_, { headers }) => {
  const token = localStorage.getItem("booklists-user-token")
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` :  "",
    }
  }
})

const httplink = new HttpLink({ uri: "http://localhost:4000" })

const wsLink = new GraphQLWsLink(
  createClient({ url: "ws://localhost:4000" })
)

const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query)
    return (
      definition.kind === "OperationDefinition" &&
      definition.operation === "subscription"
    )
  },
  wsLink,
  authlink.concat(httplink)
)

const client = new ApolloClient({
  link: splitLink,
  cache: new InMemoryCache(),
})



ReactDOM.createRoot(document.getElementById("root")).render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>
);
