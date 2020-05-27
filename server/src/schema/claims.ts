import { gql } from 'apollo-server-express';

export default gql`
  extend type Query {
    pendingClaims(): [JSON!]!
    userClaims(user: String!): [JSON!]!
  }

  extend type Mutation {
    setClaimStatus(claimData: JSON!): Status!
  }
`;
