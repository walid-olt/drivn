import { Suspense, type ComponentType, type ReactNode } from 'react';
import { QueryErrorResetBoundary } from '@tanstack/react-query';
import { ErrorBoundary, type FallbackProps } from 'react-error-boundary';
import { WarningIcon } from '@phosphor-icons/react';

import Loading from '@/components/ui/Loading';
import { Button } from '@/components/ui/button';
import { Typography } from '@/components/ui/typography';

export type AsyncErrorComponentProps = FallbackProps;

export type AsyncProps = {
	children: ReactNode;
	loadingMessage?: ReactNode;
	loadingIndicator?: ReactNode;
	loadingComponent?: ReactNode;
	errorComponent?: ComponentType<AsyncErrorComponentProps>;
};

const DefaultError = ({ error, resetErrorBoundary }: AsyncErrorComponentProps) => {
	const message = error instanceof Error ? error.message : 'An unexpected error occurred.';

	return (
		<div className="flex min-h-64 flex-col items-center justify-center gap-4 p-6 text-center">
			<WarningIcon className="size-8 text-destructive" weight="fill" />
			<div className="space-y-1">
				<Typography variant="h4">Something went wrong</Typography>
				<Typography variant="body">{message}</Typography>
			</div>
			<Button variant="outline" onClick={resetErrorBoundary}>
				Try again
			</Button>
		</div>
	);
};

function AsyncContainer({
	children,
	loadingMessage = 'Hold on a minute...',
	loadingIndicator,
	loadingComponent,
	errorComponent: ErrorComponent = DefaultError,
}: AsyncProps) {
	return (
		<QueryErrorResetBoundary>
			{({ reset }) => (
				<ErrorBoundary onReset={reset} FallbackComponent={ErrorComponent}>
					<Suspense
						fallback={
							loadingComponent ?? (
								<Loading
									message={loadingMessage}
									indicator={loadingIndicator}
									showIndicator={!loadingIndicator}
								/>
							)
						}
					>
						{children}
					</Suspense>
				</ErrorBoundary>
			)}
		</QueryErrorResetBoundary>
	);
}

export { AsyncContainer, DefaultError };
export default AsyncContainer;
