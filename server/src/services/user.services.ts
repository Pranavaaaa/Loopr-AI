import userModel, { IUser } from "../models/user.model.js";

// Type definitions
interface CreateUserParams {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
}

// Use the IUser interface from your model instead of creating a separate UserResponse
// This ensures type compatibility with your Mongoose model
type UserResponse = IUser;

const createUser = async ({ firstname, lastname, email, password }: CreateUserParams): Promise<UserResponse> => {
  try {
    if (!firstname || !password || !email) {
      throw new Error("Missing required fields");
    }

    const user = await userModel.create({
      fullName: {
        firstName: firstname,
        lastName: lastname,
      },
      email,
      password,
    });

    console.log(user, "user.services");

    return user;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to create user: ${error.message}`);
    }
    throw new Error("Failed to create user: Unknown error");
  }
};

export default { createUser };
export { CreateUserParams, UserResponse };