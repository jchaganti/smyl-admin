import { UserInputError } from "apollo-server";
import { IUser } from "../models/user";
import { cast } from "../utils";
import { USER_ROLE } from "../models/context";

export const getLoggedInUserWithRoleAs = (me: any, role: USER_ROLE): IUser => {
  const loggedInUser: IUser = cast(me);
  if (loggedInUser.role !== role) {
    throw new UserInputError('Not Authorized to perform this operation');
  }
  return loggedInUser;
}