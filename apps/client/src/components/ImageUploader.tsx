import { cn } from '@/lib/utils';
import {
	CropIcon,
	MagnifyingGlassMinusIcon,
	MagnifyingGlassPlusIcon,
	TrashIcon,
	UploadSimpleIcon,
} from '@phosphor-icons/react';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import Cropper from 'react-easy-crop';
import { Button } from './ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Slider } from './ui/slider';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';

interface Point {
	x: number;
	y: number;
}

interface Area {
	x: number;
	y: number;
	width: number;
	height: number;
}

export interface ImageUploaderCopy {
	title: string;
	dropPrompt: string;
	acceptedFormats: string;
	maxSize: string;
	footer: string;
	clear: string;
	edit: string;
	previewAlt: string;
	cropTitle: string;
	cancel: string;
	apply: string;
	invalidType: (types: string[]) => string;
	tooLarge: (size: string) => string;
	maxFiles: (count: number) => string;
}

export interface ImageUploaderProps extends React.ComponentPropsWithoutRef<'input'> {
	aspectRatio?: number;
	maxSize?: number;
	acceptedFileTypes?: string[];
	multiple?: boolean;
	maxFiles?: number;
	className?: string;
	copy: ImageUploaderCopy;
	onImageCropped?: (blob: Blob, index: number) => void;
	onImagesCropped?: (blobs: Blob[]) => void;
}

type Preview = {
	url: string;
	blob: Blob;
};

