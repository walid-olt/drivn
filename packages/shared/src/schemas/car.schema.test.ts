/// <reference lib="dom" />
import { describe, expect, it } from 'vitest';
import { carImageSchema, createCarFormSchema, createCarSchema } from './car.schema';
import {
	ACCEPTED_IMAGE_TYPES,
	MAX_CAR_IMAGE_SIZE_BYTES,
	MAX_CAR_IMAGES,
	MAX_TOTAL_CAR_IMAGE_UPLOAD_SIZE_BYTE,
	MIN_CAR_IMAGES,
} from '../constants/files';

const makeFile = (bytes: number, name: string, type = 'image/png') =>
	new File([new Uint8Array(bytes)], name, { type });

const validCar = {
	make: 'Toyota',
	model: 'Corolla',
	year: 2020,
	vin: '1HGBH41JXMN109186',
	licensePlate: 'ABC-123',
	color: 'red',
	dailyRate: 45,
	images: ['https://example.com/car.jpg'],
};

describe('createCarSchema', () => {
	it('parses a valid car payload', () => {
		const result = createCarSchema.parse(validCar);
		expect(result).toMatchObject(validCar);
	});

	it('applies defaults for optional enums and numbers', () => {
		const result = createCarSchema.parse({
			make: 'Toyota',
			model: 'Corolla',
			year: 2020,
			dailyRate: 45,
			images: ['https://example.com/car.jpg'],
		});
		expect(result).toMatchObject({
			status: 'available',
			category: 'sedan',
			transmission: 'automatic',
			fuelType: 'gasoline',
			seatingCapacity: 5,
			doors: 4,
			kilometrage: 0,
		});
	});

	it('strips tenant and identifier fields from the output', () => {
		const result = createCarSchema.parse({
			...validCar,
			_id: '507f1f77bcf86cd799439011',
			organizationId: 'org-1',
			agencyId: 'agency-1',
		});
		expect(result).not.toHaveProperty('_id');
		expect(result).not.toHaveProperty('organizationId');
		expect(result).not.toHaveProperty('agencyId');
	});

	it('rejects a missing make or model', () => {
		expect(() => createCarSchema.parse({ ...validCar, make: '' })).toThrow();
		expect(() => createCarSchema.parse({ ...validCar, model: undefined })).toThrow();
	});

	it('rejects a non-positive daily rate', () => {
		expect(() => createCarSchema.parse({ ...validCar, dailyRate: 0 })).toThrow();
		expect(() => createCarSchema.parse({ ...validCar, dailyRate: -1 })).toThrow();
	});

	it('rejects out-of-range years', () => {
		expect(() => createCarSchema.parse({ ...validCar, year: 1885 })).toThrow();
		expect(() => createCarSchema.parse({ ...validCar, year: 2101 })).toThrow();
	});

	it('rejects a VIN that is not exactly 17 characters', () => {
		expect(() => createCarSchema.parse({ ...validCar, vin: 'ABC123' })).toThrow();
	});

	it('rejects more than the maximum number of images', () => {
		const images = Array.from(
			{ length: MAX_CAR_IMAGES + 1 },
			(_, i) => `https://example.com/car-${i}.jpg`,
		);
		expect(() => createCarSchema.parse({ ...validCar, images })).toThrow();
	});

	it('rejects an empty images array', () => {
		expect(() => createCarSchema.parse({ ...validCar, images: [] })).toThrow();
	});

	it('rejects a non-URL image value', () => {
		expect(() => createCarSchema.parse({ ...validCar, images: ['not-a-url'] })).toThrow();
	});
});

