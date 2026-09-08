import z from 'zod';
import { isValidPhoneNumber } from 'libphonenumber-js';

const phoneNumberSchema = z.string().refine(isValidPhoneNumber, {
	message: 'Enter a valid phone number, including the country code.',
});

export default phoneNumberSchema;
