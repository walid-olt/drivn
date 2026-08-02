import z from 'zod';
import { isValidPhoneNumber } from 'libphonenumber-js';

const phoneNumberSchema = z.string().refine(isValidPhoneNumber, {
	message: 'invalid phone number',
});

export default phoneNumberSchema;
