import { Model } from "mongoose";
import { IPermission } from "../interfaces/permission.interface";
import PermissionModel from "../models/permission.model";
import { IPermissionRepository } from "../interfaces/permission-repository.interface";

export class PermissionRepository implements IPermissionRepository {

    // Create a new permission
    public async create(permissionData: IPermission): Promise<IPermission> {
        return await PermissionModel.create(permissionData);
    }

    // Get all permissions
    public async findPermissions(searchTerm: string, page: number, limit: number): Promise<{
        permissions: IPermission[],
        total: number,
        currentPage: number,
        lastPage: number,
        limit: number
    }> {
        // Build the query for searching
        const query = searchTerm
            ? {
                $or: [
                    { name: { $regex: searchTerm, $options: 'i' } },
                    { code: { $regex: searchTerm, $options: 'i' } }
                ]
            }
            : {};

        // Get the total number of documents matching the query
        const total = await PermissionModel.countDocuments(query);

        // Calculate the total number of pages
        const lastPage = Math.ceil(total / limit);

        // Fetch the permissions with pagination
        const permissions = await PermissionModel.find(query)
            .skip((page - 1) * limit)
            .limit(limit)
            .exec();

        return {
            permissions,
            total,
            currentPage: page,
            lastPage,
            limit
        };
    }

    // Get a permission by ID
    public async findById(permissionId: string): Promise<IPermission | null> {
        return await PermissionModel.findById(permissionId);
    }

    public async findByCode(code: string): Promise<IPermission | null> {
        return await PermissionModel.findOne({ code }).exec();
    }

    // Update a permission
    public async update(permissionId: string, updateData: Partial<IPermission>): Promise<IPermission | null> {
        return await PermissionModel.findByIdAndUpdate(permissionId, updateData, { new: true }).lean();
    }

    // Delete a permission
    public async delete(permissionId: string): Promise<boolean> {
        const result = await PermissionModel.findByIdAndDelete(permissionId);
        return result !== null;
    }
}
