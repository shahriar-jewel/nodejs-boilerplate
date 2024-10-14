import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';
import mongoose from 'mongoose';

@ValidatorConstraint({ async: true })
export class IsUniqueConstraint implements ValidatorConstraintInterface {
  async validate(value: any, args: ValidationArguments) {
    const [modelName, property] = args.constraints;

    // Check if the model exists in mongoose models
    const model = mongoose.models[modelName];

    if (!model) {
      // If the model is not found, throw an error
      throw new Error(`Model '${modelName}' not found in mongoose models.`);
    }

    try {
      // Query the database to check if the value exists
      const existingRecord = await model.findOne({ [property]: value });

      // Return true if no record exists (i.e., value is unique)
      return !existingRecord;
    } catch (error) {
      // Throw an error that will be caught by the global error handler
      throw new Error(`Error during uniqueness validation: ${error.message}`);
    }
  }

  defaultMessage(args: ValidationArguments) {
    return `${args.property} must be unique. '${args.value}' is already taken.`;
  }
}

export function IsUnique(
  modelName: string,
  property: string,
  validationOptions?: ValidationOptions,
) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [modelName, property],
      validator: IsUniqueConstraint,
    });
  };
}
