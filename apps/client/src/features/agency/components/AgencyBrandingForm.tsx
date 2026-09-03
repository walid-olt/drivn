import { ImageUploader } from '@/components/ImageUploader';
import { Button } from '@/components/ui/button';
import {
	InputGroup,
	InputGroupTextarea,
	InputGroupAddon,
	InputGroupText,
} from '@/components/ui/input-group';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Typography } from '@/components/ui/typography';
import {
	ACCEPTED_IMAGE_TYPES,
	MAX_AGENCY_BANNER_SIZE_MB,
	MAX_AGENCY_LOGO_SIZE_MB,
	updateAgencyBranding,
} from '@drivn/shared';
import { useForm, Controller } from 'react-hook-form';
import z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowRightIcon, FloppyDiskIcon, SpinnerIcon } from '@phosphor-icons/react';
import apiClient from '@/lib/api-client';
import { getExtensionFromMime } from '@/lib/utils';

export const updateAgencyBrandingSchema = updateAgencyBranding
	.omit({
		logo: true,
		banner: true,
	})
	.extend({
		logo: z
			.file()
			.mime([...ACCEPTED_IMAGE_TYPES], `only ${ACCEPTED_IMAGE_TYPES.join(', ')} are accepted`)
			.max(
				MAX_AGENCY_LOGO_SIZE_MB * 1024 * 1024,
				`logo must be smaller than ${MAX_AGENCY_LOGO_SIZE_MB}MB`,
			)
			.optional(),
		banner: z
			.file()
			.mime([...ACCEPTED_IMAGE_TYPES], `only ${ACCEPTED_IMAGE_TYPES.join(', ')} are accepted`)
			.max(
				MAX_AGENCY_BANNER_SIZE_MB * 1024 * 1024,
				`banner must be smaller than ${MAX_AGENCY_BANNER_SIZE_MB}MB`,
			)
			.optional(),
	});

const logoUploaderCopy = {
	title: 'Upload logo ',
	dropPrompt: 'Drop a logo here or browse your files.',
	acceptedFormats: 'PNG, JPEG, or WebP',
	maxSize: `Maximum file size: ${MAX_AGENCY_LOGO_SIZE_MB}MB`,
	footer: 'The logo will be cropped before it is saved.',
	clear: 'Remove logo',
	edit: 'Edit crop',
	previewAlt: 'Logo preview',
	cropTitle: 'Crop logo',
	cancel: 'Cancel',
	apply: 'Apply crop',
	invalidType: (types: string[]) => `Use one of these formats: ${types.join(', ')}.`,
	tooLarge: (size: string) => `Choose an image smaller than ${size}.`,
	maxFiles: (count: number) => `You can add up to ${count} image${count === 1 ? '' : 's'}.`,
};

const bannerUploaderCopy = {
	title: 'Upload banner',
	dropPrompt: 'Drop a banner here or browse your files.',
	acceptedFormats: 'PNG, JPEG, or WebP',
	maxSize: `Maximum file size: ${MAX_AGENCY_BANNER_SIZE_MB}MB`,
	footer: 'The banner will be cropped before it is saved.',
	clear: 'Remove banner',
	edit: 'Edit crop',
	previewAlt: 'Banner preview',
	cropTitle: 'Crop banner',
	cancel: 'Cancel',
	apply: 'Apply crop',
	invalidType: (types: string[]) => `Use one of these formats: ${types.join(', ')}.`,
	tooLarge: (size: string) => `Choose an image smaller than ${size}.`,
	maxFiles: (count: number) => `You can add up to ${count} image${count === 1 ? '' : 's'}.`,
};

type Props = {
	onSuccess: VoidFunction;
	onSubmit: VoidFunction;
};

