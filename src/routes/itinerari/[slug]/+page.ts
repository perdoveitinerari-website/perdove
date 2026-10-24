import { error } from '@sveltejs/kit';
import { itineraries, getItinerary } from '#lib/data/itineraries.ts';
import type { EntryGenerator, PageLoad } from './$types';

export const entries: EntryGenerator = () => itineraries.map(({ slug }) => ({ slug }));

export const load: PageLoad = ({ params }) => {
	const itinerary = getItinerary(params.slug);
	if (!itinerary) error(404, 'Itinerario non trovato');
	return { itinerary };
};
