import type {
	IEmailProvider,
	VerificationEmailParams,
	EmailResponse,
	OrganizationInviteParams,
} from '../../types/email';

export interface SentEmailRecord {
	type: string;
	params: any;
	messageId?: string;
}

export class TestingEmailProvider implements IEmailProvider {
	public sent: SentEmailRecord[] = [];

	private record(type: string, params: any): EmailResponse {
		const messageId = `test-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
		this.sent.push({ type, params, messageId });
		return { success: true, messageId };
	}

	async sendVerificationEmail(params: VerificationEmailParams): Promise<EmailResponse> {
		return this.record('verification', params);
	}

	async sendOrganizationInviteEmail(params: OrganizationInviteParams): Promise<EmailResponse> {
		return this.record('orgInvite', params);
	}

	async sendRawEmail(
		to: string,
		subject: string,
		html: string,
		text?: string,
	): Promise<EmailResponse> {
		return this.record('raw', { to, subject, html, text });
	}

	public clear() {
		this.sent.length = 0;
	}
}