const AgencyBrandingForm = ({ onSuccess, onSubmit: startSubmit }: Props) => {
	const {
		register,
		watch,
		handleSubmit,

		control,
		formState: { errors, isSubmitting },

		setError,
	} = useForm({
		resolver: zodResolver(updateAgencyBrandingSchema),
	});
	const summary = watch('summary');
	const onSubmit = async (data: z.infer<typeof updateAgencyBrandingSchema>) => {
		startSubmit();

		const [err, res] = await apiClient.agency.updateAgencyBranding(data);
		if (err) {
			setError('root', {
				message: err.message || 'Failed to save your changes, please try again',
			});
			console.info('[SERVER]: ', res);
			return;
		}
		onSuccess();
	};

	return (
		<div>
			<Typography variant={'h3'}>Make your agency recognizable</Typography>
			<Typography variant={'body'}>
				Add your logo and a cover image to help customers recognize your agency.
			</Typography>
			<form
				className={`py-12 ${isSubmitting && 'opacity-80 pointer-events-none'}`}
				onSubmit={handleSubmit(onSubmit)}
			>
				<div className="flex items-start flex-col  mb-4">
					<Label htmlFor="logo">
						<Typography variant={'h4'}>Logo (optional)</Typography>
					</Label>

					<Typography variant={'body'}>
						Your logo will appear on your agency profile, listings, and other customer-facing areas.
					</Typography>
					<div className="py-4">
						<Controller
							control={control}
							name="logo"
							render={({ field: { onChange } }) => {
								return (
									<ImageUploader
										id="logo"
										aspectRatio={1}
										maxSize={MAX_AGENCY_LOGO_SIZE_MB * 1024 * 1024}
										acceptedFileTypes={[...ACCEPTED_IMAGE_TYPES]}
										copy={logoUploaderCopy}
										onImagesCropped={(images) => {
											const image = images[0];
											const ext = getExtensionFromMime(image.type);
											onChange(
												image
													? new File([image], `logo.${ext}`, {
															type: image.type,
														})
													: undefined,
											);
										}}
									/>
								);
							}}
						/>
						{errors.logo && (
							<Typography variant="caption" className="text-destructive">
								{errors.logo.message}
							</Typography>
						)}
					</div>
				</div>
				<Separator className={'my-2'} />
				<div className="flex items-start flex-col gap-4 mb-4">
					<Label htmlFor="banner">
						<Typography variant={'h4'}>Banner (optional)</Typography>
					</Label>
					<div>
						<Controller
							control={control}
							name="banner"
							render={({ field: { onChange } }) => (
								<ImageUploader
									id="banner"
									aspectRatio={3 / 1}
									maxSize={MAX_AGENCY_BANNER_SIZE_MB * 1024 * 1024}
									acceptedFileTypes={[...ACCEPTED_IMAGE_TYPES]}
									copy={bannerUploaderCopy}
									onImagesCropped={(images) => {
										const image = images[0];
										const ext = getExtensionFromMime(image.type);
										onChange(
											image
												? new File([image], `banner.${ext}`, {
														type: image.type,
													})
												: undefined,
										);
									}}
								/>
							)}
						/>
					</div>
					{errors.banner && (
						<Typography variant="caption" className="text-destructive">
							{errors.banner.message}
						</Typography>
					)}
				</div>
				<Separator className={'my-2'} />
				<div className="flex items-start flex-col gap-4 mb-4">
					<Label htmlFor="summary">
						<Typography variant={'h4'}>summary (optional)</Typography>
					</Label>
					<Typography variant={'body'}>
						A short summary of your agency that will be displayed on your profile and listings.
					</Typography>
					<InputGroup>
						<InputGroupTextarea
							aria-invalid={!!errors.summary}
							id="summary"
							placeholder="summary..."
							{...register('summary')}
						/>
						<InputGroupAddon align="block-end">
							<InputGroupText className={`text-xs text-muted-foreground`}>
								{summary?.length || 0} / 500
							</InputGroupText>
						</InputGroupAddon>
					</InputGroup>
					{errors.summary && (
						<Typography variant={'caption'} className="text-destructive">
							{errors.summary.message}
						</Typography>
					)}
					{errors.root && (
						<Typography variant={'caption'} className="text-destructive">
							{errors.root.message}
						</Typography>
					)}
				</div>
				<div className="flex items-center justify-end gap-4 mt-8">
					<Button size={'lg'} type="submit">
						{isSubmitting ? (
							<>
								<SpinnerIcon /> Saving
							</>
						) : (
							<>
								<FloppyDiskIcon />
								Save and continue
							</>
						)}
					</Button>
					<Button size={'lg'} type="button" variant="secondary" onClick={onSuccess}>
						skip <ArrowRightIcon />
					</Button>
				</div>
			</form>
		</div>
	);
};

export default AgencyBrandingForm;
