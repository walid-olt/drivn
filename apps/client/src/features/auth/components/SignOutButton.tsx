import { Button } from '@/components/ui/button';
import { SignOutIcon } from '@phosphor-icons/react';
import authClient from '@/lib/auth-client';
import queryClient from '@/lib/query-client';
import { useNavigate } from 'react-router';
import { toast } from '@/components/ui/toast';
import { cn } from '@/lib/utils';

export default function SignOutButton({ className }: { className?: string }) {
	const navigate = useNavigate();

	async function handleSignOut() {
		const { error } = await authClient.signOut();
		if (error) {
			toast.add({ type: 'error', title: 'Unable to sign out.' });
			return;
		}
		queryClient.clear();
		navigate('/login');
	}

	return (
		<Button variant="ghost" onClick={handleSignOut} className={cn('w-full', className)}>
			<SignOutIcon data-icon="inline-start" />
			Sign out
		</Button>
	);
}
