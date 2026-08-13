import { Resend } from 'resend';
import type {
	IEmailProvider,
	VerificationEmailParams,
	EmailResponse,
	PasswordResetEmailParams,
	PasswordChangeNotificationParams,
	OrganizationInviteParams,
	OrganizationRoleChangeParams,
} from '../../types/email';

export class ResendProvider implements IEmailProvider {
	private resend: Resend;
	private fromEmail = 'noreply@yourdomain.com';

	constructor(apiKey: string) {
		this.resend = new Resend(apiKey);
	}

	private async sendSimpleEmail(to: string, subject: string, html: string, _text?: string): Promise<EmailResponse> {
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
		const html = `<p>Please verify your email by clicking <a href="${params.verificationUrl}">here</a>.</p>`;
		return this.sendSimpleEmail(params.to, 'Verify your email address', html);
	}

	async sendPasswordResetEmail(params: PasswordResetEmailParams): Promise<EmailResponse> {
		const expiresText = params.expiresInHours ? `${params.expiresInHours} hour(s)` : '1 hour';
		const html = `<p>A password reset was requested for your account. Click <a href="${params.resetUrl}">here</a> to reset your password. This link expires in ${expiresText}.</p>` +
			(params.ipAddress ? `<p>Request originated from IP: ${params.ipAddress}</p>` : '');
		return this.sendSimpleEmail(params.to, 'Reset your password', html);
	}

	async sendPasswordChangeNotification(params: PasswordChangeNotificationParams): Promise<EmailResponse> {
		const changedAt = params.changedAt instanceof Date ? params.changedAt.toUTCString() : String(params.changedAt);
		const html = `<p>Your account password was changed on ${changedAt}.</p>` +
			(params.ipAddress ? `<p>IP: ${params.ipAddress}</p>` : '');
		return this.sendSimpleEmail(params.to, 'Your password was changed', html);
	}

	async sendOrganizationInviteEmail(params: OrganizationInviteParams): Promise<EmailResponse> {
		const roleText = params.role ? ` as ${params.role}` : '';
		const html = `<p>${params.inviterName} invited you to join ${params.organizationName}${roleText}. Click <a href="${params.inviteUrl}">here</a> to accept the invitation.</p>`;
		return this.sendSimpleEmail(params.to, `Invitation to join ${params.organizationName}`, html);
	}

	async sendOrganizationRoleChangeNotification(params: OrganizationRoleChangeParams): Promise<EmailResponse> {
		const html = `<p>Your role in ${params.organizationName} was changed to <strong>${params.newRole}</strong>.</p>`;
		return this.sendSimpleEmail(params.to, `Your role in ${params.organizationName} changed`, html);
	}

	async sendRawEmail(to: string, subject: string, html: string, text?: string): Promise<EmailResponse> {
		return this.sendSimpleEmail(to, subject, html, text);
	}
}
