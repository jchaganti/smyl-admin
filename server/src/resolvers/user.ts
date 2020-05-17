import { IResolvers } from 'graphql-tools';
import { IUserModel, IUser } from '../models/user';
import { cast } from '../utils';
import { UserInputError, AuthenticationError } from 'apollo-server';
import { combineResolvers } from 'graphql-resolvers';
import { isAuthenticated, isAdmin } from './authorization';
import { IMessageModel } from '../models/message';
import jwt, { Secret } from 'jsonwebtoken';
import { Context, SignUpInput, SignInInput } from '../models/context';

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
  },

  Mutation: {
    signUp: async (
      parent: any,
      { email, password, role }: SignUpInput,
      { models, me }: Context,
    ) => {
      const UserModel: IUserModel = cast(models.User);
      const user: IUser = await UserModel.findByLogin(email);
      const loggedInUser: IUser = cast(me);
      // TODO: Use enum for ADMIN
      if(loggedInUser.role !== 'ADMIN') {
        throw new UserInputError('Not Authorized to create users');
      }
      if (user) {
        throw new UserInputError(
          'User with this email id already exists!',
        );
      } else {
        const user = new UserModel({ email, password, role });
        return await user.save();
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

      return { token: createToken(user, secret, '30m') };
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
          await user.remove();
          return true;
        } else {
          return false;
        }
      },
    ),
  },

  User: {
    messages: async (user: { id: any; }, args: any, { models }: Context) => {
      const MessageModel: IMessageModel = cast(models.Message);
      return await MessageModel.find({
        userId: user.id,
      });
    },
  },
};

export default resolverMap;