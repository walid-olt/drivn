import { Heading, Text } from 'react-email';
import { EmailLayout, ActionButton, FallbackLink } from '../components/EmailLayout.tsx';

interface VerifyEmailProps {
	userName?: string;
	verificationUrl: string;
}

export const VerifyEmail = ({ userName, verificationUrl }: VerifyEmailProps) => {
	return (
		<EmailLayout
			preview="Confirm your email address"
			eyebrow="Drivn // Verify"
			note="If you didn't create a Drivn account, you can safely ignore this email."
		>
			<Heading className="m-0 text-[22px] font-bold leading-[30px] text-text">
				Confirm your email
			</Heading>
			<Text className="mt-[12px] mb-0 text-[15px] leading-[24px] text-muted">
				Hi {userName}, welcome to Drivn. Confirm this address and your account is ready to go.
			</Text>
			<ActionButton href={verificationUrl}>Confirm email</ActionButton>
			<FallbackLink href={verificationUrl} />
		</EmailLayout>
	);
};

VerifyEmail.PreviewProps = {
	username: 'alanturing',
	verificationUrl: new URL(
		`/verify-email?token=${9874298732}`,
		process.env.FRONTEND_URL || 'http://localhost:3000',
	).toString(),
};

export default VerifyEmail;
