import type { IUser } from "./user.interface.js";

// Create user
const createUser = async (body: IUser, password: string) => {
  console.log({ body, password });
};

// User service object
const UserService = {
  createUser,
};

export default UserService;
