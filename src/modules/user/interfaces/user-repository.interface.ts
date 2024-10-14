import { IUser } from "../../../core/IUserProvider";

export interface IUserRepository {
    create(roleData: IUser): Promise<IUser>;
    findByEmail(roleId: string): Promise<IUser | null>;
}
