import { it, expect, describe } from 'vitest';
import mongoose from 'mongoose';
import { createApp } from '../../src/app';
import request from 'supertest';

/**
 * @description
 * This is the test suite for the organization authentication
 * implemented by better-auth. It tests the functionality of the organization authentication
 */

describe('[ORGANIZATION]', () => {
	const AUTH_BASE_URL = '/api/auth';

	const SIGN_UP_URL = `${AUTH_BASE_URL}/sign-up/email`;

	const SIGN_IN_URL = `${AUTH_BASE_URL}/sign-in/email`;

	const CREATE_ORG_URL = `${AUTH_BASE_URL}/organization/create`;

	const LIST_ORGS_URL = `${AUTH_BASE_URL}/organization/list`;

	const GET_FULL_ORG_URL = `${AUTH_BASE_URL}/organization/get-full-organization`;

	const SET_ACTIVE_ORG_URL = `${AUTH_BASE_URL}/organization/set-active`;

	const DELETE_ORG_URL = `${AUTH_BASE_URL}/organization/delete`;

	const INVITE_MEMBER_URL = `${AUTH_BASE_URL}/organization/invite-member`;

	const ACCEPT_INVITATION_URL = `${AUTH_BASE_URL}/organization/accept-invitation`;

	const LIST_MEMBERS_URL = `${AUTH_BASE_URL}/organization/list-members`;

	const UPDATE_MEMBER_ROLE_URL = `${AUTH_BASE_URL}/organization/update-member-role`;

	const REMOVE_MEMBER_URL = `${AUTH_BASE_URL}/organization/remove-member`;

	const LEAVE_ORG_URL = `${AUTH_BASE_URL}/organization/leave`;

	const app = () => createApp(mongoose.connection.db!);

	const signUp = async (_app: ReturnType<typeof app>, email: string) => {
		const credentais = {
			email,
			password: 'password123',
			name: 'Test User',
		};
		await request(_app).post(SIGN_UP_URL).send(credentais).expect(200);

		const signIn = await request(_app)
			.post(SIGN_IN_URL)
			.send({ ...credentais, name: undefined })
			.expect(200);
		return signIn.get('Set-Cookie') || [];
	};

	const createOrganization = async (
		_app: ReturnType<typeof app>,
		cookies: string[],
		{ name, slug }: { name: string; slug: string },
	) => {
		return request(_app)
			.post(CREATE_ORG_URL)
			.set('Cookie', cookies)
			.send({ name, slug })
			.expect(200);
	};

	describe('create organization', () => {
		it("should return 401 when the user isn't authenticated", async () => {
			await request(app()).post(CREATE_ORG_URL).send({ name: 'Acme', slug: 'acme' }).expect(401);
		});

		it("should return 400 when create data aren't valid", async () => {
			const _app = app();
			const cookies = await signUp(_app, 'owner@example.com');

			const response = await request(_app)
				.post(CREATE_ORG_URL)
				.set('Cookie', cookies)
				.send({})
				.expect(400);
			expect(response.body).toMatchObject({
				code: 'VALIDATION_ERROR',
			});
		});

		it('should create an organization and make the creator its owner', async () => {
			const _app = app();
			const cookies = await signUp(_app, 'owner@example.com');

			const response = await createOrganization(_app, cookies, {
				name: 'Acme',
				slug: 'acme',
			});
			expect(response.body).toMatchObject({
				name: 'Acme',
				slug: 'acme',
				members: [{ role: 'owner' }],
			});

			const stored = await mongoose.connection
				.db!.collection('organization')
				.findOne({ slug: 'acme' });
			expect(stored).not.toBeNull();
		});
	});

	describe('list organizations', () => {
		it("should return 401 when the user isn't authenticated", async () => {
			await request(app()).get(LIST_ORGS_URL).expect(401);
		});

		it('should list the organizations the user belongs to', async () => {
			const _app = app();
			const cookies = await signUp(_app, 'owner@example.com');
			await createOrganization(_app, cookies, { name: 'Acme', slug: 'acme' });
			await createOrganization(_app, cookies, {
				name: 'Globex',
				slug: 'globex',
			});

			const response = await request(_app).get(LIST_ORGS_URL).set('Cookie', cookies).expect(200);
			expect(response.body).toMatchObject([
				{ name: 'Acme', slug: 'acme' },
				{ name: 'Globex', slug: 'globex' },
			]);
		});
	});

	describe('get-full-organization', () => {
		it('should return the active organization with its members', async () => {
			const _app = app();
			const cookies = await signUp(_app, 'owner@example.com');
			await createOrganization(_app, cookies, { name: 'Acme', slug: 'acme' });

			const response = await request(_app).get(GET_FULL_ORG_URL).set('Cookie', cookies).expect(200);
			expect(response.body).toMatchObject({
				name: 'Acme',
				members: [{ role: 'owner' }],
			});
		});
	});

	describe('set-active-organization', () => {
		it('should switch the active organization', async () => {
			const _app = app();
			const cookies = await signUp(_app, 'owner@example.com');
			await createOrganization(_app, cookies, { name: 'Acme', slug: 'acme' });
			const globex = await createOrganization(_app, cookies, {
				name: 'Globex',
				slug: 'globex',
			});

			await request(_app)
				.post(SET_ACTIVE_ORG_URL)
				.set('Cookie', cookies)
				.send({ organizationId: globex.body.id })
				.expect(200);

			const response = await request(_app).get(GET_FULL_ORG_URL).set('Cookie', cookies).expect(200);
			expect(response.body.slug).toBe('globex');
		});
	});

	describe('invitations', () => {
		it('should invite a user and let them accept the invitation', async () => {
			const _app = app();
			const ownerCookies = await signUp(_app, 'owner@example.com');
			const memberCookies = await signUp(_app, 'member@example.com');
			const organization = await createOrganization(_app, ownerCookies, {
				name: 'Acme',
				slug: 'acme',
			});

			const invited = await request(_app)
				.post(INVITE_MEMBER_URL)
				.set('Cookie', ownerCookies)
				.send({
					organizationId: organization.body.id,
					email: 'member@example.com',
					role: 'member',
				})
				.expect(200);
			expect(invited.body).toMatchObject({
				email: 'member@example.com',
				role: 'member',
				status: 'pending',
			});

			await request(_app)
				.post(ACCEPT_INVITATION_URL)
				.set('Cookie', memberCookies)
				.send({ invitationId: invited.body.id })
				.expect(200);

			const members = await request(_app)
				.get(LIST_MEMBERS_URL)
				.set('Cookie', ownerCookies)
				.query({ organizationId: organization.body.id })
				.expect(200);
			expect(members.body.members).toMatchObject([{ role: 'owner' }, { role: 'member' }]);
		});
	});

	describe('members', () => {
		const setup = async () => {
			const _app = app();
			const ownerCookies = await signUp(_app, 'owner@example.com');
			const memberCookies = await signUp(_app, 'member@example.com');
			const organization = await createOrganization(_app, ownerCookies, {
				name: 'Acme',
				slug: 'acme',
			});

			const invited = await request(_app)
				.post(INVITE_MEMBER_URL)
				.set('Cookie', ownerCookies)
				.send({
					organizationId: organization.body.id,
					email: 'member@example.com',
					role: 'member',
				})
				.expect(200);
			await request(_app)
				.post(ACCEPT_INVITATION_URL)
				.set('Cookie', memberCookies)
				.send({ invitationId: invited.body.id })
				.expect(200);

			const members = await request(_app)
				.get(LIST_MEMBERS_URL)
				.set('Cookie', ownerCookies)
				.query({ organizationId: organization.body.id })
				.expect(200);
			const member = members.body.members.find(
				(m: { user?: { email?: string } }) => m.user?.email === 'member@example.com',
			);

			return {
				_app,
				ownerCookies,
				memberCookies,
				organizationId: organization.body.id,
				memberId: member.id,
			};
		};

		it('should update a member role', async () => {
			const { _app, ownerCookies, organizationId, memberId } = await setup();

			await request(_app)
				.post(UPDATE_MEMBER_ROLE_URL)
				.set('Cookie', ownerCookies)
				.send({ organizationId, memberId, role: 'admin' })
				.expect(200);

			const members = await request(_app)
				.get(LIST_MEMBERS_URL)
				.set('Cookie', ownerCookies)
				.query({ organizationId })
				.expect(200);
			expect(members.body.members).toMatchObject([{ role: 'owner' }, { role: 'admin' }]);
		});

		it('should remove a member from the organization', async () => {
			const { _app, ownerCookies, organizationId, memberId } = await setup();

			await request(_app)
				.post(REMOVE_MEMBER_URL)
				.set('Cookie', ownerCookies)
				.send({ organizationId, memberIdOrEmail: memberId })
				.expect(200);

			const members = await request(_app)
				.get(LIST_MEMBERS_URL)
				.set('Cookie', ownerCookies)
				.query({ organizationId })
				.expect(200);
			expect(members.body.members).toMatchObject([{ role: 'owner' }]);
		});

		it('should let a member leave the organization', async () => {
			const { _app, memberCookies, ownerCookies, organizationId } = await setup();

			await request(_app)
				.post(LEAVE_ORG_URL)
				.set('Cookie', memberCookies)
				.send({ organizationId })
				.expect(200);

			const members = await request(_app)
				.get(LIST_MEMBERS_URL)
				.set('Cookie', ownerCookies)
				.query({ organizationId })
				.expect(200);
			expect(members.body.members).toMatchObject([{ role: 'owner' }]);
		});
	});

	describe('delete organization', () => {
		it('should delete the organization', async () => {
			const _app = app();
			const cookies = await signUp(_app, 'owner@example.com');
			const organization = await createOrganization(_app, cookies, {
				name: 'Acme',
				slug: 'acme',
			});
			await request(_app)
				.post(DELETE_ORG_URL)
				.set('Cookie', cookies)
				.send({ organizationId: organization.body.id })
				.expect(200);

			const stored = await mongoose.connection
				.db!.collection('organization')
				.findOne({ slug: 'acme' });
			expect(stored).toBeNull();

			const response = await request(_app).get(LIST_ORGS_URL).set('Cookie', cookies).expect(200);
			expect(response.body).toEqual([]);
		});
	});
});
