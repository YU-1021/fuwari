export interface Sponsor {
	name: string;
	avatar: string | null;
	date: string;
	amount: string;
}

export interface SponsorsData {
	sponsors: Sponsor[];
}
