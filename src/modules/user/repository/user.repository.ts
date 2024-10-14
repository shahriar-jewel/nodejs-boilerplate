import UserModel from "../models/UserModel";
import { IUser } from "../../../core/IUserProvider";
import { IUserRepository } from "../interfaces/user-repository.interface";

export class UserRepository implements IUserRepository {

    public async create(user: Partial<IUser>): Promise<IUser> {
        return await UserModel.create(user);
    }

    public async findByEmail(email: string): Promise<IUser | null> {
        return await UserModel.findOne({ email });
    }
}
