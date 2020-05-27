import { IResolvers } from 'graphql-tools';
import { Context, CreateRetailerInput, AddCashbackInput, USER_ROLE } from '../models/context';
import { IRetailerModel, IRetailerDocument } from '../models/retailer';
import { cast } from '../utils';
import { IUser } from '../models/user';
import { UserInputError } from 'apollo-server';
import { getLoggedInUserWithRoleAs } from './helper';



const saveRetailer = async (retailer: IRetailerDocument, loggedInUser: IUser): Promise<boolean> => {
  retailer.modifiedBy = loggedInUser;
  try {
    await retailer.save();
    return true;
  } catch (e) {
    return false;
  }
}
const resolverMap: IResolvers = {
  Query: {
    retailers: async (parent: any, args: any, { models }: Context) => {
      const RetailerModel: IRetailerModel = cast(models.Retailer);
      return await RetailerModel.find();
    }
  },
  Mutation: {
    createRetailer: async (
      parent: any,
      { name, categories }: CreateRetailerInput,
      { models, me }: Context,
    ) => {
      const loggedInUser = getLoggedInUserWithRoleAs(me, USER_ROLE.ADMIN);
      const RetailerModel: IRetailerModel = cast(models.Retailer);
      const categoryObjs = categories.map(name => ({
        name,
        userId: loggedInUser.id
      }));
      const retailer: IRetailerDocument = new RetailerModel({ name, categoryObjs });
      const status = await saveRetailer(retailer, loggedInUser);
      return { status };
    },
    addCashback: async (
      parent: any,
      { retailerId, category, cashbackPercent }: AddCashbackInput,
      { models, me }: Context,
    ) => {
      const loggedInUser = getLoggedInUserWithRoleAs(me, USER_ROLE.ADMIN);
      const RetailerModel: IRetailerModel = cast(models.Retailer);
      const retailer: IRetailerDocument = cast(await RetailerModel.findById(retailerId))
      if (retailer) {
        const { categories } = retailer;
        const categoryObj: any = categories.find((_category: any) => category === _category.name);
        categoryObj.cashbackPercent = cashbackPercent;
        const status = await saveRetailer(retailer, loggedInUser);
        return { status };
      } else {
        throw new UserInputError(`Not able to find retailer with id ${retailerId}`);
      }

    }
  }
};

export default resolverMap;