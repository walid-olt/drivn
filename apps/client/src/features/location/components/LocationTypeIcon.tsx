import {
	AirplaneIcon,
	BedIcon,
	BoatIcon,
	BuildingOfficeIcon,
	MapPinIcon,
	TrainIcon,
} from '@phosphor-icons/react';
import type { Location as AgencyLocation } from '@drivn/shared';

export function LocationTypeIcon({ type }: { type: AgencyLocation['type'] }) {
	const iconProps = { className: 'size-4 shrink-0 text-muted-foreground' };

	switch (type) {
		case 'airport':
			return <AirplaneIcon {...iconProps} />;
		case 'hotel':
			return <BedIcon {...iconProps} />;
		case 'train_station':
			return <TrainIcon {...iconProps} />;
		case 'port':
			return <BoatIcon {...iconProps} />;
		case 'office':
			return <BuildingOfficeIcon {...iconProps} />;
		default:
			return <MapPinIcon {...iconProps} />;
	}
}

export function formatLocationType(type: AgencyLocation['type']) {
	return type.replace('_', ' ');
}
