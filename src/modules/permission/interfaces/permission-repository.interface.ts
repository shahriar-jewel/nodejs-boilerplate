import { IPermission } from "../interfaces/permission.interface";

export interface IPermissionRepository {
    create(permissionData: IPermission): Promise<IPermission>;
    findPermissions(searchTerm: string, page: number, limit: number): Promise<{ permissions: IPermission[], total: number, currentPage: number, lastPage: number, limit: number }>;
    findById(permissionId: string): Promise<IPermission | null>;
    findByCode(code: string): Promise<IPermission | null>;
    update(permissionId: string, updateData: Partial<IPermission>): Promise<IPermission | null>;
    delete(permissionId: string): Promise<boolean>;
}
