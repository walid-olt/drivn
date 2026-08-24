import { type CustomerProfile } from '@drivn/shared';
import { Document, Schema, model, Types } from 'mongoose';

interface ProfileDocument extends Omit<CustomerProfile, '_id' | 'userId'>, Document {
	userId: Types.ObjectId;
}

const ProfileSchema = new Schema<ProfileDocument>({
	userId: { type: Types.ObjectId, required: true, unique: true, ref: 'User' },
	firstName: { type: String, required: true },
	lastName: { type: String, required: true },
	birthDate: { type: Date, required: true },
	phone: { type: String, required: true },
	country: { type: String, required: true },
});

const ProfileModel = model<ProfileDocument>('Profile', ProfileSchema);

export default ProfileModel;
