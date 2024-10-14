import { Document } from "mongoose";


export interface ISession extends Document {
    mobile: string,
    refreshToken: string,
}

export interface IOtp extends Document {
    mobile: string,
    otp: string,
}

export interface UpdatedBy {
    id: string,
    name: string,
}

export interface IUpdateProfileLog extends Document {
    updateType: string,
    updatedBy: UpdatedBy,
}

export enum Club {
    BananiClub = "Banani Club",
    KhulnaClub = "Khulna Club",
    BoatClub = "Boat Club",
    GulshanClub = "Gulshan Club"
}

export enum Role {
    Superadmin = "Superadmin",
    Admin = "Admin",
    Member = "Member",
    ECMember = "ECMember",
}

export enum Department {
    Accounts = "Accounts",
    Finance = "Finance",
    Restaurant = "Restaurant",
    NotSet = "NotSet"
}

export interface EmbededUser {
    _id: string,
    memCode: string,
    acNo: string,
    name: string,
    email: string,
    mobile: string,
    membershipType: string,
    image: string
}

export interface IUserToken {
    id: string,
    name: string,
    email: string,
    mobile: string,
    role: Role,
    signedAt: Date
}


export interface IUser {
    id?: string,
    name: string,
    username: string,
    email: string,
    mobile: string,
    password: string,
    role: {},
    isActive: boolean,
    createdBy?: string;
    updatedBy?: string;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface IUserPage {
    size: number,
    page: number,
    count: number,
    members: IUser[]
}

export interface IMemberPage {
    size: number,
    page: number,
    count: number,
    members: IUser[]
}



export interface IUserProvider {

    get(mobile: string): Promise<IUser>;
    getById(id: string): Promise<IUser>;
    getByMemberCode(memCode: string): Promise<IUser>;
    getEmbededUserById(id: string): Promise<EmbededUser>;
    memberList(roles?: Role[], page?: number, size?: number, searchStr?: string): Promise<IMemberPage>;

    create(name: string, email: string, mobile: string, password: string, role: Role, membershipType: string, department: Department, club: Club): Promise<IUser>;
    createLog(updateType: string, updatedBy: {}): Promise<IUpdateProfileLog>;
    delete(id: string): Promise<IUser>;
    disable(email: string): Promise<void>;
    enable(email: string): Promise<void>;

    createSession(mobile: string, refreshToken: string): Promise<ISession>;
    checkSession(refreshToken: string): Promise<ISession>;
    createOTPSession(mobile: string, otp: string): Promise<IOtp>;
    checkOTPSession(mobile: string, otp: string): Promise<IOtp>;
    removeOTPSession(mobile: string): Promise<boolean>;
}
