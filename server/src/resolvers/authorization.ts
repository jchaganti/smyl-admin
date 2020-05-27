import { ForbiddenError } from 'apollo-server';
import { combineResolvers, skip } from 'graphql-resolvers';
import { USER_ROLE } from '../models/context';

export const isAuthenticated = (parent: any, args: any, { me }: any) =>
  me ? skip : new ForbiddenError('Not authenticated as user.');

export const isAdmin = combineResolvers(
  isAuthenticated,
  (parent, args, { me: { role } }) =>
    role === USER_ROLE.ADMIN
      ? skip
      : new ForbiddenError('Not authorized as admin.'),
);

export const isMessageOwner = async (
  parent: any,
  { id }: any,
  { models, me }: any,
) => {
  const message = await models.Message.findById(id);

  if (message.userId != me.id) {
    throw new ForbiddenError('Not authenticated as owner.');
  }

  return skip;
};