describe('carImageSchema', () => {
	it('accepts every accepted mime type', () => {
		for (const type of ACCEPTED_IMAGE_TYPES) {
			expect(() => carImageSchema.parse(makeFile(10, 'photo', type))).not.toThrow();
		}
	});

	it('rejects a non-image file', () => {
		expect(() => carImageSchema.parse(makeFile(10, 'doc.pdf', 'application/pdf'))).toThrow();
	});

	it('accepts a file at exactly the size limit', () => {
		expect(() => carImageSchema.parse(makeFile(MAX_CAR_IMAGE_SIZE_BYTES, 'max.png'))).not.toThrow();
	});

	it('rejects a file over the size limit', () => {
		expect(() =>
			carImageSchema.parse(makeFile(MAX_CAR_IMAGE_SIZE_BYTES + 1, 'too-big.png')),
		).toThrow();
	});
});

describe('createCarFormSchema', () => {
	const form = (images: File[]) => ({
		make: 'Toyota',
		model: 'Corolla',
		year: 2020,
		dailyRate: 45,
		images,
	});

	it('accepts a single valid file', () => {
		const result = createCarFormSchema.parse(form([makeFile(1024, 'car.png')]));
		expect(result.images).toHaveLength(1);
	});

	it('accepts up to the maximum number of files', () => {
		const files = Array.from({ length: MAX_CAR_IMAGES }, (_, i) => makeFile(1024, `car-${i}.png`));
		expect(() => createCarFormSchema.parse(form(files))).not.toThrow();
	});

	it('rejects an empty file list', () => {
		expect(() => createCarFormSchema.parse(form([]))).toThrow();
	});

	it('rejects more than the maximum number of files', () => {
		const files = Array.from({ length: MAX_CAR_IMAGES + 1 }, (_, i) =>
			makeFile(1024, `car-${i}.png`),
		);
		expect(() => createCarFormSchema.parse(form(files))).toThrow();
	});

	it('rejects a non-image file in the list', () => {
		expect(() =>
			createCarFormSchema.parse(form([makeFile(10, 'doc.pdf', 'application/pdf')])),
		).toThrow();
	});

	it('rejects an individual file over the size limit', () => {
		expect(() =>
			createCarFormSchema.parse(form([makeFile(MAX_CAR_IMAGE_SIZE_BYTES + 1, 'big.png')])),
		).toThrow();
	});

	it('rejects a total upload larger than the documented cap', () => {
		const chunk = 4.5 * 1024 * 1024;
		const files = Array.from({ length: 5 }, (_, i) => makeFile(chunk, `car-${i}.png`));
		expect(MAX_TOTAL_CAR_IMAGE_UPLOAD_SIZE_BYTE).toBe(20 * 1024 * 1024);
		expect(() => createCarFormSchema.parse(form(files))).toThrow();
	});

	it('accepts a total upload within the documented cap', () => {
		const chunk = 4.5 * 1024 * 1024;
		const files = Array.from({ length: 4 }, (_, i) => makeFile(chunk, `car-${i}.png`));
		expect(() => createCarFormSchema.parse(form(files))).not.toThrow();
	});

	it('rejects duplicate files (same name and size)', () => {
		const duplicate = [makeFile(1024, 'car.png'), makeFile(1024, 'car.png')];
		expect(() => createCarFormSchema.parse(form(duplicate))).toThrow();
	});

	it('allows same-name files with different sizes', () => {
		const files = [makeFile(1024, 'car.png'), makeFile(2048, 'car.png')];
		expect(() => createCarFormSchema.parse(form(files))).not.toThrow();
	});

	it('allows different-name files with the same size', () => {
		const files = [makeFile(1024, 'car-a.png'), makeFile(1024, 'car-b.png')];
		expect(() => createCarFormSchema.parse(form(files))).not.toThrow();
	});

	it('strips tenant and identifier fields from the output', () => {
		const result = createCarFormSchema.parse({
			...form([makeFile(1024, 'car.png')]),
			_id: '507f1f77bcf86cd799439011',
			organizationId: 'org-1',
			agencyId: 'agency-1',
		});
		expect(result).not.toHaveProperty('_id');
		expect(result).not.toHaveProperty('organizationId');
		expect(result).not.toHaveProperty('agencyId');
	});

	it('exposes a sane minimum images constant', () => {
		expect(MIN_CAR_IMAGES).toBe(1);
	});
});
