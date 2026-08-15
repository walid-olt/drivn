import { VerifyEmail } from '../../emails/templates/VerifyEmail.tsx';
import { AgencyInviteEmail } from '../../emails/templates/InviteUser.tsx';
import { render } from 'react-email';

import { Resend } from 'resend';
import type {
	IEmailProvider,
	VerificationEmailParams,
	EmailResponse,
	OrganizationInviteParams,
} from '../../types/email';

export class ResendProvider implements IEmailProvider {
	private resend: Resend;
	private fromEmail = 'noreply@drivn.walid0.dev';

	constructor(apiKey: string) {
		this.resend = new Resend(apiKey);
	}

	private async sendSimpleEmail(
		to: string,
		subject: string,
		html: string,
		_text?: string,
	): Promise<EmailResponse> {
		try {
			const { data, error } = await this.resend.emails.send({
				from: this.fromEmail,
				to,
				subject,
				html,
			});

			if (error) throw error;

			return { success: true, messageId: data?.id };
		} catch (error: any) {
			console.error(`Failed to send email "${subject}" to ${to}`, error);
			return { success: false, error: error?.message ?? String(error) };
		}
	}

	async sendVerificationEmail(params: VerificationEmailParams): Promise<EmailResponse> {
		const { verificationUrl, userName } = params;
		const html = await render(VerifyEmail({ verificationUrl, userName }));
		return this.sendSimpleEmail(params.to, 'Verify your email address', html);
	}

	async sendOrganizationInviteEmail(params: OrganizationInviteParams): Promise<EmailResponse> {
		const html = await render(AgencyInviteEmail({ ...params }));
		return this.sendSimpleEmail(
			params.inviteeEmail,
			`Invitation to join ${params.agencyName}`,
			html,
		);
	}

	async sendRawEmail(
		to: string,
		subject: string,
		html: string,
		text?: string,
	): Promise<EmailResponse> {
		return this.sendSimpleEmail(to, subject, html, text);
	}
}
