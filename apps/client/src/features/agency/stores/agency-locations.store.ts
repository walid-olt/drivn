import { create } from 'zustand';

type AgencyLocationsState = {
	search: string;
	selectedIds: Set<string>; // sets are easier to work with for toggling and checking existence (o(1) vs o(n) for arrays🤠)
	showSelectedOnly: boolean;
	setSearch: (search: string) => void;
	toggleSelected: (id: string) => void;
	setSelected: (id: string, selected: boolean) => void;
	toggleSelectedOnly: () => void;
	reset: () => void;
};

const initialState = {
	search: '',
	selectedIds: new Set<string>(),
	showSelectedOnly: false,
};

export const useAgencyLocationsStore = create<AgencyLocationsState>((set) => ({
	...initialState,
	setSearch: (search) => set({ search }),
	toggleSelected: (id) =>
		set(({ selectedIds }) => {
			const nextSelectedIds = new Set(selectedIds);
			if (nextSelectedIds.has(id)) {
				nextSelectedIds.delete(id);
			} else {
				nextSelectedIds.add(id);
			}
			return { selectedIds: nextSelectedIds };
		}),
	setSelected: (id, selected) =>
		set(({ selectedIds }) => {
			const nextSelectedIds = new Set(selectedIds);
			if (selected) {
				nextSelectedIds.add(id);
			} else {
				nextSelectedIds.delete(id);
			}
			return { selectedIds: nextSelectedIds };
		}),
	toggleSelectedOnly: () =>
		set(({ showSelectedOnly }) => ({ showSelectedOnly: !showSelectedOnly })),
	reset: () => set({ ...initialState, selectedIds: new Set() }),
}));
