import userModel from "../models/user.model.js";
const createUser = async ({ firstname, lastname, email, password }) => {
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
    }
    catch (error) {
        if (error instanceof Error) {
            throw new Error(`Failed to create user: ${error.message}`);
        }
        throw new Error("Failed to create user: Unknown error");
    }
};
export default { createUser };
