import ResevationModel, { type ReservationDocument } from './models/reservation.model.ts';
import { type CreateReservationDto, type Reservation, type Result } from '@drivn/shared';

import { type Model } from 'mongoose';
import { tryCatch } from '@drivn/shared';
import { Types } from 'mongoose';
import type { LocationService } from '../location/location.service.ts';
import type { CarService } from '../fleet/car.service.ts';
import { conflict, internalServerError, notFound } from '../../errors/http.exception.ts';
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

	async create(agencyId: Id, data: CreateReservationDto): Promise<Result<ReservationDocument>> {
		const reservationData = {
			...data,
			carId: new ObjectId(data.carId),
			pickupLocationId: new ObjectId(data.pickupLocationId),
			dropoffLocationId: new ObjectId(data.dropoffLocationId),
			agencyId,
		};

		// verify if the car exist and is available
		const carId = reservationData.carId;
		const [carErr, car] = await this.carSevice.findAgencyCarById(agencyId, carId);
		if (carErr) return [internalServerError("Couldn't get reservation car"), undefined];
		if (!car) return [notFound("Couldn't find resevation car"), undefined];
		if (car.status !== 'available')
			return [conflict('Car is not available for reservation'), undefined];

		// verify if the locations exist
		const [err, locations] = await this.locationService.getManyByIds([
			reservationData.pickupLocationId,
			reservationData.dropoffLocationId,
		]);
		if (err) return [internalServerError("Couldn't get Reservation locations"), undefined];
		if (!locations || locations.length !== 2)
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
