import { Typography } from '@/components/ui/typography';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PhoneInput } from '@/components/PhoneInput';
import { Button } from '@ui/button';
import { updateAgencySupport, type UpdateAgencySupportDto } from '@drivn/shared';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowRightIcon, FloppyDiskIcon, SpinnerIcon } from '@phosphor-icons/react';
import { Controller, useForm } from 'react-hook-form';
import apiClient from '@/lib/api-client';
import { useState } from 'react';

type Props = {
	onSuccess: VoidFunction;
	onSubmit: VoidFunction;
};

const AgencySupportForm = ({ onSuccess, onSubmit: startSubmit }: Props) => {
	const [isSkipping, setIsSkipping] = useState(false);
	const {
		register,
		control,
		handleSubmit,
		formState: { errors, isSubmitting, isDirty },
		setError,
	} = useForm<UpdateAgencySupportDto>({
		resolver: zodResolver(updateAgencySupport),
	});

	const onSubmit = async (data: UpdateAgencySupportDto) => {
		startSubmit();
		const [err, res] = await apiClient.agency.updateAgencySupport(data);
		if (err) {
			setError('root', {
				message: err.message || 'Failed to save your changes, please try again',
			});
			console.info('[SERVER]: ', res);
			return;
		}
		onSuccess();
	};

	const onSkip = async () => {
		startSubmit();
		setIsSkipping(true);
		const [err] = await apiClient.agency.updateAgencySupport({});
		if (err) {
			setError('root', { message: err.message });
			setIsSkipping(false);
			return;
		}
		setIsSkipping(false);
		onSuccess();
	};

	return (
		<div>
			<Typography variant={'h3'}>How can customers reach you?</Typography>
			<Typography variant={'body'}>
				Add the contact details customers can use when they need help with a booking or have a
				question.
			</Typography>
			<form
				className={`flex flex-col gap-4 py-12 ${isSubmitting && 'pointer-events-none opacity-80'}`}
				onSubmit={handleSubmit(onSubmit)}
			>
				<div className="flex flex-col gap-2">
					<Label htmlFor="supportEmail">Support email</Label>
					<Input
						id="supportEmail"
						type="email"
						placeholder="support@example.com"
						aria-invalid={errors.supportEmail ? true : undefined}
						{...register('supportEmail')}
					/>
					{errors.supportEmail && (
						<Typography variant="caption" className="text-destructive">
							{errors.supportEmail.message}
						</Typography>
					)}
				</div>

				<div className="flex flex-col gap-2 ">
					<Label htmlFor="supportPhone">Support phone</Label>
					<Controller
						control={control}
						name="supportPhone"
						render={({ field }) => (
							<PhoneInput
								className="z-9999"
								name={field.name}
								value={field.value}
								aria-invalid={errors.supportPhone ? true : undefined}
								onChange={field.onChange}
								onBlur={field.onBlur}
							/>
						)}
					/>
					{errors.supportPhone && (
						<Typography variant="caption" className="text-destructive">
							{errors.supportPhone.message}
						</Typography>
					)}
				</div>

				<div className="flex flex-col gap-2">
					<Typography variant="h4">Address</Typography>
					<Input
						id="address.addressLine1"
						placeholder="Address line 1"
						aria-invalid={errors.address?.addressLine1 ? true : undefined}
						{...register('address.addressLine1')}
					/>
					<Input
						id="address.city"
						placeholder="City"
						aria-invalid={errors.address?.city ? true : undefined}
						{...register('address.city')}
					/>
					<Input
						id="address.zipCode"
						placeholder="ZIP / postal code"
						aria-invalid={errors.address?.zipCode ? true : undefined}
						{...register('address.zipCode')}
					/>
					{(errors.address?.addressLine1 || errors.address?.city || errors.address?.zipCode) && (
						<Typography variant="caption" className="text-destructive">
							{errors.address.addressLine1?.message ||
								errors.address.city?.message ||
								errors.address.zipCode?.message}
						</Typography>
					)}
				</div>

				{errors.root && (
					<Typography variant="caption" className="text-destructive">
						{errors.root.message}
					</Typography>
				)}
				<div className="mt-4 flex items-center justify-end gap-4">
					<Button size="lg" type="submit">
						{isSubmitting ? (
							<>
								<SpinnerIcon className="animate-spin" /> Saving
							</>
						) : (
							<>
								<FloppyDiskIcon /> Save and continue
							</>
						)}
					</Button>
					<Button
						size="lg"
						type="button"
						variant="secondary"
						disabled={isSkipping}
						onClick={onSkip}
					>
						{isSkipping ? (
							<>
								<SpinnerIcon className="animate-spin" /> Skipping
							</>
						) : (
							<>
								skip {isDirty && '(Discard changes)'} <ArrowRightIcon />
							</>
						)}
					</Button>
				</div>
			</form>
		</div>
	);
};

export default AgencySupportForm;
