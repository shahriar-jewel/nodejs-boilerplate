import mongoose, { Schema } from "mongoose";
import { IPermission } from "../interfaces/permission.interface";

const PermissionSchema: Schema = new Schema({
  name: { type: String, required: true, maxlength: 255 },
  code: { type: String, required: true, maxlength: 255 },
  description: { type: String, required: false, maxlength: 255 },
  isActive: { type: Boolean, default: true },
  createdBy: { type: String, default: '' },
  updatedBy: { type: String, default: '' },
}, { timestamps: true });

PermissionSchema.index({ code: 1 });

export default mongoose.model<IPermission>("Permission", PermissionSchema);
