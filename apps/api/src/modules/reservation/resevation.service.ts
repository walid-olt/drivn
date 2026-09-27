import ResevationModel, { type ReservationDocument } from './models/reservation.model.ts';
import { type CreateReservationDto, type Reservation, type Result } from '@drivn/shared';

import { type Model } from 'mongoose';
import { tryCatch } from '@drivn/shared';
import { Types } from 'mongoose';
import type { LocationService } from '../location/location.service.ts';
import type { CarService } from '../fleet/car.service.ts';
import {
	badRequest,
	conflict,
	internalServerError,
	notFound,
} from '../../errors/http.exception.ts';
import carService from '../fleet/car.service.ts';
import locationService from '../location/location.service.ts';

type Id = string | Types.ObjectId;
const ObjectId = Types.ObjectId;

export class ResevationService {
	constructor(
		private readonly resevationModel: Model<ReservationDocument>,
		private readonly locationService: LocationService,
		private readonly carSevice: CarService,
	) {}

	async getByAgency(agencyId: Id) {
		const promise = this.resevationModel
			.find({
				agencyId,
			})
			.exec();

		return tryCatch(promise);
	}

	async create(
		agencyId: Id,
		organizationId: Id,
		data: CreateReservationDto,
	): Promise<Result<ReservationDocument>> {
		// `new ObjectId('')` throws a CastError, which would escape as an unhandled
		// exception instead of a result, so reject malformed ids up front.
		let carObjectId: Types.ObjectId;
		let pickupObjectId: Types.ObjectId;
		let dropoffObjectId: Types.ObjectId;
		try {
			carObjectId = new ObjectId(data.carId);
			pickupObjectId = new ObjectId(data.pickupLocationId);
			dropoffObjectId = new ObjectId(data.dropoffLocationId);
		} catch {
			return [badRequest('Invalid car or location id.'), undefined];
		}

		const reservationData = {
			...data,
			carId: carObjectId,
			pickupLocationId: pickupObjectId,
			dropoffLocationId: dropoffObjectId,
			agencyId,
			organizationId,
		};

		// verify if the car exist and is available
		const [carErr, car] = await this.carSevice.findAgencyCarById(agencyId, carObjectId);
		if (carErr) return [internalServerError("Couldn't get reservation car"), undefined];
		if (!car) return [notFound("Couldn't find resevation car"), undefined];
		if (car.status !== 'available')
			return [conflict('Car is not available for reservation'), undefined];

		// verify if the locations exist
		const locationIds = [pickupObjectId, dropoffObjectId];
		const [err, locations] = await this.locationService.getManyByIds(locationIds);
		if (err) return [internalServerError("Couldn't get Reservation locations"), undefined];
		// A round trip picks the same location twice, and `$in` collapses duplicates,
		// so compare against the number of distinct ids rather than the raw count.
		const distinctLocationIds = new Set(locationIds.map(String)).size;
		if (!locations || locations.length < distinctLocationIds)
			return [internalServerError("Couldn't get Reservation locations"), undefined];

		// create the reservation
		const promise = this.resevationModel.create(reservationData);
		return tryCatch(promise);
	}
	async getById(agencyId: Id, reservationId: Id) {
		const promise = this.resevationModel.findOne({
			agencyId,
			_id: reservationId,
		});
		return tryCatch(promise);
	}

	async updateStatus(agencyId: Id, reservationId: Id, status: Reservation['status']) {
		const promise = this.resevationModel.findOneAndUpdate(
			{
				agencyId,
				_id: reservationId,
			},
			{
				$set: { status },
			},
		);
		return tryCatch(promise);
	}
}

export default new ResevationService(ResevationModel, locationService, carService);
