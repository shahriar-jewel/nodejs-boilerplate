import { IUser } from "../../../core/IUserProvider";
import { UserRepository } from "../repository/user.repository";
import { IUserRepository } from "../interfaces/user-repository.interface";

export class LoginService {
    private userRepository: IUserRepository;

    constructor(userRepository: IUserRepository) {
        this.userRepository = userRepository;
    }

    public async findByEmail(email: string): Promise<IUser | null> {
        // Call the findByEmail method from the user repository
        const user = await this.userRepository.findByEmail(email);
        // Return the user found or null
        return user;
    }
}
