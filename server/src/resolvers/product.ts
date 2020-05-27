import { IResolvers } from 'graphql-tools';
import { Context, CreateRetailerInput, USER_ROLE } from '../models/context';
import { ICuratorRetailerModel } from '../models/curatorRetailer';
import { cast } from '../utils';
import { getLoggedInUserWithRoleAs } from './helper';


const resolverMap: IResolvers = {
  Query: {
    assignedRetailers: async (parent: any, args: any, { models, me }: Context) => {
      const loggedInUser = getLoggedInUserWithRoleAs(me, USER_ROLE.CURATOR);
      const CuratorRetailerModel: ICuratorRetailerModel = cast(models.Retailer);
      const curatorRetailerObjs = await CuratorRetailerModel.findByCuratorId(loggedInUser.id).populate('retailer');
      const retailers = curatorRetailerObjs.map((curatorRetailerObj: any) => curatorRetailerObj.retailer);
      return {retailers};
    }
  },
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