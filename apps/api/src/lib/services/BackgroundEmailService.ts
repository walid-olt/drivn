import { EventEmitter } from 'events';
import type {
	IEmailProvider,
	VerificationEmailParams,
	OrganizationInviteParams,
} from '../../types/email';

export const EmailEvent = {
	VERIFICATION: 'verification',
	ORG_INVITE: 'orgInvite',
} as const;
export interface EmailEventPayloads {
	[EmailEvent.VERIFICATION]: VerificationEmailParams;
	[EmailEvent.ORG_INVITE]: OrganizationInviteParams;
}

export class BackgroundEmailService {
	private emitter: EventEmitter;
	private provider: IEmailProvider;

	constructor(provider: IEmailProvider) {
		this.provider = provider;
		this.emitter = new EventEmitter();

		this.registerHandlers();
	}

	/**
	 * Strongly typed emit method.
	 */
	public emit<K extends keyof EmailEventPayloads>(event: K, payload: EmailEventPayloads[K]): void {
		// Fire and forget
		this.emitter.emit(event, payload);
	}

	/**
	 * Internal listeners that actually interact with the 3rd party provider.
	 */
	private registerHandlers(): void {
		this.emitter.on(EmailEvent.VERIFICATION, async (payload: VerificationEmailParams) => {
			await this.safeExecute('Verification', () => this.provider.sendVerificationEmail(payload));
		});

		this.emitter.on(EmailEvent.ORG_INVITE, async (payload: OrganizationInviteParams) => {
			await this.safeExecute('Org Invite', () =>
				this.provider.sendOrganizationInviteEmail(payload),
			);
		});
	}

	/**
	 * Wrapper to prevent unhandled promise rejections from crashing the process.
	 * Event emitters swallow errors if not explicitly caught.
	 */
	private async safeExecute(context: string, fn: () => Promise<any>): Promise<void> {
		try {
			const result = await fn();
			if (result && result.success === false) {
				console.error(`[EmailService: ${context}] Provider reported failure:`, result.error);
			}
		} catch (error) {
			console.error(`[EmailService: ${context}] Unhandled exception:`, error);
		}
	}
}
