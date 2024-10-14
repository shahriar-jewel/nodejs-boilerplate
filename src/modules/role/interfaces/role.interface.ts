export interface IRole {
    id?: string,
    name: string;
    isActive: boolean;
    createdBy?: string;
    updatedBy?: string;
    createdAt?: Date;
    updatedAt?: Date;
}
