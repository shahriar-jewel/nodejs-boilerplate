import mongoose, { Schema } from "mongoose";
import { IRole } from "../interfaces/role.interface";

const RoleSchema: Schema = new Schema({
  name: { type: String, required: true, maxlength: 255 },
  isActive: { type: Boolean, default: true },
  createdBy: { type: String, default: '' },
  updatedBy: { type: String, default: '' },
}, { timestamps: true });

RoleSchema.index({ name: 1 });

export default mongoose.model<IRole>("Role", RoleSchema);
