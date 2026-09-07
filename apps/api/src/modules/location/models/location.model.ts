import { type Location } from '@drivn/shared';
import { Document, Schema, model } from 'mongoose';

export interface LocationDocument extends Omit<Location, '_id'>, Document {}

const LocationSchema = new Schema<LocationDocument>({
	name: { type: String, required: true, index: true },
	address: { type: String, required: true },
	country: { type: String, required: true },
	city: { type: String, required: true },
	postalCode: { type: String, required: false },
	type: {
		type: String,
		enum: ['office', 'airport', 'hotel', 'train_station', 'port', 'other'],
		required: true,
	},
});

LocationSchema.index({ country: 1, city: 1 });
LocationSchema.index({ type: 1 });
LocationSchema.index({ name: 'text' });

const LocationModel = model<LocationDocument>('Location', LocationSchema);

export default LocationModel;
