import { IRole } from "./role.interface";

export interface IRoleRepository {
    create(roleData: IRole): Promise<IRole>;
    findRoles(searchTerm: string, page: number, limit: number): Promise<{
        roles: IRole[],
        total: number,
        currentPage: number,
        lastPage: number,
        limit: number
    }>;
    findById(roleId: string): Promise<IRole | null>;
    findByName(name: string): Promise<IRole | null>;
    update(roleId: string, updateData: Partial<IRole>): Promise<IRole | null>;
    delete(roleId: string): Promise<boolean>;
}
