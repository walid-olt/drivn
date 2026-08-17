import { type UserProfile } from '@drivn/shared';
import { Document, Schema, model, Types } from 'mongoose';

interface ProfileDocument extends Omit<UserProfile, '_id' | 'userId'>, Document {
	userId: Types.ObjectId;
}

const ProfileSchema = new Schema<ProfileDocument>({
	userId: { type: Types.ObjectId, required: true, unique: true, ref: 'User' },
	birthDate: { type: Date, required: true },
	phone: { type: String, required: true },
	country: { type: String, required: true },
});

const ProfileModel = model<ProfileDocument>('Profile', ProfileSchema);

export default ProfileModel;
