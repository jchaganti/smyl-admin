import { IResolvers } from 'graphql-tools';
import { groupBy, keys } from 'lodash';
import { AssignCuratorInput, Context, USER_ROLE } from '../models/context';
import { ICuratorRetailerDocument, ICuratorRetailerModel } from '../models/curatorRetailer';
import { cast } from '../utils';
import { getLoggedInUserWithRoleAs } from './helper';

const resolverMap: IResolvers = {
  Query: {
    curatorToRetailers: async (parent: any, args: any, { models }: Context) => {
      const CuratorRetailerModel: ICuratorRetailerModel = cast(models.Retailer);
      const curatorRetailerObjs = await CuratorRetailerModel.find().populate(['curator', 'retailer']);
      const groupedByCuratorIdObjs = groupBy(curatorRetailerObjs, (curatorRetailerObj: ICuratorRetailerDocument) => {
        const { curator, retailer } = curatorRetailerObj;
        return (curator as any).id
      });
      const curatorRetailers = keys(groupedByCuratorIdObjs).map(curatorId => {
        const curatorRetailerObjs = groupedByCuratorIdObjs[curatorId];
        const { id, name } = (curatorRetailerObjs[0].curator) as any;
        return {
          id,
          name,
          retailers: curatorRetailerObjs.map(curatorRetailerObj => {
            const { id, name, categories } = (curatorRetailerObj.retailer as any);
            return { id, name, categories };
          })
        }
      });
      return curatorRetailers;
    }
  },
  Mutation: {
    assignCurator: async (
      parent: any,
      { retailer, curator }: AssignCuratorInput,
      { models, me }: Context,
    ) => {
      const loggedInUser = getLoggedInUserWithRoleAs(me, USER_ROLE.ADMIN);
      const CuratorRetailerModel: ICuratorRetailerModel = cast(models.Retailer);
      const curatorRetailer = new CuratorRetailerModel({ retailer, curator });
      curatorRetailer.modifiedBy = loggedInUser;
      try {
        await curatorRetailer.save();
        return { status: true }
      } catch (e) {
        { status: false }
      }
    },
    unassignCurator: async (
      parent: any,
      { retailer, curator }: AssignCuratorInput,
      { models, me }: Context,
    ) => {
      const loggedInUser = getLoggedInUserWithRoleAs(me, USER_ROLE.ADMIN);
      const CuratorRetailerModel: ICuratorRetailerModel = cast(models.Retailer);
      try {
        await CuratorRetailerModel.findByCuratorRetailerAndDelete(curator, retailer);
        return { status: true }
      } catch (e) {
        return { status: false }
      }
    }
  }
};

export default resolverMap;