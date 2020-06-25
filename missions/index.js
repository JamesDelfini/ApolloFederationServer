const { ApolloServer, gql, ForbiddenError } = require("apollo-server");
const { applyMiddleware } = require("graphql-middleware");
const { buildFederatedSchema } = require("@apollo/federation");
const fetch = require("node-fetch");

const { permissions } = require("./permissions");

const port = 4003;
const apiUrl = "http://localhost:3000";

function getPermissions(user) {
  if (user && user["https://awesomeapi.com/graphql"]) {
    return user["https://awesomeapi.com/graphql"].permissions;
  }
  return [];
}

const typeDefs = gql`
  type Mission {
    id: ID!
    crew: [Astronaut]
    designation: String!
    startDate: String
    endDate: String
  }

  extend type Astronaut @key(fields: "id") {
    id: ID! @external
    missions: [Mission]
  }

  extend type Query {
    mission(id: ID!): Mission
    missions: [Mission]
  }
`;

const resolvers = {
  Astronaut: {
    async missions(astronaut) {
      const res = await fetch(`${apiUrl}/missions`);
      const missions = await res.json();

      return missions.filter(({ crew }) =>
        crew.includes(parseInt(astronaut.id))
      );
    }
  },
  Mission: {
    crew(mission, _, context) {
      const userId = parseInt(context.user.sub);

      const userPermissions = getPermissions(context.user);

      if (userPermissions)
        if (userPermissions.includes("read:own_mission"))
          if (!mission.crew.find(crewId => crewId === userId))  return [];
      
      return mission.crew.map(id => ({ __typename: "Astronaut", id }));
    }
  },
  Query: {
    async mission(_, { id }, context) {
      return fetch(`${apiUrl}/missions/${id}`).then(res => res.json());
    },
    missions() {
      return fetch(`${apiUrl}/missions`).then(res => res.json());
    }
  }
};

const server = new ApolloServer({
  schema: applyMiddleware(
    buildFederatedSchema([{ typeDefs, resolvers }]),
    permissions
  ),
  context: ({ req }) => {
    const user = req.headers.user ? JSON.parse(req.headers.user) : null;
    return { user };
  }
});

server.listen({ port }).then(({ url }) => {
  console.log(`Missions service ready at ${url}`);
});