import { Controller } from "../../../core/Controller";
import { NextFunc, HttpRequest, HttpResponse } from "../../../core/Types";
import { createResponse } from "../../../utils/response";
import { validationMiddleware } from "../../../validators/form.validation";
import { RoleService } from "../services/role.service";
import { CreateRoleDto } from "../dtos/create-role.dto";
import { UpdateRoleDto } from "../dtos/update-role.dto";

export class RoleController extends Controller {
    private roleService: RoleService;
    private auth = { private: true, public: false };

    constructor() {
        super();
        this.roleService = this.getService("RoleService");
    }

    public onRegister(): void {
        this.onPost("/role/create", [validationMiddleware(CreateRoleDto)], this.auth.public, this.roleCreate);
        this.onGet("/role", [], this.auth.private, this.roleList);
        this.onGet("/role/:id", [], this.auth.public, this.getRoleById);
        this.onPut("/role/:id", [validationMiddleware(UpdateRoleDto)], this.auth.public, this.updateRole);
        this.onDelete("/role/:id", [], this.auth.public, this.deleteRole);
    }

    // Create a new role
    public async roleCreate(req: HttpRequest, resp: HttpResponse, next: NextFunc) {
        const { name, isActive } = req.body;
        try {
            await this.roleService.create(name, isActive);
            const roleData = { name, isActive };
            return resp.status(201).send(createResponse(201, "Role created successfully", roleData));
        } catch (error) {
            return next(createResponse(409, error.message, null));
        }
    }

    public async roleList(req: HttpRequest, resp: HttpResponse, next: NextFunc) {
        const { search, page = 1, limit = 10 } = req.query;

        try {
            const { roles, total, currentPage, lastPage } = await this.roleService.getRoles(search as string, Number(page), Number(limit));
            return resp.status(200).send(createResponse(200, "Roles retrieved successfully", { roles, total, currentPage, lastPage, limit }));
        } catch (error) {
            return next(createResponse(500, error.message, null));
        }
    }

    // Get a role by ID
    public async getRoleById(req: HttpRequest, resp: HttpResponse, next: NextFunc) {
        const roleId = req.params.id;
        try {
            const role = await this.roleService.getById(roleId);
            if (!role) {
                return next(createResponse(404, "Role not found", null));
            }
            return resp.status(200).send(createResponse(200, "Role retrieved successfully", role));
        } catch (error) {
            return next(createResponse(500, error.message, null));
        }
    }

    // Update a role
    public async updateRole(req: HttpRequest, resp: HttpResponse, next: NextFunc) {
        const roleId = req.params.id;
        const { name, isActive } = req.body;
        try {
            const updatedRole = await this.roleService.update(roleId, { name, isActive });
            if (!updatedRole) {
                return next(createResponse(404, "Role not found", null));
            }
            return resp.status(200).send(createResponse(200, "Role updated successfully", updatedRole));
        } catch (error) {
            if (error.message === "Role name already exists") {
                return next(createResponse(409, error.message, null)); // Conflict status for duplicate names
            }

            return next(createResponse(500, error.message, null));
        }
    }

    // Delete a role
    public async deleteRole(req: HttpRequest, resp: HttpResponse, next: NextFunc) {
        const roleId = req.params.id;
        try {
            const deleted = await this.roleService.delete(roleId);
            if (!deleted) {
                return next(createResponse(404, "Role not found", null));
            }
            return resp.status(200).send(createResponse(200, "Role deleted successfully", null));
        } catch (error) {
            return next(createResponse(500, error.message, null));
        }
    }
}
