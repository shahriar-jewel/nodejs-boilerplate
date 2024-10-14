// services/signup.service.ts
import UserModel from "../models/UserModel";
import { IUser } from "../../../core/IUserProvider";
import { UserRepository } from "../repository/user.repository";
import { IUserRepository } from "../interfaces/user-repository.interface";

export class SignUpService {
    private userRepository: IUserRepository;

    constructor(userRepository: IUserRepository) {
        this.userRepository = userRepository;
    }

    public async create(name: string, username: string, email: string, mobile: string, password: string, role: {}, isActive: boolean): Promise<IUser> {

        const userData: IUser = {
            name,
            username,
            email,
            mobile,
            password,
            role,
            isActive,
            createdAt: new Date(),
            updatedAt: new Date()
        };

        return await this.userRepository.create(userData);
    }
}
