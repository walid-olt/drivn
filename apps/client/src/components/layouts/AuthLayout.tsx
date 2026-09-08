import type { ComponentProps } from 'react';

import { cn } from '@/lib/utils';

/**
 * @description
 * Full-screen centered shell used by the standalone auth pages.
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
				<img src="/Drivn-logo.svg" alt="Drivn logo" className="max-h-9" />
			</a>
			<div className="w-full max-w-md bg-card p-6 shadow-sm ring-1 ring-foreground/10 sm:p-8">
				{children}
			</div>
		</div>
	);
}

export default AuthLayout;
