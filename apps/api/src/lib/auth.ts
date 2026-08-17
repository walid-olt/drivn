import { APIError, betterAuth } from 'better-auth';
import { organization } from 'better-auth/plugins/organization';
import { mongodbAdapter } from 'better-auth/adapters/mongodb';
import { mongo, Types, type Document } from 'mongoose';
import { ResendProvider } from './providers/resend';
import { TestingEmailProvider } from './providers/testing';
import { BackgroundEmailService } from './services/BackgroundEmailService';
import type { BaseUser } from 'better-auth';
import type { AgencyDocument } from '../modules/agency/models/agency.model';

export const auth = (db: mongo.Db) => {
	const useTesting = process.env.NODE_ENV === 'test' || process.env.EMAIL_PROVIDER === 'testing';
	const provider = useTesting
		? new TestingEmailProvider()
		: new ResendProvider(process.env.RESEND_API_KEY ?? '');
	const emailService = new BackgroundEmailService(provider);
	return betterAuth({
		baseURL: process.env.BACKEND_URL,
		trustedOrigins: [process.env.FRONTEND_URL!],
		database: mongodbAdapter(db),
		emailVerification: {
			sendOnSignUp: true,
			sendVerificationEmail: async (data) => {
				emailService.emit('verification', {
					verificationUrl: new URL(
						`/verify-email?token=${data.token}`,
						process.env.FRONTEND_URL,
					).toString(),
					userName: data.user.name || data.user.email,
					to: data.user.email,
				});
			},
		},
		emailAndPassword: {
			enabled: true,
			maxPasswordLength: 255,
			minPasswordLength: 8,
			// In tests or development we disable required email verification to allow immediate sign-in
			requireEmailVerification:
				process.env.NODE_ENV === 'test' || process.env.NODE_ENV === 'development' ? false : true,
		},
		plugins: [
			organization({
				sendInvitationEmail: async (data) => {
					const {
						invitation: { id: invitationId },
						organization: { name: organizationName, id: orgId },
						inviter: { user: inviter },
						email: inviteeEmail,
					} = data;

					const userColl = db.collection<Document<BaseUser>>('users');
					const agencyColl = db.collection<AgencyDocument>('agencies');

					// Run both DB queries concurrently
					const [existingUser, agency] = await Promise.all([
						userColl.findOne<BaseUser>({ emai: inviteeEmail }),
						agencyColl.findOne({ organizationId: new Types.ObjectId(orgId) }),
					]);

					if (!existingUser) throw new APIError('NOT_FOUND', { message: 'User not found' });
					if (!agency) throw new APIError('NOT_FOUND', { message: 'Agency not found' });

					const inviteeName = existingUser.name || '';
					const agencyName = agency.name || organizationName;
					const agencyLogo = agency.logo || '';

					// Construct invitation URL
					const inviteLink = new URL(
						`/accept-invitation/${invitationId}`,
						process.env.FRONTEND_URL,
					).toString();

					emailService.emit('orgInvite', {
						inviteLink,
						inviterName: inviter.name,
						inviterEmail: inviter.email,
						agencyName,
						agencyLogo,
						inviteeEmail,
						inviteeName,
					});
				},
			}),
		],
	});
};
