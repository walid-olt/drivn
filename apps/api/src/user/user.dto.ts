import { createZodDto } from '@anatine/zod-nestjs';
import { userSchema } from '@drivn/shared';
export class CreateUserDto extends createZodDto(userSchema) {}
