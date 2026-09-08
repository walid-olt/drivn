import { WarningCircleIcon } from '@phosphor-icons/react';

import { Typography } from '@/components/ui/typography';

type AuthFormMessageProps = {
	message?: string | null;
};

export function AuthFormMessage({ message }: AuthFormMessageProps) {
	if (!message) return null;

	return (
		<div
			role="alert"
			className="flex items-start gap-2.5 border border-destructive/25 bg-destructive/8 px-3 py-2.5 text-destructive"
		>
			<WarningCircleIcon className="mt-0.5 size-4 shrink-0" weight="fill" />
			<Typography variant="caption" className="text-current">
				{message}
			</Typography>
		</div>
	);
}

export function getAuthErrorMessage(error: unknown, fallback: string) {
	if (error instanceof Error && error.message) return error.message;
	if (typeof error === 'object' && error !== null && 'message' in error) {
		const message = error.message;
		if (typeof message === 'string' && message) return message;
	}
	return fallback;
}
