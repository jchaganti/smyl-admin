import { AuthenticationError, UserInputError } from 'apollo-server';
import { combineResolvers } from 'graphql-resolvers';
import jwt from 'jsonwebtoken';

import { isAdmin, isAuthenticated } from './authorization';
import { IUserModel, IUser } from '../models/user';
import { cast } from '../utils';
import { IMessageModel } from '../models/message';

const createToken = async (user: IUser, secret: string, expiresIn: string) => {
  const { id, email, role } = user;
  return await jwt.sign({ id, email, role }, secret, {
    expiresIn,
  });
};

export default {
  Query: {
    users: async (parent: any, args: any, { models }: any) => {
      const UserModel: IUserModel = cast(models.User);
      return await UserModel.find();
    },
    user: async (parent: any, { id }: any, { models }: any) => {
      const UserModel: IUserModel = cast(models.User);
      return await UserModel.findById(id);
    },
    me: async (parent: any, args: any, { models, me }: any) => {
      if (!me) {
        return null;
      }
      const UserModel: IUserModel = cast(models.User);
      return await UserModel.findById(me.id);
    },
  },

  Mutation: {
    signUp: async (
      parent: any,
      { email, password, role }: any,
      { models, me }: any,
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
      { email, password }: any,
      { models, secret }: any,
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
      async (parent, { newPassword }, { models, me }: any) => {
        const UserModel: IUserModel = cast(models.User);
        return await UserModel.findByIdAndUpdate(
          me.id,
          { new: true, password: newPassword },
        );
      },
    ),

    deleteUser: combineResolvers(
      isAdmin,
      async (parent, { id }, { models }: any) => {
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
    messages: async (user: { id: any; }, args: any, { models }: any) => {
      const MessageModel: IMessageModel = cast(models.Message);
      return await MessageModel.find({
        userId: user.id,
      });
    },
  },
};
