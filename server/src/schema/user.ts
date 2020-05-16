import { gql } from 'apollo-server-express';

export default gql`
  extend type Query {
    users: [User!]
    user(id: ID!): User
    me: User
  }

  extend type Mutation {
    signUp(email: String!, password: String!, role: String!): User!
    signIn(email: String!, password: String!): Token!
    updateUser(newPassword: String!): User!
    deleteUser(id: ID!): Boolean!
  }

  type Token {
    token: String!
  }

  type User {
    id: ID!
    email: String!
    role: String!
    verificationStatus:String!
    messages: [Message!]
  }
`;
