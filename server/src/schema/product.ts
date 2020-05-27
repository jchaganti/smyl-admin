import { gql } from 'apollo-server-express';

export default gql`
  extend type Mutation {
    addProduct(product: JSON!): Status!
  }
`;
