import { IResolvers } from 'graphql-tools';
import { Context, CreateRetailerInput, AddCashbackInput, USER_ROLE } from '../models/context';
import { IRetailerModel, IRetailerDocument } from '../models/retailer';
import { cast } from '../utils';
import { IUser } from '../models/user';
import { UserInputError } from 'apollo-server';
import { getLoggedInUserWithRoleAs } from './helper';



const saveRetailer = async (retailer: IRetailerDocument, loggedInUser: IUser): Promise<object> => {
  retailer.modifiedBy = loggedInUser;
  try {
    await retailer.save();
    return {status: true};
  } catch (e) {
    console.error('Error during saving of retailer', e);
    return {status: false, error: e.errmsg};
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
      { name, categories: _categories }: CreateRetailerInput,
      { models, me }: Context,
    ) => {
      const loggedInUser = getLoggedInUserWithRoleAs(me, [USER_ROLE.ADMIN]);
      const RetailerModel: IRetailerModel = cast(models.Retailer);
      const categories = _categories.map(name => ({
        name,
        userId: loggedInUser.id
      }));
      const retailer: IRetailerDocument = new RetailerModel({ name,  categories });
      return await saveRetailer(retailer, loggedInUser);
    },
    
    addCashback: async (
      parent: any,
      { retailerId, category, cashbackPercent }: AddCashbackInput,
      { models, me }: Context,
    ) => {
      const loggedInUser = getLoggedInUserWithRoleAs(me, [USER_ROLE.ADMIN]);
      const RetailerModel: IRetailerModel = cast(models.Retailer);
      const retailer: IRetailerDocument = cast(await RetailerModel.findById(retailerId))
      if (retailer) {
        const { categories } = retailer;
        const categoryObj: any = categories.find((_category: any) => category === _category.name);
        if(categoryObj) {
          categoryObj.cashbackPercent = cashbackPercent;
          return await saveRetailer(retailer, loggedInUser);
        } else {
          throw new UserInputError(`Not able to find category with name ${category} for retailer with id ${retailerId}`);
        }
      } else {
        throw new UserInputError(`Not able to find retailer with id ${retailerId}`);
      }

    }
  }
};

export default resolverMap;