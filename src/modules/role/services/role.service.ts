import { IRole } from "../interfaces/role.interface";
import mongoose from 'mongoose';
import { IRoleRepository } from "../interfaces/role-repository.interface";

export class RoleService {
    private roleRepository: IRoleRepository;

    constructor(roleRepository: IRoleRepository) {
        this.roleRepository = roleRepository;
    }

    // Create a new role
    public async create(name: string, isActive: boolean): Promise<IRole> {
        const roleData: IRole = {
            name,
            isActive,
            createdBy: "fghfhg",
            createdAt: new Date(),
            updatedAt: new Date()
        };

        return await this.roleRepository.create(roleData);
    }

    // Get all roles
    public async getRoles(searchTerm: string, page: number, limit: number): Promise<{
        roles: IRole[],
        total: number,
        currentPage: number,
        lastPage: number,
        limit: number
    }> {
        return await this.roleRepository.findRoles(searchTerm, page, limit);
    }

    // Get a role by ID
    public async getById(roleId: string): Promise<IRole | null> {
        if (!mongoose.Types.ObjectId.isValid(roleId)) {
            throw new Error("Invalid Role ID format");
        }
        return await this.roleRepository.findById(roleId);
    }

    // Update a role
    public async update(roleId: string, updateData: Partial<IRole>): Promise<IRole | null> {

        if (!mongoose.Types.ObjectId.isValid(roleId)) {
            throw new Error("Invalid Role ID format");
        }
        if (updateData.name) {
            const existingRole = await this.roleRepository.findByName(updateData.name);
            if (existingRole && existingRole.id.toString() !== roleId) {
                throw new Error("Role name already exists");
            }
        }
        return await this.roleRepository.update(roleId, updateData);
    }

    // Delete a role
    public async delete(roleId: string): Promise<boolean> {
        return await this.roleRepository.delete(roleId);
    }
}
