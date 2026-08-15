import type { ReactNode } from 'react';
import {
	Body,
	Container,
	Head,
	Html,
	Img,
	Link,
	Preview,
	Row,
	Column,
	Section,
	Tailwind,
	Text,
} from 'react-email';
import emailConfig, { emailTokens } from '../tailwind-email.config.ts';

export const baseUrl = process.env.FRONTEND_URL ?? 'http://localhost:5000';
const appLogoUrl = `${baseUrl}/assets/Drivn-logo.svg`;

const { ink } = emailTokens.colors;

interface EmailLayoutProps {
	preview: string;
	/** Small odometer-style label above the heading, e.g. "Drivn // Verify". */
	eyebrow: string;
	/** Optional mono line rendered at the bottom of the footer. */
	note?: string;
	children: ReactNode;
}

/**
 * The Lane — Drivn's email chrome. An ink header band (the logo's pennant
 * black), dashed road-lane dividers, and mono odometer labels. Square corners
 * throughout echo the angular brand mark.
 */
export function EmailLayout({ preview, eyebrow, note, children }: EmailLayoutProps) {
	return (
		<Tailwind config={emailConfig}>
			<Html>
				<Head>
					<link rel="preconnect" href="https://fonts.googleapis.com" />
					<link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
					<link
						href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&family=Roboto+Mono:wght@400;500&display=swap"
						rel="stylesheet"
					/>
				</Head>
				<Body className="bg-surface px-[16px] py-[24px] font-sans">
					<Preview>{preview}</Preview>
					<Container className="max-w-[520px]">
						<Section className="bg-ink px-[28px] py-[18px]">
							<Row>
								<Column align="left">
									<Text className="m-0 font-mono text-[13px] font-medium uppercase tracking-[0.32em] text-white">
										Drivn
									</Text>
								</Column>
								<Column align="right">
									<span className="inline-block h-[8px] w-[8px] bg-white" />
								</Column>
							</Row>
						</Section>
						<LaneDivider />
						<Section className="bg-bg px-[32px] py-[36px]">
							<Text className="m-0 mb-[12px] font-mono text-[11px] uppercase tracking-[0.2em] text-muted">
								{eyebrow}
							</Text>
							{children}
						</Section>
						<LaneDivider />
						<Section className="bg-surface px-[32px] py-[20px]">
							<Row>
								<Column align="left">
									<Img src={appLogoUrl} width="75" height="22" alt="Drivn" />
								</Column>
								<Column align="right">
									<Text className="m-0 font-mono text-[11px] text-muted">Drivn · car rentals</Text>
								</Column>
							</Row>
							{note ? (
								<Text className="m-0 mt-[12px] font-mono text-[11px] leading-[18px] text-muted">
									{note}
								</Text>
							) : null}
						</Section>
					</Container>
				</Body>
			</Html>
		</Tailwind>
	);
}

/** Road lane marking — the signature divider. */
export function LaneDivider() {
	return <div className="h-0 border-t-2 border-dashed border-lane" />;
}

interface ActionButtonProps {
	href?: string;
	children: ReactNode;
}

/**
 * Bulletproof CTA. The table cell carries the ink background (Outlook honors
 * `background-color` on cells) while the anchor renders the visible button.
 */
export function ActionButton({ href, children }: ActionButtonProps) {
	return (
		<Section className="mt-[28px]">
			<table role="presentation" border={0} cellPadding={0} cellSpacing={0}>
				<tbody>
					<tr>
						<td align="center" style={{ borderRadius: 6, backgroundColor: ink }}>
							<a
								href={href}
								className="inline-block rounded-[6px] bg-ink px-[26px] py-[14px] font-sans text-[15px] font-semibold text-white no-underline"
							>
								{children}
							</a>
						</td>
					</tr>
				</tbody>
			</table>
		</Section>
	);
}

interface FallbackLinkProps {
	href?: string;
	label?: string;
}

/** Plain-language fallback for clients that strip buttons. */
export function FallbackLink({
	href,
	label = 'Button not working? Copy and paste this link into your browser:',
}: FallbackLinkProps) {
	return (
		<Section className="mt-[24px] pt-[16px]">
			<Text className="m-0 font-mono text-[12px] leading-[20px] text-muted">{label}</Text>
			{href ? (
				<Link
					href={href}
					className="mt-[4px] block font-mono text-[12px] leading-[20px] break-all text-brand no-underline"
				>
					{href}
				</Link>
			) : null}
		</Section>
	);
}
