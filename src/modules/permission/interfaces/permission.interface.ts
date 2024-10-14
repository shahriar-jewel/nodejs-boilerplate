export interface IPermission {
    id?: string,
    name: string;
    code: string,
    description?: string,
    isActive: boolean;
    createdBy?: string;
    updatedBy?: string;
    createdAt?: Date;
    updatedAt?: Date;
}
