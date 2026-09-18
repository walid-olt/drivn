import {
	ACCEPTED_IMAGE_TYPES,
	MAX_CAR_IMAGE_SIZE_BYTES,
	MAX_CAR_IMAGES,
} from '@drivn/shared';
import { Controller, useFormContext } from 'react-hook-form';

import { ImageUploader } from '@/components/ImageUploader';
import { Field, FieldDescription, FieldError, FieldLabel } from '@/components/ui/field';
import { Typography } from '@/components/ui/typography';
import { getExtensionFromMime } from '@/lib/utils';

const imageUploaderCopy = {
	title: 'Upload vehicle photos',
	dropPrompt: 'Drag and drop car photos here or browse your files.',
	acceptedFormats: 'PNG, JPEG, or WebP',
	maxSize: 'Maximum file size: 5MB',
	footer: 'Images will be cropped before they are saved.',
	clear: 'Remove photo',
	edit: 'Edit crop',
	previewAlt: 'Vehicle preview',
	cropTitle: 'Crop photo',
	cancel: 'Cancel',
	apply: 'Apply crop',
	invalidType: (types: string[]) => `Use one of these formats: ${types.join(', ')}.`,
	tooLarge: (size: string) => `Choose an image smaller than ${size}.`,
	maxFiles: (count: number) => `You can add up to ${count} image${count === 1 ? '' : 's'}.`,
};

export default function ImagesSection() {
	const {
		control,
		formState: { errors },
	} = useFormContext();

	return (
		<section>
			<div className="mb-5 flex items-end justify-between gap-4">
				<div>
					<Typography variant="h4">Vehicle photos</Typography>
					<Typography variant="caption">
						Lead with the angle that makes this car easy to recognize.
					</Typography>
				</div>
				<Typography variant="caption" className="hidden sm:block">
					Up to {MAX_CAR_IMAGES} photos
				</Typography>
			</div>
			<Field>
				<FieldLabel htmlFor="images" className="sr-only">
					Vehicle photos
				</FieldLabel>
				<Controller
					name="images"
					control={control}
					render={({ field: { onChange } }) => (
						<ImageUploader
							id="images"
							aspectRatio={4 / 3}
							maxSize={MAX_CAR_IMAGE_SIZE_BYTES}
							acceptedFileTypes={[...ACCEPTED_IMAGE_TYPES]}
							multiple
							maxFiles={MAX_CAR_IMAGES}
							className="[&>[data-slot=card]]:rounded-none [&>[data-slot=card]]:border-0 [&>[data-slot=card]]:bg-transparent [&>[data-slot=card]]:p-0 [&>[data-slot=card]]:shadow-none [&>[data-slot=card]]:ring-0 [&_[data-slot=card-header]]:hidden [&_[data-slot=card-content]]:px-0 [&_[data-slot=card-footer]]:px-0"
							copy={imageUploaderCopy}
							onImagesCropped={(images) => {
								const files = images.map((image, index) => {
									const mimeType = image.type || 'image/jpeg';
									const ext = getExtensionFromMime(mimeType);
									return new File([image], `car-${Date.now()}-${index}.${ext}`, {
										type: mimeType,
									});
								});
								onChange(files);
							}}
						/>
					)}
				/>
				<FieldDescription className="mt-3">
					At least one image is required. Use clear exterior shots with the car fully in frame.
				</FieldDescription>
				<FieldError errors={[errors.images]} />
			</Field>
		</section>
	);
}
