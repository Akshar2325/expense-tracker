import { PipeTransform, BadRequestException } from "@nestjs/common";
import { ZodSchema, ZodError } from "zod";

export class ZValidationPipe<T> implements PipeTransform {
  constructor(private schema: ZodSchema<T>) {}

  transform(value: unknown) {
    try {
      const result = this.schema.parse(value);
      return result;
    } catch (error) {
      if (error instanceof ZodError) {
        const details: Record<string, string> = {};
        for (const err of error.errors) {
          const path = err.path.join(".");
          if (!details[path]) {
            details[path] = err.message;
          }
        }
        throw new BadRequestException({
          code: "VALIDATION_FAILED",
          message: "Validation failed",
          details,
        });
      }
      throw error;
    }
  }
}
