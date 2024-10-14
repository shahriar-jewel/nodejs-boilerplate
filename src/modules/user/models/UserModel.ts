import mongoose, { Schema } from "mongoose";
import { IUser } from "../../../core/IUserProvider";

const RoleSchema: Schema = new Schema({
    id: { type: String, required: true },
    name: { type: String, required: true }
  });

const UserSchema: Schema = new Schema({
  name: { type: String, required: true, maxlength: 255 },
  username: { type: String, required: true, unique: true, maxlength: 255 },
  email: { type: String, required: true, unique: true, maxlength: 255 },
  mobile: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: RoleSchema, required: true },
  isActive: { type: Boolean, default: true },
  createdBy: { type: String, default: '' },
  updatedBy: { type: String, default: '' },
}, { timestamps: true });

export default mongoose.model<IUser>("User", UserSchema);
