
import { ModelsMap } from "../models";
import { IUserModel, IUser } from "../models/user";
import { cast } from "../utils";

export const batchUsers = async (keys: string [], models : ModelsMap) => {
  const UserModel: IUserModel = cast(models.User);
  const users: IUser [] = await UserModel.find({
    _id: {
      $in: keys,
    },
  });

  return keys.map((key: string) => users.find((user: IUser) => user.id == key));
};
