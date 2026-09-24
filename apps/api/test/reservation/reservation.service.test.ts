import { Types } from 'mongoose';
import { describe, expect, it, vi } from 'vitest';
import type { CreateReservationDto } from '@drivn/shared';
import type { ReservationDocument } from '../../src/modules/reservation/models/reservation.model';
import { ResevationService } from '../../src/modules/reservation/resevation.service';

const agencyId = new Types.ObjectId();
const carId = new Types.ObjectId();
const pickupLocationId = new Types.ObjectId();
const dropoffLocationId = new Types.ObjectId();
const reservationId = new Types.ObjectId();

const data: CreateReservationDto = {
	carId: carId.toString(),
	renterName: 'Alex Driver',
	renterEmail: 'alex@example.com',
	renterPhone: '+1 555 123 4567',
	pickupLocationId: pickupLocationId.toString(),
	dropoffLocationId: dropoffLocationId.toString(),
	startDate: new Date('2026-10-01'),
	endDate: new Date('2026-10-03'),
	status: 'pending',
	dailyRate: 50,
	totalDays: 2,
	totalAmount: 100,
};

const createService = () => {
	const reservationModel = {
		find: vi.fn(),
		findOne: vi.fn(),
		findOneAndUpdate: vi.fn(),
		create: vi.fn(),
	};
	const locationService = {
		getManyByIds: vi.fn(),
	};
	const carSevice = {
		findAgencyCarById: vi.fn(),
	};

	return {
		service: new ResevationService(
			reservationModel as never,
			locationService as never,
			carSevice as never,
		),
		reservationModel,
		locationService,
		carSevice,
	};
};

describe('ResevationService', () => {
	it('gets reservations by agency', async () => {
		const { service, reservationModel } = createService();
		const reservations = [{ _id: reservationId }] as ReservationDocument[];
		reservationModel.find.mockReturnValue({
			exec: vi.fn().mockResolvedValue(reservations),
		});

		const result = await service.getByAgency(agencyId);

		expect(result).toEqual([undefined, reservations]);
		expect(reservationModel.find).toHaveBeenCalledWith({ agencyId });
	});

	it('creates a reservation after validating the car and locations', async () => {
		const { service, reservationModel, locationService, carSevice } = createService();
		const reservation = { _id: reservationId } as ReservationDocument;
		carSevice.findAgencyCarById.mockResolvedValue([undefined, { status: 'available' }]);
		locationService.getManyByIds.mockResolvedValue([
			undefined,
			[{ _id: pickupLocationId }, { _id: dropoffLocationId }],
		]);
		reservationModel.create.mockResolvedValue(reservation);

		const result = await service.create(agencyId, agencyId, data);

		expect(result).toEqual([undefined, reservation]);
		expect(carSevice.findAgencyCarById).toHaveBeenCalledWith(agencyId, expect.any(Types.ObjectId));
		expect(locationService.getManyByIds).toHaveBeenCalledWith([
			expect.any(Types.ObjectId),
			expect.any(Types.ObjectId),
		]);
		expect(reservationModel.create).toHaveBeenCalledWith({
			...data,
			agencyId,
			organizationId: agencyId,
			carId: expect.any(Types.ObjectId),
			pickupLocationId: expect.any(Types.ObjectId),
			dropoffLocationId: expect.any(Types.ObjectId),
		});
	});

	it('returns an internal error when the car lookup fails', async () => {
		const { service, carSevice, locationService } = createService();
		carSevice.findAgencyCarById.mockResolvedValue([new Error('database unavailable'), undefined]);

		const [error, result] = await service.create(agencyId, agencyId, data);

		expect(error).toMatchObject({
			status: 'INTERNAL_SERVER_ERROR',
			message: "Couldn't get reservation car",
		});
		expect(result).toBeUndefined();
		expect(locationService.getManyByIds).not.toHaveBeenCalled();
	});

	it('returns not found when the car does not exist', async () => {
		const { service, carSevice, locationService } = createService();
		carSevice.findAgencyCarById.mockResolvedValue([undefined, undefined]);

		const [error, result] = await service.create(agencyId, agencyId, data);

		expect(error).toMatchObject({
			status: 'NOT_FOUND',
			message: "Couldn't find resevation car",
		});
		expect(result).toBeUndefined();
		expect(locationService.getManyByIds).not.toHaveBeenCalled();
	});

	it('returns conflict when the car is unavailable', async () => {
		const { service, carSevice, locationService } = createService();
		carSevice.findAgencyCarById.mockResolvedValue([undefined, { status: 'rented' }]);

		const [error, result] = await service.create(agencyId, agencyId, data);

		expect(error).toMatchObject({
			status: 'CONFLICT',
			message: 'Car is not available for reservation',
		});
		expect(result).toBeUndefined();
		expect(locationService.getManyByIds).not.toHaveBeenCalled();
	});

	it('returns an internal error when the location lookup fails or is incomplete', async () => {
		const cases = [
			[new Error('database unavailable'), undefined],
			[undefined, [{ _id: pickupLocationId }]],
		] as const;

		for (const locationsResult of cases) {
			const { service, carSevice, locationService, reservationModel } = createService();
			carSevice.findAgencyCarById.mockResolvedValue([undefined, { status: 'available' }]);
			locationService.getManyByIds.mockResolvedValue(locationsResult);

			const [error, result] = await service.create(agencyId, agencyId, data);

			expect(error).toMatchObject({
				status: 'INTERNAL_SERVER_ERROR',
				message: "Couldn't get Reservation locations",
			});
			expect(result).toBeUndefined();
			expect(reservationModel.create).not.toHaveBeenCalled();
		}
	});

	it('gets a reservation by agency and id', async () => {
		const { service, reservationModel } = createService();
		const reservation = { _id: reservationId } as ReservationDocument;
		reservationModel.findOne.mockResolvedValue(reservation);

		const result = await service.getById(agencyId, reservationId);

		expect(result).toEqual([undefined, reservation]);
		expect(reservationModel.findOne).toHaveBeenCalledWith({
			agencyId,
			_id: reservationId,
		});
	});

	it('updates a reservation status', async () => {
		const { service, reservationModel } = createService();
		const reservation = { _id: reservationId, status: 'confirmed' } as ReservationDocument;
		reservationModel.findOneAndUpdate.mockResolvedValue(reservation);

		const result = await service.updateStatus(agencyId, reservationId, 'confirmed');

		expect(result).toEqual([undefined, reservation]);
		expect(reservationModel.findOneAndUpdate).toHaveBeenCalledWith(
			{ agencyId, _id: reservationId },
			{ $set: { status: 'confirmed' } },
		);
	});
});
