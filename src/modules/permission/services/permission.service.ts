import { IPermission } from "../interfaces/permission.interface";
import mongoose from 'mongoose';
import { IPermissionRepository } from "../interfaces/permission-repository.interface";

export class PermissionService {
    private permissionRepository: IPermissionRepository;

    constructor(permissionRepository: IPermissionRepository) {
        this.permissionRepository = permissionRepository;
    }

    // Create a new permission
    public async create(name: string, code: string, description: string, isActive: boolean): Promise<IPermission> {
        const permissionData: IPermission = {
            name,
            code,
            description,
            isActive,
            createdBy: "fghfhg",
            createdAt: new Date(),
            updatedAt: new Date()
        };

        return await this.permissionRepository.create(permissionData);
    }

    // Get all permissions
    public async getPermissions(searchTerm: string, page: number, limit: number): Promise<{
        permissions: IPermission[],
        total: number,
        currentPage: number,
        lastPage: number,
        limit: number
    }> {
        return await this.permissionRepository.findPermissions(searchTerm, page, limit);
    }

    // Get a permission by ID
    public async getById(permissionId: string): Promise<IPermission | null> {
        if (!mongoose.Types.ObjectId.isValid(permissionId)) {
            throw new Error("Invalid Permission ID format");
        }
        return await this.permissionRepository.findById(permissionId);
    }

    // Update a permission
    public async update(permissionId: string, updateData: Partial<IPermission>): Promise<IPermission | null> {

        if (!mongoose.Types.ObjectId.isValid(permissionId)) {
            throw new Error("Invalid Permission ID format");
        }
        if (updateData.code) {
            const existingPermission = await this.permissionRepository.findByCode(updateData.code);
            if (existingPermission && existingPermission.id.toString() !== permissionId) {
                throw new Error("Permission code already exists");
            }
        }
        return await this.permissionRepository.update(permissionId, updateData);
    }

    // Delete a permission
    public async delete(permissionId: string): Promise<boolean> {
        return await this.permissionRepository.delete(permissionId);
    }
}
