import { IResolvers } from 'graphql-tools';
import { Context, CreateRetailerInput } from '../models/context';


const resolverMap: IResolvers = {

  Mutation: {
    addProduct: async (
      parent: any,
      { name, categories }: CreateRetailerInput,
      { models, me }: Context,
    ) => {
     
    }
  }
};

export default resolverMap;