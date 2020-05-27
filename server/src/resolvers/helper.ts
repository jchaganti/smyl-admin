import { UserInputError } from "apollo-server";
import { IUser } from "../models/user";
import { cast } from "../utils";

export const getLoggedInUserWithRoleAs = (me: any, roles: string []): IUser => {
  const loggedInUser: IUser = cast(me);
  if (!roles.includes(loggedInUser.role)) {
    throw new UserInputError('Not Authorized to perform this operation');
  }
  return loggedInUser;
}