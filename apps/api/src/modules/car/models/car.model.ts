import { type Car } from '@drivn/shared';
import { Document, Schema, model, Types } from 'mongoose';

interface CarDocument
	extends
		Omit<Document, 'model'>,
		// omit the 'model' property from Document to avoid conflict with Car's 'model' property
		Omit<Car, 'organizationId' | 'agencyId' | '_id' | 'model'> {
	organizationId: Types.ObjectId;
	agencyId: Types.ObjectId;
	model: string;
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
		enum: ['available', 'rented', 'maintenance', 'inactive'],
		default: 'available',
		required: true,
	},
	category: {
		type: String,
		enum: ['sedan', 'suv', 'hatchback', 'coupe', 'convertible', 'minivan', 'truck', 'luxury'],
		default: 'sedan',
		required: true,
	},
	transmission: {
		type: String,
		enum: ['automatic', 'manual', 'semi-automatic'],
		default: 'automatic',
		required: true,
	},
	fuelType: {
		type: String,
		enum: ['gasoline', 'diesel', 'electric', 'hybrid', 'plug-in-hybrid'],
		default: 'gasoline',
		required: true,
	},
	seatingCapacity: {
		type: Number,
		min: 1,
		max: 12,
		default: 5,
		required: true,
	},
	doors: { type: Number, min: 2, max: 6, default: 4, required: true },
	kilometrage: { type: Number, min: 0, default: 0, required: true },
	dailyRate: { type: Number, required: true },
	images: { type: [String], required: true },
});

// compound index for fast lookups by org+agency; index status separately
CarSchema.index({ organizationId: 1, agencyId: 1 });
CarSchema.index({ status: 1 });

const CarModel = model<CarDocument>('Car', CarSchema);

export default CarModel;
