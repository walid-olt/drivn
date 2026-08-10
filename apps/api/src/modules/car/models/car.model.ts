import { type Car } from '@drivn/shared';
import { Document, Schema, model, Types } from 'mongoose';

interface CarDocument extends Omit<Car, 'organizationId' | '_id'>, Document {
	organizationId: Types.ObjectId;
	agencyId: Types.ObjectId;
}

const CarSchema = new Schema<CarDocument>({
	organizationId: { type: Types.ObjectId, required: true, ref: 'Organization' },
	agencyId: { type: Types.ObjectId, required: true, ref: 'Agency' },
	make: { type: String, required: true, index: true },
	model: { type: String, required: true, index: true },
	year: { type: Number, required: true },
	vin: { type: String, required: false, unique: false },
	licensePlate: { type: String, required: false },
	color: { type: String, required: false },
	status: {
		type: String,
		enum: ['available', 'rented', 'maintenance'],
		default: 'available',
		required: true,
	},
	images: { type: [String], required: false },
	metadata: { type: Schema.Types.Mixed, required: false },
});

// compound index for fast lookups by org+agency; index status separately
CarSchema.index({ organizationId: 1, agencyId: 1 });
CarSchema.index({ status: 1 });

const CarModel = model<CarDocument>('Car', CarSchema);

export default CarModel;
