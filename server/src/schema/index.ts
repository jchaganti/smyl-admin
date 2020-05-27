import { gql } from 'apollo-server-express';

import userSchema from './user';
import messageSchema from './message';
import retailerSchema from './retailer';
import productSchema from './product';

const linkSchema = gql`
  scalar Date

  scalar JSON
  
  type Query {
    _: Boolean
  }

  type Mutation {
    _: Boolean
  }

  type Subscription {
    _: Boolean
  }
`;

export default [linkSchema, userSchema, messageSchema, retailerSchema, productSchema];
