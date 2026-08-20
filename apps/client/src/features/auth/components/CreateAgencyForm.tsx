import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Typography } from '@/components/ui/typography';
import { toast } from '@/components/ui/toast';
import authClient from '@/lib/auth-client';
import queryClient from '@/lib/query-client';
import { zodResolver } from '@hookform/resolvers/zod';
import { SpinnerIcon } from '@phosphor-icons/react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router';
import { z } from 'zod';

const createAgencySchema = z.object({
	name: z.string().min(3).max(100),
	slug: z
		.string()
		.min(3)
		.max(100)
		.regex(
			/^[a-z0-9]+(?:-[a-z0-9]+)*$/,
			'Slug must contain only lowercase letters, numbers, and hyphens',
		),
});

type CreateAgencyFormData = z.infer<typeof createAgencySchema>;

function slugify(value: string) {
	return value
		.toLowerCase()
		.trim()
		.replace(/[^a-z0-9\s-]/g, '')
		.replace(/\s+/g, '-')
		.replace(/-+/g, '-');
}

export default function CreateAgencyForm() {
	const navigate = useNavigate();
	const {
		register,
		handleSubmit,
		setValue,
		formState: { errors, isSubmitting },
	} = useForm<CreateAgencyFormData>({
		resolver: zodResolver(createAgencySchema),
	});

	function onNameChange(e: React.ChangeEvent<HTMLInputElement>) {
		const name = e.target.value;
		setValue('name', name);
		setValue('slug', slugify(name));
	}

	async function onSubmit(data: CreateAgencyFormData) {
		const { data: org, error } = await authClient.organization.create({
			name: data.name,
			slug: data.slug,
		});

		if (error) {
			toast.add({
				type: 'error',
				title: error.message ?? 'Unable to create agency.',
			});
			return;
		}

		const { data: session } = await authClient.getSession();
		await Promise.all([
			queryClient.invalidateQueries({ queryKey: ['session'] }),
			queryClient.invalidateQueries({
				queryKey: [session?.user.id, 'organizations'],
			}),
		]);
		toast.add({ type: 'success', title: `Agency "${org?.name}" created.` });
		navigate('/agency');
	}

	return (
		<form onSubmit={handleSubmit(onSubmit)} className="mx-auto flex w-full max-w-md flex-col gap-3">
			<Typography variant="h2">Create your agency</Typography>
			<Typography variant="h3">
				Set up your agency to start managing cars and reservations.
			</Typography>

			<Input type="text" placeholder="Agency name" {...register('name')} onChange={onNameChange} />
			{errors.name && <span>{errors.name.message}</span>}

			<Input type="text" placeholder="agency-slug" {...register('slug')} />
			{errors.slug && <span>{errors.slug.message}</span>}

			<Button type="submit" disabled={isSubmitting}>
				{isSubmitting ? <SpinnerIcon className="animate-spin" /> : 'Create agency'}
			</Button>
		</form>
	);
}
