import {
	createReservationSchema,
	updateReservationStatusSchema,
	type CreateReservationDto,
} from '@drivn/shared';
import type { Request } from 'express';
import { notFound, validationFailed } from '../../errors';
import { toFieldErrors } from '../../lib/utils';
import reservationService, { ResevationService } from './resevation.service';

class ReservationController {
	constructor(private readonly reservationService: ResevationService) {}
	getByAgency = async (req: Request) => {
		const [error, reservations] = await this.reservationService.getByAgency(req.agency!.id);
		if (error) throw error;
		return reservations;
	};

	getById = async (req: Request<{ id: string }>) => {
		const [error, reservation] = await this.reservationService.getById(
			req.agency!.id,
			req.params.id,
		);
		if (error) throw error;
		if (!reservation) throw notFound('Reservation not found');
		return reservation;
	};

	create = async (req: Request) => {
		const parsed = createReservationSchema.safeParse(req.body);
		if (!parsed.success) throw validationFailed(toFieldErrors(parsed.error));

		const data: CreateReservationDto = parsed.data;
		const [error, reservation] = await this.reservationService.create(
			req.agency!.id,
			req.agency!.organizationId,
			data,
		);
		if (error) throw error;
		return reservation;
	};

	updateStatus = async (req: Request<{ id: string }>) => {
		const parsed = updateReservationStatusSchema.safeParse(req.body);
		if (!parsed.success) throw validationFailed(toFieldErrors(parsed.error));
		const [error, reservation] = await this.reservationService.updateStatus(
			req.agency!.id,
			req.params.id,
			parsed.data.status,
		);
		if (error) throw error;
		if (!reservation) throw notFound('Reservation not found');
		return reservation;
	};
}

export default new ReservationController(reservationService);
