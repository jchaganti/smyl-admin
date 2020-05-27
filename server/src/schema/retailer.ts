import { gql } from 'apollo-server-express';

export default gql`
  extend type Query {
    retailers(): [Retailer!]!
  }

  extend type Mutation {
    createRetailer(name: String!, categories: [String!]!): Status!
    addCashback(retailerId: ID!, category: String!, cashbackPercent: Float!): Status!
  }

  type Retailer {
    id: ID!
    name: String!
    categories:[Category!]
  }

  type Category {
    name: String!
    cashbackPercent: Float
  }

  type Status {
    status: Boolean!
  }
`;