export function ImageUploader({
	aspectRatio = 1,
	maxSize = 5 * 1024 * 1024,
	acceptedFileTypes = ['image/jpeg', 'image/png', 'image/webp'],
	multiple = false,
	maxFiles = multiple ? Number.POSITIVE_INFINITY : 1,
	className,
	copy,
	onImageCropped,
	onImagesCropped,
	...rest
}: ImageUploaderProps) {
	const [image, setImage] = useState<string | null>(null);
	const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
	const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
	const [zoom, setZoom] = useState(1);
	const [error, setError] = useState<string | null>(null);
	const [previews, setPreviews] = useState<Preview[]>([]);
	const [editingIndex, setEditingIndex] = useState<number | null>(null);
	const [isCropDialogOpen, setIsCropDialogOpen] = useState(false);
	const inputRef = useRef<HTMLInputElement>(null);

	const previewsRef = useRef(previews);
	previewsRef.current = previews;

	useEffect(() => {
		return () => previewsRef.current.forEach(({ url }) => URL.revokeObjectURL(url));
	}, []);

	const resetCrop = () => {
		setCrop({ x: 0, y: 0 });
		setZoom(1);
		setCroppedAreaPixels(null);
	};

	const handleFileSelect = (file: File | null) => {
		if (!file) return;
		setError(null);

		if (!acceptedFileTypes.includes(file.type)) {
			setError(copy.invalidType(acceptedFileTypes));
			return;
		}

		if (file.size > maxSize) {
			setError(copy.tooLarge(`${maxSize / (1024 * 1024)}MB`));
			return;
		}

		if (previews.length >= maxFiles) {
			setError(copy.maxFiles(maxFiles));
			return;
		}

		const reader = new FileReader();
		reader.onload = () => {
			setImage(typeof reader.result === 'string' ? reader.result : null);
			resetCrop();
			setEditingIndex(null);
			setIsCropDialogOpen(true);
		};
		reader.readAsDataURL(file);
	};

	const onCropComplete = useCallback((_: Area, area: Area) => {
		setCroppedAreaPixels(area);
	}, []);

	const cropImage = useCallback(async () => {
		if (!image || !croppedAreaPixels) return;

		const img = new Image();
		img.src = image;
		await new Promise<void>((resolve, reject) => {
			img.onload = () => resolve();
			img.onerror = reject;
		});

		const canvas = document.createElement('canvas');
		canvas.width = croppedAreaPixels.width;
		canvas.height = croppedAreaPixels.height;
		const context = canvas.getContext('2d');
		if (!context) return;

		const scaleX = img.naturalWidth / img.width;
		const scaleY = img.naturalHeight / img.height;
		context.drawImage(
			img,
			croppedAreaPixels.x * scaleX,
			croppedAreaPixels.y * scaleY,
			croppedAreaPixels.width * scaleX,
			croppedAreaPixels.height * scaleY,
			0,
			0,
			croppedAreaPixels.width,
			croppedAreaPixels.height,
		);

		canvas.toBlob((blob) => {
			if (!blob) return;
			const preview = { blob, url: URL.createObjectURL(blob) };
			setPreviews((current) => {
				const next =
					editingIndex === null
						? [...current, preview]
						: current.map((item, index) => {
								if (index !== editingIndex) return item;
								URL.revokeObjectURL(item.url);
								return preview;
							});
				onImagesCropped?.(next.map(({ blob: item }) => item));
				return next;
			});
			onImageCropped?.(blob, editingIndex ?? previews.length);
			setIsCropDialogOpen(false);
			setImage(null);
			resetCrop();
		}, 'image/jpeg');
	}, [croppedAreaPixels, editingIndex, image, onImageCropped, onImagesCropped, previews.length]);

	const removePreview = (index: number) => {
		setPreviews((current) => {
			URL.revokeObjectURL(current[index].url);
			const next = current.filter((_, itemIndex) => itemIndex !== index);
			onImagesCropped?.(next.map(({ blob }) => blob));
			return next;
		});
	};

	const openEditor = (index: number) => {
		setEditingIndex(index);
		setImage(previews[index].url);
		resetCrop();
		setIsCropDialogOpen(true);
	};

	return (
		<div className={cn('w-full', className)}>
			<Card className="w-full">
				<CardHeader>
					<CardTitle className="flex items-center justify-between">
						{copy.title}
						{!multiple && previews.length > 0 && (
							<TooltipProvider>
								<Tooltip>
									<TooltipTrigger
										render={
											<Button size="icon" variant="destructive" onClick={() => removePreview(0)} />
										}
									>
										<TrashIcon size={16} className="fill-destructive" />
									</TooltipTrigger>
									<TooltipContent>{copy.clear}</TooltipContent>
								</Tooltip>
							</TooltipProvider>
						)}
					</CardTitle>
				</CardHeader>
				<CardContent>
					{(multiple || previews.length === 0) && previews.length < maxFiles && (
						<div
							className="cursor-pointer rounded-lg border-2 border-dashed p-8 text-center transition-colors hover:bg-muted/20"
							onDragOver={(event) => event.preventDefault()}
							onDrop={(event) => {
								event.preventDefault();
								handleFileSelect(event.dataTransfer.files[0] ?? null);
							}}
							onClick={() => inputRef.current?.click()}
						>
							<input
								ref={inputRef}
								type="file"
								className="hidden"
								accept={acceptedFileTypes.join(',')}
								multiple={multiple}
								onChange={(event) => {
									Array.from(event.target.files ?? []).forEach(handleFileSelect);
									event.target.value = '';
								}}
								{...rest}
							/>
							<UploadSimpleIcon className="mx-auto h-12 w-12 text-muted-foreground" />
							<p className="mt-2 text-sm text-muted-foreground">{copy.dropPrompt}</p>
							<p className="mt-1 text-xs text-muted-foreground">{copy.acceptedFormats}</p>
							<p className="mt-1 text-xs text-muted-foreground">{copy.maxSize}</p>
							{error && <p className="mt-2 text-sm text-destructive">{error}</p>}
						</div>
					)}
					{previews.length > 0 && (
						<div className={cn('grid gap-4', multiple && 'sm:grid-cols-2')}>
							{previews.map((preview, index) => (
								<div className="relative overflow-hidden rounded-lg" key={preview.url}>
									<img
										src={preview.url}
										alt={copy.previewAlt}
										className="aspect-square h-auto w-full rounded-lg object-cover"
										style={{ aspectRatio }}
									/>
									<div className="absolute bottom-4 right-4 flex gap-2">
										<Button onClick={() => openEditor(index)}>
											{copy.edit} <CropIcon />{' '}
										</Button>
										{multiple && (
											<Button size="icon" variant="outline" onClick={() => removePreview(index)}>
												<TrashIcon size={16} />
											</Button>
										)}
									</div>
								</div>
							))}
						</div>
					)}
				</CardContent>
				<CardFooter>
					<p className="text-xs text-muted-foreground">{copy.footer}</p>
				</CardFooter>
			</Card>

			<Dialog open={isCropDialogOpen} onOpenChange={setIsCropDialogOpen}>
				<DialogContent className="sm:max-w-lg">
					<DialogHeader>
						<DialogTitle>{copy.cropTitle}</DialogTitle>
					</DialogHeader>
					{image && (
						<>
							<div className="relative h-80 w-full">
								<Cropper
									image={image}
									crop={crop}
									zoom={zoom}
									aspect={aspectRatio}
									onCropChange={setCrop}
									onCropComplete={onCropComplete}
									onZoomChange={setZoom}
								/>
							</div>
							<div className="flex items-center gap-4">
								<MagnifyingGlassMinusIcon className="h-4 w-4" />
								<Slider
									value={zoom}
									min={1}
									max={3}
									step={0.1}
									onValueChange={(value) => setZoom(typeof value === 'number' ? value : value[0])}
								/>
								<MagnifyingGlassPlusIcon className="h-4 w-4" />
							</div>
							<div className="flex justify-end gap-2">
								<Button variant="outline" onClick={() => setIsCropDialogOpen(false)}>
									{copy.cancel}
								</Button>
								<Button onClick={cropImage}>{copy.apply}</Button>
							</div>
						</>
					)}
				</DialogContent>
			</Dialog>
		</div>
	);
}
