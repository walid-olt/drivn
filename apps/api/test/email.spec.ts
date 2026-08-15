import { describe, it, expect, beforeEach } from 'vitest';
import { TestingEmailProvider } from '../src/lib/providers/testing';
import { BackgroundEmailService, EmailEvent } from '../src/lib/services/BackgroundEmailService';

describe('BackgroundEmailService with TestingEmailProvider', () => {
	let provider: TestingEmailProvider;
	let service: BackgroundEmailService;

	beforeEach(() => {
		provider = new TestingEmailProvider();
		service = new BackgroundEmailService(provider);
		provider.clear();
	});

	it('sends verification email on VERIFICATION event', async () => {
		service.emit(EmailEvent.VERIFICATION, {
			to: 'user@example.com',
			verificationUrl: 'https://example.com/verify',
		});

		// give the event loop a moment for the async handler to run
		await new Promise((r) => setTimeout(r, 20));

		expect(provider.sent.length).toBe(1);
		expect(provider.sent[0].type).toBe('verification');
		expect(provider.sent[0].params.to).toBe('user@example.com');
	});

	it('sends organization invite on ORG_INVITE event', async () => {
		service.emit(EmailEvent.ORG_INVITE, {
			inviteeEmail: 'invitee@example.com',
			inviteeName: 'Invitee',
			inviterName: 'Admin',
			inviterEmail: 'admin@example.com',
			agencyName: 'Sample Agency',
			agencyLogo: undefined,
			inviteLink: 'https://example.com/accept',
		});

		await new Promise((r) => setTimeout(r, 20));

		expect(provider.sent.length).toBe(1);
		expect(provider.sent[0].type).toBe('orgInvite');
		expect(provider.sent[0].params.inviteeEmail).toBe('invitee@example.com');
	});

	it('supports sendRawEmail', async () => {
		const raw = await provider.sendRawEmail('raw@example.com', 'subj', '<p>hi</p>', 'hi');
		expect(raw.success).toBe(true);
		expect(provider.sent.length).toBe(1);
		expect(provider.sent[0].type).toBe('raw');
	});
});
