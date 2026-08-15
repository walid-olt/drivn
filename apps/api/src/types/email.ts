/**
 * @description
 * Abstract email sending interfaces that map directly to better-auth's auth flows.
 *
 * Should be implemented by any email provider (Resend, Nodemailer, SendGrid)
 * to ensure consistent email sending across the application.
 */
export interface EmailResponse {
	success: boolean;
	messageId?: string;
	error?: Error | string;
}

export interface VerificationEmailParams {
	to: string;
	userName?: string;
	verificationUrl: string;
	expiresInHours?: number;
}

export interface OrganizationInviteParams {
	inviteeEmail: string;
	inviteeName: string;
	inviterName: string;
	inviterEmail: string;
	agencyName: string;
	agencyLogo?: string;
	inviteLink: string;
}

export interface IEmailProvider {
	/**
	 * Sent when a user registers with email/password to verify their address.
	 */
	sendVerificationEmail(params: VerificationEmailParams): Promise<EmailResponse>;

	sendOrganizationInviteEmail(params: OrganizationInviteParams): Promise<EmailResponse>;

	/**
	 * A generic fallback for sending custom text/HTML emails if needed
	 * outside the standard auth flows.
	 */
	sendRawEmail?(to: string, subject: string, html: string, text?: string): Promise<EmailResponse>;
}
