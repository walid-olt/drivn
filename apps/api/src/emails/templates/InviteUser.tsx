import { Html, Head, Body, Container, Preview, Heading, Text, Button, Link, Img } from 'react-email';

interface InviteUserProps {
	inviteeName?: string;
	inviterName?: string;
	inviterEmail?: string;
	agencyName?: string;
	agencyLogo?: string;
	inviteLink?: string;
}

const baseUrl = process.env.FRONTEND_URL ?? '';

export const AgencyInviteEmail = ({
	inviteeName = 'there',
	inviterName = 'an agency admin',
	inviterEmail,
	agencyName = 'your agency',
	agencyLogo,
	inviteLink = baseUrl,
}: InviteUserProps) => {
	const preview = `Invitation to join ${agencyName}`;
	const appLogo = `${baseUrl}/static/app-logo.png`;
	const agencyLogoSrc = agencyLogo ?? `${baseUrl}/static/agency-logo.png`;

	return (
		<Html>
			<Head />
			<Body className="mx-auto my-auto bg-white px-2 font-sans">
				<Preview>{preview}</Preview>
				<Container className="mx-auto my-[40px] max-w-[600px] rounded border border-[#eaeaea] p-[20px]">
					<div className="flex items-center justify-center gap-4 mb-4">
						<Img src={appLogo} width="48" height="48" alt="App logo" />
						<Heading className="m-0 text-[20px] font-medium">{agencyName} — Invitation</Heading>
					</div>

					<Text className="text-[14px]">Hello {inviteeName},</Text>
					<Text className="text-[14px] mb-4">
						{inviterName} {inviterEmail ? `(${inviterEmail}) ` : ''}has invited you to join <strong>{agencyName}</strong> as a member of their team.
					</Text>

					<div className="flex items-center justify-center gap-4 my-4">
						<Img src={agencyLogoSrc} width="64" height="64" alt={`${agencyName} logo`} className="rounded-full" />
					</div>

					<div className="text-center my-6">
						<Button className="rounded bg-[#000000] px-5 py-3 text-white no-underline" href={inviteLink}>
							Accept Invitation
						</Button>
					</div>

					<Text className="text-[14px]">Or copy and paste this link into your browser:</Text>
					<Link href={inviteLink}>{inviteLink}</Link>

					<Text className="text-[12px] text-[#666] mt-6">
						If you did not expect this invitation, you can ignore this email. For questions, reply to {inviterEmail ?? 'the sender'}.
					</Text>
				</Container>
			</Body>
		</Html>
	);
};

AgencyInviteEmail.PreviewProps = {
	inviteeName: 'janedoe',
	inviterName: 'Agency Admin',
	inviterEmail: 'admin@example.com',
	agencyName: 'Sample Agency',
	agencyLogo: undefined,
	inviteLink: process.env.FRONTEND_URL ?? 'https://example.com',
} as InviteUserProps;

export default AgencyInviteEmail;

