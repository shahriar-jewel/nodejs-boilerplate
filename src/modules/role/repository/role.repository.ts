import { Model } from "mongoose";
import { IRole } from "../interfaces/role.interface";
import RoleModel from "../models/role.model"; // Import the Role model
import { IRoleRepository } from "../interfaces/role-repository.interface"; // Import the Role repository interface

export class RoleRepository implements IRoleRepository {

    // Create a new role
    public async create(roleData: IRole): Promise<IRole> {
        return await RoleModel.create(roleData);
    }

    // Get all roles
    public async findRoles(searchTerm: string, page: number, limit: number): Promise<{
        roles: IRole[],
        total: number,
        currentPage: number,
        lastPage: number,
        limit: number
    }> {
        // Build the query for searching
        const query = searchTerm
            ? {
                $or: [
                    { name: { $regex: searchTerm, $options: 'i' } }
                ]
            }
            : {};

        // Get the total number of documents matching the query
        const total = await RoleModel.countDocuments(query);

        // Calculate the total number of pages
        const lastPage = Math.ceil(total / limit);

        // Fetch the roles with pagination
        const roles = await RoleModel.find(query)
            .skip((page - 1) * limit)
            .limit(limit)
            .exec();

        return {
            roles,
            total,
            currentPage: page,
            lastPage,
            limit
        };
    }

    // Get a role by ID
    public async findById(roleId: string): Promise<IRole | null> {
        return await RoleModel.findById(roleId);
    }

    // Get a role by name
    public async findByName(name: string): Promise<IRole | null> {
        return await RoleModel.findOne({ name }).exec();
    }

    // Update a role
    public async update(roleId: string, updateData: Partial<IRole>): Promise<IRole | null> {
        return await RoleModel.findByIdAndUpdate(roleId, updateData, { new: true }).lean();
    }

    // Delete a role
    public async delete(roleId: string): Promise<boolean> {
        const result = await RoleModel.findByIdAndDelete(roleId);
        return result !== null;
    }
}
