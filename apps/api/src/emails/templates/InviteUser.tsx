import { Column, Heading, Img, Row, Text } from 'react-email';
import { ActionButton, baseUrl, EmailLayout, FallbackLink } from '../components/EmailLayout.tsx';

interface InviteUserProps {
	inviteeName: string;
	inviterName: string;
	inviterEmail: string;
	agencyName: string;
	agencyLogo?: string;
	inviteLink: string;
}

export const AgencyInviteEmail = ({
	inviteeName,
	inviterName,
	inviterEmail,
	agencyName,
	agencyLogo,
	inviteLink,
}: InviteUserProps) => {
	const footerNote = inviterEmail
		? `Questions? Reply to ${inviterEmail}.`
		: "Didn't expect this invitation? You can safely ignore this email.";

	return (
		<EmailLayout
			preview={`You're invited to join ${agencyName ?? 'a team'} on Drivn`}
			eyebrow="Drivn // Team Invite"
			note={footerNote}
		>
			<Heading className="m-0 text-[22px] font-bold leading-[30px] text-text">
				{agencyName ? `You're invited to join ${agencyName}` : 'You have an invitation'}
			</Heading>

			<Row className="mt-[20px]">
				<Column>
					{agencyLogo ? (
						<Img
							src={agencyLogo}
							alt={`${agencyName ?? 'Agency'} logo`}
							width={220}
							style={{ height: 'auto' }}
						/>
					) : (
						<span className="inline-block h-[44px] w-[44px] bg-ink text-center font-mono text-[18px] font-semibold leading-[44px] text-white">
							{agencyName?.charAt(0).toUpperCase() ?? 'D'}
						</span>
					)}
					<Text className="mt-[8px] mb-0 text-[15px] font-semibold text-text">{agencyName}</Text>
					<Text className="m-0 font-mono text-[12px] text-muted">
						Invited by {inviterName ?? 'a team member'}
					</Text>
				</Column>
			</Row>

			<Text className="mt-[16px] mb-0 text-[15px] leading-[24px] text-muted">
				Hi {inviteeName ?? 'there'}, accept the invitation below to set up your account and get
				started.
			</Text>

			<ActionButton href={inviteLink}>Accept invitation</ActionButton>
			<FallbackLink href={inviteLink} />
		</EmailLayout>
	);
};

AgencyInviteEmail.PreviewProps = {
	inviteeName: 'Jane Doe',
	inviterName: 'John Doe',
	inviterEmail: 'John@example.com',
	agencyName: 'Hertz',
	agencyLogo: 'https://www.hertz.com/content/dam/hertz/global/hertz-logo-black.png',
	inviteLink: baseUrl,
} as InviteUserProps;

export default AgencyInviteEmail;
