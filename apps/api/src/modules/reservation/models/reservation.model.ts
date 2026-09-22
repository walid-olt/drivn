import { type Reservation } from '@drivn/shared';
import { Document, Schema, model, Types } from 'mongoose';

interface ReservationDocument
	extends
		Omit<
			Reservation,
			'organizationId' | '_id' | 'agencyId' | 'carId' | 'pickupLocationId' | 'dropoffLocationId'
		>,
		Document {
	organizationId: Types.ObjectId;
	agencyId: Types.ObjectId;
	carId: Types.ObjectId;
	renterName: string;
	renterEmail?: string;
	renterPhone?: string;
	pickupLocationId: Types.ObjectId;
	dropoffLocationId: Types.ObjectId;
}

const ReservationSchema = new Schema<ReservationDocument>({
	organizationId: { type: Types.ObjectId, required: true, ref: 'Organization' },
	agencyId: { type: Types.ObjectId, required: true, ref: 'Agency' },
	carId: { type: Types.ObjectId, required: true, ref: 'Car' },
	renterName: { type: String, required: true, trim: true },
	renterEmail: { type: String, required: false, lowercase: true, trim: true },
	renterPhone: { type: String, required: false, trim: true },
	pickupLocationId: { type: Types.ObjectId, required: true, ref: 'Location' },
	dropoffLocationId: { type: Types.ObjectId, required: true, ref: 'Location' },
	startDate: { type: Date, required: true, index: true },
	endDate: { type: Date, required: true },
	status: {
		type: String,
		enum: ['pending', 'confirmed', 'cancelled', 'completed', 'rejected'],
		default: 'pending',
		required: true,
	},
	dailyRate: { type: Number, required: true },
	totalDays: { type: Number, required: true },
	totalAmount: { type: Number, required: true },
	notes: { type: String, required: false },
});

// indexes: fast lookup by tenant + agency + car and by status
ReservationSchema.index({ organizationId: 1, agencyId: 1, carId: 1 });
ReservationSchema.index({ status: 1 });

const ReservationModel = model<ReservationDocument>('Reservation', ReservationSchema);

export default ReservationModel;
