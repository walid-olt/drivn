import { Html, Head, Body, Container, Preview, Heading, Text, Button, Link } from 'react-email';

interface VerifyEmailProps {
	username?: string;
	verificationUrl: string;
}

export const VerifyEmail = ({ username = 'there', verificationUrl }: VerifyEmailProps) => {
	const preview = 'Verify your email address';
	return (
		<Html>
			<Head />
			<Body className="mx-auto my-auto bg-white px-2 font-sans">
				<Preview>{preview}</Preview>
				<Container className="mx-auto my-[40px] max-w-[465px] rounded border border-[#eaeaea] p-[20px]">
					<Heading className="text-center text-[20px] font-normal">Verify your email</Heading>
					<Text className="text-[14px]">Hello {username},</Text>
					<Text className="text-[14px]">Please confirm your email address by clicking the button below.</Text>
					<div className="my-[20px] text-center">
						<Button className="rounded bg-[#000000] px-5 py-3 text-white no-underline" href={verificationUrl}>
							Verify email
						</Button>
					</div>
					<Text className="text-[12px] text-[#666]">If the button doesn't work, copy and paste this URL into your browser:</Text>
					<Link href={verificationUrl}>{verificationUrl}</Link>
				</Container>
			</Body>
		</Html>
	);
};

VerifyEmail.PreviewProps = {
	username: 'alanturing',
	verificationUrl: 'https://example.com/verify?token=xxx',
};

export default VerifyEmail;
