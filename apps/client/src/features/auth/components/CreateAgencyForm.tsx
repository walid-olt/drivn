import { SpinnerIcon } from '@phosphor-icons/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useState, type ChangeEvent } from 'react';
import { useNavigate } from 'react-router';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Field, FieldDescription, FieldError, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Typography } from '@/components/ui/typography';
import authClient from '@/lib/auth-client';
import queryClient from '@/lib/query-client';
import { AuthFormMessage, getAuthErrorMessage } from './AuthFormMessage';

const createAgencySchema = z.object({
	name: z
		.string({ error: 'Enter your agency name.' })
		.trim()
		.min(3, 'Agency name must be at least 3 characters.')
		.max(100, 'Agency name must be 100 characters or fewer.'),
	slug: z
		.string({ error: 'Enter an agency URL slug.' })
		.min(3, 'Slug must be at least 3 characters.')
		.max(100, 'Slug must be 100 characters or fewer.')
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
	const [submitError, setSubmitError] = useState<string | null>(null);

	function onNameChange(e: ChangeEvent<HTMLInputElement>) {
		const name = e.target.value;
		setValue('name', name);
		setValue('slug', slugify(name));
	}

	async function onSubmit(data: CreateAgencyFormData) {
		setSubmitError(null);
		const { error } = await authClient.organization.create({
			name: data.name,
			slug: data.slug,
		});

		if (error) {
			setSubmitError(getAuthErrorMessage(error, 'Unable to create agency.'));
			return;
		}

		await Promise.all([
			queryClient.invalidateQueries({ queryKey: ['session'] }),
			queryClient.removeQueries({ queryKey: ['agencies'] }),
		]);
		navigate('/agency');
	}

	return (
		<div className="flex flex-col gap-6">
			<div className="flex flex-col gap-1 text-center">
				<Typography variant="h3">Create your agency</Typography>
				<Typography variant="body">
					Set up your agency to start managing cars and reservations.
				</Typography>
			</div>

			<form
				onSubmit={handleSubmit(onSubmit)}
				className="flex flex-col gap-4"
				aria-busy={isSubmitting}
			>
				<AuthFormMessage message={submitError} />
				<Field>
					<FieldLabel htmlFor="name">Agency name</FieldLabel>
					<Input
						id="name"
						type="text"
						placeholder="Acme Rentals"
						aria-invalid={errors.name ? true : undefined}
						{...register('name')}
						onChange={onNameChange}
					/>
					<FieldError errors={[errors.name]} />
				</Field>

				<Field>
					<FieldLabel htmlFor="slug">Slug</FieldLabel>
					<Input
						id="slug"
						type="text"
						placeholder="acme-rentals"
						aria-invalid={errors.slug ? true : undefined}
						{...register('slug')}
					/>
					<FieldDescription>Used in your public agency URL.</FieldDescription>
					<FieldError errors={[errors.slug]} />
				</Field>

				<Button type="submit" size="lg" disabled={isSubmitting} className="mt-1 w-full">
					{isSubmitting && <SpinnerIcon className="animate-spin" />}
					{isSubmitting ? 'Creating agency...' : 'Create agency'}
				</Button>
			</form>
		</div>
	);
}
