import { AuthenticationError, UserInputError } from 'apollo-server';
import { combineResolvers } from 'graphql-resolvers';
import { IResolvers } from 'graphql-tools';
import jwt, { Secret } from 'jsonwebtoken';
import { Context, SignInInput, SignUpInput, USER_ROLE, AssignCuratorInput } from '../models/context';
import { IMessageModel } from '../models/message';
import { IUserModel, IUser } from '../models/user';
import { cast } from '../utils';
import { isAdmin, isAuthenticated } from './authorization';
import { getLoggedInUserWithRoleAs } from './helper';
const createToken = async (user: IUser, secret: Secret, expiresIn: string) => {
  const { id, email, role } = user;
  return await jwt.sign({ id, email, role }, secret, {
    expiresIn,
  });
};

const resolverMap: IResolvers = {
  Query: {
    users: async (parent: any, args: any, { models }: Context) => {
      const UserModel: IUserModel = cast(models.User);
      return await UserModel.find();
    },
    user: async (parent: any, { id }: any, { models }: Context) => {
      const UserModel: IUserModel = cast(models.User);
      return await UserModel.findById(id);
    },
    me: async (parent: any, args: any, { models, me }: Context) => {
      const _me: IUser = cast(me);
      if (!_me) {
        return null;
      }
      const UserModel: IUserModel = cast(models.User);
      return await UserModel.findById(_me.id);
    },
    assignedRetailers: async (parent: any, args: any, { models, me }: Context) => {
      const loggedInUser = getLoggedInUserWithRoleAs(me, [USER_ROLE.CURATOR, USER_ROLE.ADMIN]);
      const UserModel: IUserModel = cast(models.User);
      const user: IUser | null=  await UserModel.findById(loggedInUser.id);
      return user !== null?  user.retailers: [];
    },
    curators: async (parent: any, args: any, { models, me }: Context) => {
      const loggedInUser = getLoggedInUserWithRoleAs(me, [USER_ROLE.ADMIN]);
      const UserModel: IUserModel = cast(models.User);
      return await UserModel.findByRole(USER_ROLE.CURATOR);
    },
  },

  Mutation: {
    signUp: async (
      parent: any,
      { firstName, lastName, email, role }: SignUpInput,
      { models, me }: Context,
    ) => {
      const UserModel: IUserModel = cast(models.User);
      const user: IUser = await UserModel.findByLogin(email);
      const loggedInUser: IUser = getLoggedInUserWithRoleAs(me, [USER_ROLE.ADMIN]);
      if (user) {
        throw new UserInputError(
          'User with this email id already exists!',
        );
      } else {
        const password = 'changeme123';
        const user = new UserModel({ firstName, lastName, email, password, role });
        user.modifiedBy = loggedInUser;
        try {
          const newUser = await user.save();
          console.log('@@@ newUser' , newUser)
          return newUser;
        } catch(e) {
          throw e;
        }
        
      }
    },
    signIn: async (
      parent: any,
      { email, password }: SignInInput,
      { models, secret }: Context,
    ) => {
      const UserModel: IUserModel = cast(models.User);
      const user: IUser = await UserModel.findByLogin(email);

      if (!user) {
        throw new UserInputError(
          'No user found with this email.',
        );
      }

      const isValid = await user.validatePassword(password);

      if (!isValid) {
        throw new AuthenticationError('Invalid password.');
      }

      return { token: createToken(user, secret, '600m') };
    },

    updateUser: combineResolvers(
      isAuthenticated,
      async (parent, { newPassword }, { models, me }: Context) => {
        const UserModel: IUserModel = cast(models.User);
        const _me: IUser = cast(me);
        return await UserModel.findByIdAndUpdate(
          _me.id,
          { new: true, password: newPassword },
        );
      },
    ),

    deleteUser: combineResolvers(
      isAdmin,
      async (parent, { id }, { models }: Context) => {
        const UserModel: IUserModel = cast(models.User);
        const user = await UserModel.findById(id);

        if (user) {
          try {
            await user.remove();
            return {status: true};
          } catch(e) {
            return {status: false, error: e};
          }
        } else {
          return {status: false, error: new Error('User not found with id ${id}')};
        }
      },
    ),
    assignRetailerToCurator: async (
      parent: any,
      { retailerId, curatorId }: AssignCuratorInput,
      { models, me }: Context,
    ) => {
      const loggedInUser = getLoggedInUserWithRoleAs(me, [USER_ROLE.ADMIN]);
      const UserModel: IUserModel = cast(models.User);
      const user: IUser = cast(await UserModel.findById(curatorId));
      const retailers = user.retailers? user.retailers: [];
      if(retailers.includes(retailerId)) {
        throw new UserInputError(`assignRetailerToCurator failed since retailer Id ${retailerId} is already associated with curator Id ${curatorId}`)
      }
      retailers.push(retailerId);
      user.modifiedBy = loggedInUser;
      try {
        await UserModel.findByIdAndUpdate(curatorId, user);
        return { status: true }
      } catch (e) {
        console.error('Error during assignCurator', e)
        { status: false }
      }
    },
    unassignRetailerToCurator: async (
      parent: any,
      { retailerId, curatorId }: AssignCuratorInput,
      { models, me }: Context,
    ) => {
      const loggedInUser = getLoggedInUserWithRoleAs(me, [USER_ROLE.ADMIN]);
      const UserModel: IUserModel = cast(models.User);
      const user: IUser = cast(await UserModel.findById(curatorId));
      const {retailers} = user;
      const indx = retailers.findIndex(id=> id.toString() === retailerId);
      if(indx === -1) {
        throw new UserInputError(`unassignRetailerToCurator failed since retailer Id ${retailerId} is not associated with curator Id ${curatorId}`)
      }
      retailers.splice(indx,1);
      user.modifiedBy = loggedInUser;
      try {
        await UserModel.findByIdAndUpdate(curatorId, user);
        return { status: true }
      } catch (e) {
        console.error('Error during assignCurator', e)
        { status: false }
      }
    }
  },

};

export default resolverMap;