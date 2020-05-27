import { gql } from 'apollo-server-express';

export default gql`
  extend type Query {
    assignedRetailers: Retailers!
  }

  extend type Mutation {
    addProduct(product: JSON!): Status!
  }

  type Retailers {
    retailers: [Retailer!]!
  }
`;
