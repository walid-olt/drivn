import z from 'zod';
import { agencySchema, createAgencySchema, updateAgencySchema } from '../schemas/agency.schema.ts';

export type Agency = z.infer<typeof agencySchema>;
export type createAgencyDto = z.infer<typeof createAgencySchema>;
export type updateAgencyDto = z.infer<typeof updateAgencySchema>;
