// const { ApolloServer } = require("apollo-server");
const { ApolloServer } = require("apollo-server-express");
const { ApolloGateway } = require("@apollo/gateway");
const express = require("express");

const port = 4000;
const app = express();

const gateway = new ApolloGateway({
  serviceList: [
    { name: "accounts", url: "http://localhost:4001" },
    { name: "astronauts", url: "http://localhost:4002" },
    { name: "missions", url: "http://localhost:4003" }
  ]
});

const server = new ApolloServer({
  gateway,
  subscriptions: false
});

server.applyMiddleware({ app });

app.listen({ port }, () =>
  console.log(`Server ready at http://localhost:${port}${server.graphqlPath}`)
);

// server.listen({ port }).then(({ url }) => {
//   console.log(`Server ready at ${url}`);
// });