import { gql } from 'apollo-server-express';

export default gql`
  extend type Query {
    assignedRetailers(): Retailers!
  }

  type Retailers {
    retailers: [Retailer!]!
  }
  extend type Mutation {
    addProduct(product: JSON!): Status!
  }
`;
