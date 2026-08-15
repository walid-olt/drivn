import { type Agency } from '@drivn/shared';
import { Document, Schema, model, Types } from 'mongoose';

export interface AgencyDocument
	extends Omit<Agency, 'organizationId' | '_id' | 'operatingLocationIds'>, Document {
	organizationId: Types.ObjectId;
	operatingLocationIds: Types.ObjectId[];
}

const AgencySchema = new Schema<AgencyDocument>({
	organizationId: { type: Types.ObjectId, required: true, ref: 'Organization' },
	name: { type: String, required: true, unique: true, index: true },
	slug: { type: String, required: true, unique: true, index: true },
	logo: { type: String, required: false },
	banner: { type: String, required: false },
	summary: { type: String, required: false },
	supportEmail: { type: String, required: false },
	supportPhone: { type: String, required: false },
	address: {
		city: { type: String, required: false },
		country: { type: String, required: false },
		addressLine1: { type: String, required: false },
		zipCode: { type: String, required: false },
		required: false,
	},
	onboardingStatus: {
		type: String,
		enum: ['not_started', 'initial', 'branding', 'support', 'completed'],
		default: 'not_started',
		required: true,
	},
	operatingLocationIds: {
		type: [Types.ObjectId],
		ref: 'Location',
		default: [],
		required: true,
	},
});

// index to make agency lookup by organizationId and slug faster
AgencySchema.index({ organizationId: 1, slug: 1 }, { unique: true });
const AgencyModel = model<AgencyDocument>('Agency', AgencySchema);

export default AgencyModel;
