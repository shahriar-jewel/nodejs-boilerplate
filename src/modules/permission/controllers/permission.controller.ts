import { Controller } from "../../../core/Controller";
import { NextFunc, HttpRequest, HttpResponse } from "../../../core/Types";
import { createResponse } from "../../../utils/response";
import { validationMiddleware } from "../../../validators/form.validation";
import { PermissionService } from "../services/permission.service";
import { CreatePermissionDto } from "../dtos/create-permission.dto";
import { UpdatePermissionDto } from "../dtos/update-permission.dto";

export class PermissionController extends Controller {
    private permissionService: PermissionService;
    private auth = { private: true, public: false };

    constructor() {
        super();
        this.permissionService = this.getService("PermissionService");
    }

    public onRegister(): void {
        this.onPost("/permission/create", [validationMiddleware(CreatePermissionDto)], this.auth.public, this.permissionCreate);
        this.onGet("/permission", [], this.auth.public, this.permissionList);
        this.onGet("/permission/:id", [], this.auth.public, this.getPermissionById);
        this.onPut("/permission/:id", [validationMiddleware(UpdatePermissionDto)], this.auth.public, this.updatePermission);
        this.onDelete("/permission/:id", [], this.auth.public, this.deletePermission);
    }

    // Create a new permission
    public async permissionCreate(req: HttpRequest, resp: HttpResponse, next: NextFunc) {
        const { name, code, description, isActive } = req.body;
        try {
            await this.permissionService.create(name, code, description, isActive);
            const permissionData = { name, code, description, isActive };
            return resp.status(201).send(createResponse(201, "Permission created successfully", permissionData));
        } catch (error) {
            return next(createResponse(409, error.message, null));
        }
    }

    public async permissionList(req: HttpRequest, resp: HttpResponse, next: NextFunc) {
        const { search, page = 1, limit = 10 } = req.query;

        try {
            const { permissions, total, currentPage, lastPage } = await this.permissionService.getPermissions(search as string, Number(page), Number(limit));
            return resp.status(200).send(createResponse(200, "Permissions retrieved successfully", { permissions, total, currentPage, lastPage, limit }));
        } catch (error) {
            return next(createResponse(500, error.message, null));
        }
    }

    // Get a permission by ID
    public async getPermissionById(req: HttpRequest, resp: HttpResponse, next: NextFunc) {
        const permissionId = req.params.id;
        try {
            const permission = await this.permissionService.getById(permissionId);
            if (!permission) {
                return next(createResponse(404, "Permission not found", null));
            }
            return resp.status(200).send(createResponse(200, "Permission retrieved successfully", permission));
        } catch (error) {
            return next(createResponse(500, error.message, null));
        }
    }

    // Update a permission
    public async updatePermission(req: HttpRequest, resp: HttpResponse, next: NextFunc) {
        const permissionId = req.params.id;
        const { name, code, description, isActive } = req.body;
        try {
            const updatedPermission = await this.permissionService.update(permissionId, { name, code, description, isActive });
            if (!updatedPermission) {
                return next(createResponse(404, "Permission not found", null));
            }
            return resp.status(200).send(createResponse(200, "Permission updated successfully", updatedPermission));
        } catch (error) {
            if (error.message === "Permission name already exists") {
                return next(createResponse(409, error.message, null)); // Conflict status for duplicate names
            }

            return next(createResponse(500, error.message, null));
        }
    }

    // Delete a permission
    public async deletePermission(req: HttpRequest, resp: HttpResponse, next: NextFunc) {
        const permissionId = req.params.id;
        try {
            const deleted = await this.permissionService.delete(permissionId);
            if (!deleted) {
                return next(createResponse(404, "Permission not found", null));
            }
            return resp.status(200).send(createResponse(200, "Permission deleted successfully", null));
        } catch (error) {
            return next(createResponse(500, error.message, null));
        }
    }
}
