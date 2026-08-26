import { APIError, betterAuth } from 'better-auth';
import { createAuthMiddleware } from 'better-auth/api';
import { organization } from 'better-auth/plugins/organization';
import { mongodbAdapter } from 'better-auth/adapters/mongodb';
import { mongo, Types, type Document } from 'mongoose';
import { ResendProvider } from './providers/resend';
import { TestingEmailProvider } from './providers/testing';
import { BackgroundEmailService } from './services/BackgroundEmailService';
import type { BaseUser } from 'better-auth';
import type { AgencyDocument } from '../modules/agency/agency.model';
import { z } from 'zod';
import agencyService from '../modules/agency/agency.service';

let authInstance: ReturnType<typeof initializeAuthInstance> | null = null;

export function getAuth() {
	if (!authInstance) {
		throw new Error('Auth instance not initialized. Call initAuth first.');
	}
	return authInstance;
}
export function initializeAuthInstance(db: mongo.Db) {
	const useTesting = process.env.NODE_ENV === 'test';
	const provider = useTesting
		? new TestingEmailProvider()
		: new ResendProvider(process.env.RESEND_API_KEY ?? '');
	const emailService = new BackgroundEmailService(provider);
	const auth = betterAuth({
		baseURL: process.env.BACKEND_URL,
		trustedOrigins: [process.env.FRONTEND_URL!],
		database: mongodbAdapter(db),
		user: {
			additionalFields: {
				type: {
					type: 'string',
					required: true,
					fieldName: 'type',
					validator: {
						input: z.enum(['customer', 'agency_member']),
						output: z.enum(['customer', 'agency_member']),
					},
				},
			},
		},
		hooks: {
			before: createAuthMiddleware(async (ctx) => {
				if (ctx.path !== '/sign-up/email') return;
				const body = (ctx.body ?? {}) as Record<string, unknown>;
				// `type` is a required user additionalField; honor an explicit one, default to customer
				const type =
					body.type === 'agency_member' || body.type === 'customer' ? body.type : 'customer';
				return {
					context: {
						...ctx,
						body: { ...body, type },
					},
				};
			}),
		},
		emailVerification: {
			sendOnSignUp: false, // We will send the email manually after sign-up
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
					if (useTesting) return;
					const {
						invitation: { id: invitationId },
						organization: { name: organizationName, id: orgId },
						inviter: { user: inviter },
						email: inviteeEmail,
					} = data;

					//TODO: use the agencyService to get the agency by orgId instead of querying the db directly
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
				organizationHooks: {
					async beforeCreateOrganization({ organization, user }) {
						//TODO: query the db check if a user has already created an organization, if so throw an error
					},
				},
			}),
		],
	});
	authInstance = auth;
	return auth;
}
// it's either this or duplicating the type declaration
export type User = ReturnType<typeof getAuth>['$Infer']['Session']['user'];
