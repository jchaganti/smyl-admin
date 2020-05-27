import { GraphQLDateTime } from 'graphql-iso-date';
import GraphQLJSON from 'graphql-type-json';
import userResolvers from './user';
import messageResolvers from './message';
import retailerResolvers from './retailer';
import productResolvers from './product';
import curatorRetailResolversa from './curatorRetailer';
const customScalarResolver = {
  Date: GraphQLDateTime,
  JSON: GraphQLJSON
};

export default [
  customScalarResolver,
  userResolvers,
  messageResolvers,
  retailerResolvers,
  productResolvers,
  curatorRetailResolversa
];
