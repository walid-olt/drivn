import { carImagesSchema, createCarSchema, updateCarSchema } from '@drivn/shared';
import { badRequest, internalServerError, notFound, validationFailed } from '../../errors';
import type { CarService } from './car.service';
import carService from './car.service';
import type { Request } from 'express';
import { toFieldErrors } from '../../lib/utils';

class CarController {
	constructor(protected readonly carService: CarService) {}
	getAll = async () => {
		const [err, cars] = await this.carService.findActive();
		if (err) throw internalServerError('Failed to fetch cars');
		return cars;
	};

	getAgencyCars = async (req: Request) => {
		const agencyId = req.agency!.id;
		const [err, cars] = await this.carService.findAgencyCars(agencyId);

		if (err) throw err;
		return cars;
	};
	getById = async (req: Request<{ id: string }>) => {
		const id = req.params.id;
		const [err, car] = await this.carService.getById(id);
		if (err) throw err;
		if (!car) throw notFound('Car not found');
		return car;
	};
	update = async (req: Request<{ id: string }>) => {
		const imageFiles = Array.isArray(req.files) ? req.files : [];
		const imageUrls = imageFiles.length ? await this.uploadImages(imageFiles) : undefined;
		const parsed = updateCarSchema.safeParse(this.parseMultipartBody(req.body));
		if (!parsed.success) throw validationFailed(toFieldErrors(parsed.error), 'Invalid car data');

		const [err, car] = await this.carService.update(req.params.id, req.agency!.id, {
			...parsed.data,
			...(imageUrls && { images: imageUrls }),
		});
		if (err) throw err;
		if (!car) throw notFound('Car not found for this agency');
		return car;
	};
	delete = async (req: Request<{ id: string }>) => {
		const [err, deleted] = await this.carService.delete(req.params.id, req.agency!.id);
		if (err) throw err;
		if (!deleted) throw notFound('Car not found for this agency');
		return deleted;
	};
	create = async (req: Request) => {
		const agency = req.agency!;
		const agencyId = agency.id;
		const orgId = agency.organizationId.toString();

		// get images
		const carImages = req.files;

		let images: string[] | undefined;
		if (Array.isArray(carImages) && carImages.length > 0) {
			images = await this.uploadImages(carImages);
		} else if (Array.isArray(req.body.images)) {
			images = req.body.images;
		}
		if (!images) throw badRequest('No car images provided!');

		const { error: zodErr, data: carDetails } = createCarSchema.safeParse({
			...this.parseMultipartBody(req.body),
			images,
		});
		if (zodErr) throw validationFailed(toFieldErrors(zodErr), 'Invalid car data');

		const [err, car] = await this.carService.create({
			...carDetails,
			agencyId,
			organizationId: orgId,
		});
		if (err) throw err;

		return car;
	};

	/**
	 * Validate the Multer buffers with the shared file schema before storing
	 * them. The database receives URLs, not binary data.
	 */
	private uploadImages = async (files: Express.Multer.File[]) => {
		const imageFiles = files.map(
			(file) => new File([file.buffer], file.originalname, { type: file.mimetype }),
		);
		const parsed = carImagesSchema.safeParse(imageFiles);
		if (!parsed.success) throw validationFailed(toFieldErrors(parsed.error));

		const [error, stored] = await this.carService.uploadCarImages(files);
		if (error) throw internalServerError('Failed to store car images');
		return stored.map(({ url }) => url);
	};

	/**
	 * Parse the multipart form data body and convert numeric fields to numbers.
	 * the multipart form data protocol only supports strings and binary data
	 */
	private parseMultipartBody = (body: Record<string, unknown>) => {
		const numericFields = ['year', 'seatingCapacity', 'doors', 'kilometrage', 'dailyRate'];
		return Object.fromEntries(
			Object.entries(body).map(([key, value]) => [
				key,
				numericFields.includes(key) && typeof value === 'string' ? Number(value) : value,
			]),
		);
	};
}

export default new CarController(carService);
