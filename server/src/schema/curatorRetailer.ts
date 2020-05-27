import { gql } from 'apollo-server-express';

export default gql`
  extend type Query {
    curatorToRetailers: [Curator!]!
  }

  extend type Mutation {
    assignCurator(curatorId: String!, retailerId: String!): Status!
    unassignCurator(curatorId: String!, retailerId: String!): Status!
  }

  type Curator {
    id: ID!
    firstName: String!
    lastName: String!
    retailers: [Retailer!]!
  }
`;
