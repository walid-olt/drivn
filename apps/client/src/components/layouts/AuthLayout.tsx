import type { ComponentProps } from 'react';

import { cn } from '@/lib/utils';

/**
 * @description
 * Full-screen centered shell used by the standalone auth pages
 * (login, signup, email verification). Keeps the branding at the top
 * and wraps the page content in a single card.
 */
function AuthLayout({ className, children, ...props }: ComponentProps<'div'>) {
	return (
		<div
			className={cn(
				'flex min-h-dvh flex-col items-center justify-center gap-8 bg-muted/50 px-4 py-10 dark:bg-background',
				className,
			)}
			{...props}
		>
			<a href="/" aria-label="Drivn home">
				<img src="/Drivn-logo.svg" alt="Drivn logo" className="max-h-9 dark:invert" />
			</a>
			<div className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8">
				{children}
			</div>
		</div>
	);
}

export default AuthLayout;
