import {
  Injectable,
  Optional,
  PipeTransform,
  ArgumentMetadata,
  HttpStatus,
  BadRequestException,
} from '@nestjs/common';
import { type ZodSchema } from 'zod';

@Injectable()
export class ZodValidationPipe implements PipeTransform {
  private readonly errorHttpStatusCode: HttpStatus;

  constructor(
    @Optional() options?: { errorHttpStatusCode?: HttpStatus },
  ) {
    this.errorHttpStatusCode =
      options?.errorHttpStatusCode || HttpStatus.BAD_REQUEST;
  }

  transform(value: unknown, metadata: ArgumentMetadata) {
    const zodSchema: ZodSchema | undefined =
      (metadata?.metatype as any)?.zodSchema;

    if (zodSchema) {
      const parseResult = zodSchema.safeParse(value);

      if (!parseResult.success) {
        const { error } = parseResult;
        const errors: Record<string, string> = {};
        for (const issue of error.issues) {
          const key = issue.path.join('.') || '_root';
          errors[key] = issue.message;
        }
        throw new BadRequestException(errors);
      }

      return parseResult.data;
    }

    return value;
  }
}
