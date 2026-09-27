import { type Model } from 'mongoose';
import CarModel, { type CarDocument } from './car.model.ts';
import { tryCatch, type CreateCarDto, type UpdateCarDto } from '@drivn/shared';
import type { Types } from 'mongoose';
import type { IStorageService } from '../../types/storage.ts';
import { localStorageService } from '../../lib/services/LocalStorageService.ts';
import path from 'node:path';

type CreateCarRecord = CreateCarDto & {
	organizationId: string | Types.ObjectId;
	agencyId: string | Types.ObjectId;
};

type Id = string | Types.ObjectId;
export class CarService {
	constructor(
		private readonly carModel: Model<CarDocument>,
		private readonly storageService: IStorageService,
	) {}

	async create(data: CreateCarRecord) {
		const promise = this.carModel.create(data);
		return tryCatch(promise);
	}
	//TODO: add filters
	async findActive() {
		const promise = this.carModel.find({ status: 'available' }).lean();
		return tryCatch(promise);
	}

	async findAgencyCars(agencyId: string) {
		const promise = this.carModel.find({ agencyId }).lean();
		return tryCatch(promise);
	}

	async findAgencyCarById(agencyId: Id, carId: Id) {
		const promise = this.carModel.findOne({ _id: carId, agencyId }).lean();
		return tryCatch(promise);
	}

	async getById(id: string) {
		const promise = this.carModel.findOne({
			_id: id,
		});
		return tryCatch(promise);
	}
	async update(id: string, agencyId: string, data: UpdateCarDto) {
		const promise = this.carModel.findOneAndUpdate(
			{ _id: id, agencyId },
			{ $set: data },
			// Get the updated document after the update operation and run validators on the update
			{ returnDocument: 'after', runValidators: true },
		);

		return tryCatch(promise);
	}

	async delete(id: string, agencyId: string) {
		return tryCatch(this.carModel.findOneAndDelete({ _id: id, agencyId }));
	}

	async uploadCarImages(images: Express.Multer.File[]) {
		// Multer keeps uploads in memory. Persist each buffer first, then store
		// only the public URLs in MongoDB so car records stay small and portable.
		const uploadPromises = images.map((image) => {
			const extension = path.extname(image.originalname).toLowerCase() || '.img';
			return this.storageService.save({
				filename: `car-${crypto.randomUUID()}${extension}`,
				mimeType: image.mimetype,
				content: image.buffer,
			});
		});

		return tryCatch(Promise.all(uploadPromises));
	}
}

export default new CarService(CarModel, localStorageService);
