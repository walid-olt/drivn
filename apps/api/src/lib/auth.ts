import { APIError, betterAuth } from 'better-auth';
import { createAuthMiddleware } from 'better-auth/api';
import { organization } from 'better-auth/plugins/organization';
import { mongodbAdapter } from 'better-auth/adapters/mongodb';
import { mongo, Types, type Document } from 'mongoose';
import { ResendProvider } from './providers/resend';
import { TestingEmailProvider } from './providers/testing';
import { BackgroundEmailService } from './services/BackgroundEmailService';
import type { BaseUser } from 'better-auth';
import { z } from 'zod';
import agencyService from '../modules/agency/agency.service';
import { internalServerError } from '../errors';
import { tryCatch } from './result';

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
		database: mongodbAdapter(db, {
			usePlural: true,
		}),
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
			sendOnSignUp: false, // We will allow the user to request email verification manually after sign-up
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

					const userColl = db.collection<Document<BaseUser>>('users');

					const existingUser = await userColl.findOne<BaseUser>({
						emai: inviteeEmail,
					});

					if (!existingUser) throw new APIError('NOT_FOUND', { message: 'User not found' });

					const [err, agency] = await agencyService.getByOrganizationId(orgId);
					if (err || !agency) throw internalServerError("Couldn't get Agency");

					const inviteeName = existingUser.name || '';
					const agencyName = agency.name || organizationName;
					const agencyLogo = agency.logo;

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
					async afterCreateOrganization({ organization }) {
						//HACK: create agency and link to organization, delete organization if agency creation fails
						const { id: organizationId, name, slug } = organization;
						const [err, agency] = await agencyService.create({
							name,
							slug,
							onboardingStatus: 'not_started',
							operatingLocationIds: [],
							organizationId,
						});
						if (err || !agency) {
							const deleteOrg = db.collection('organizations').findOneAndDelete({
								_id: new Types.ObjectId(organizationId),
							});
							const [err, organization] = await tryCatch(deleteOrg);
							if (err || !organization)
								throw internalServerError(
									"Couldn't delete organization after agency creation failed",
								);

							throw internalServerError("Couldn't create agency for organization");
						}
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
export type AuthSession = ReturnType<typeof getAuth>['$Infer']['Session']['session'];
