import { gql } from 'apollo-server-express';

export default gql`
  extend type Query {
    curatorToRetailers(): [Curator!]!
  }

  extend type Mutation {
    assignCurator(curatorId: ID!, retailerId: ID!): Status!
    unassignCurator(curatorId: ID!, retailerId: ID!): Status!
  }

  type Curator {
    id: ID!
    firstName: String!
    lastName: String!
    retailers: [Retailer!]!
  }
`;
