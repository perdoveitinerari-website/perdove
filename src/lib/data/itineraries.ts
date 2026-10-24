/**
 * The three itineraries, transcribed from the original PDFs (assets-source/pdf).
 * Only the overview is kept here: the day-by-day details live in the PDF.
 */

export type Region = 'italia' | 'europa' | 'mondo';

export const REGIONS: { id: Region; label: string; short: string; description: string }[] = [
	{ id: 'italia', label: 'Italia', short: 'Italia', description: 'Città d’arte e borghi di casa nostra' },
	{ id: 'europa', label: 'Europa', short: 'Europa', description: 'Capitali e tesori a poche ore di volo' },
	{ id: 'mondo', label: 'Resto del mondo', short: 'Mondo', description: 'Viaggi lontani da vivere senza stress' }
];

export type Itinerary = {
	slug: string;
	city: string;
	country: string;
	region: Region;
	days: number;
	title: string;
	tagline: string;
	summary: string;
	intro: string[];
	pdf: { file: string; downloadName: string; pages: number; sizeMb: number };
	features: string[];
	/** Number of interactive day maps linked in the PDF. */
	maps: number;
	accent: string;
};

export const itineraries: Itinerary[] = [
	{
		slug: 'roma-3-giorni',
		city: 'Roma',
		country: 'Italia',
		region: 'italia',
		days: 3,
		title: 'Roma in 3 giorni',
		tagline: 'Il tuo itinerario flessibile per scoprire Roma senza perdere tempo',
		summary:
			'Dal Colosseo al Vaticano fino al tramonto sul Giardino degli Aranci: tre giornate ben organizzate per vivere il meglio della Città Eterna.',
		intro: [
			'Tre giorni per attraversare duemila anni di storia: la Roma antica del Colosseo e dei Fori, la magnificenza dei Musei Vaticani e di San Pietro, le ville, le terme e i panorami più belli al tramonto.',
			'Ogni giornata è divisa in mattina, pomeriggio e sera, ma puoi cambiare liberamente ordine e tempi delle visite in base alle tue esigenze.'
		],
		pdf: {
			file: '/itinerari/perdove-itinerario-roma-3-giorni.pdf',
			downloadName: 'PerDove - Itinerario Roma 3 giorni.pdf',
			pages: 9,
			sizeMb: 2.6
		},
		features: [
			'Mappe interattive per ogni giornata',
			'Tempi di visita, prezzi e orari delle attrazioni',
			'Prenotazioni obbligatorie e consigliate',
			'Hotel consigliati per zona',
			'Ristoranti consigliati per zona',
			'Budget indicativo e checklist di viaggio'
		],
		maps: 3,
		accent: '#957662'
	},
	{
		slug: 'vienna-4-giorni',
		city: 'Vienna',
		country: 'Austria',
		region: 'europa',
		days: 4,
		title: 'Vienna in 4 giorni',
		tagline: 'Il tuo itinerario flessibile per scoprire Vienna senza perdere tempo',
		summary:
			'Palazzi imperiali, musei di fama mondiale, il Prater e i sapori della cucina viennese: quattro giorni nella capitale più elegante d’Europa.',
		intro: [
			'Quattro giornate tra la Vienna degli Asburgo e quella più creativa: il centro storico con lo Stephansdom e l’Hofburg, un’intera giornata a Schönbrunn, il MuseumsQuartier, il Belvedere e la ruota panoramica del Prater.',
			'L’itinerario include anche una selezione di piatti tipici e dei locali dove assaggiarli, oltre a hotel e ristoranti divisi per quartiere.'
		],
		pdf: {
			file: '/itinerari/perdove-itinerario-vienna-4-giorni.pdf',
			downloadName: 'PerDove - Itinerario Vienna 4 giorni.pdf',
			pages: 11,
			sizeMb: 6.6
		},
		features: [
			'Mappe interattive per ogni giornata',
			'Tempi di visita, prezzi e orari delle attrazioni',
			'Hotel consigliati per zona',
			'Ristoranti consigliati per zona',
			'Cibi tipici e dove mangiarli',
			'Budget indicativo e checklist di viaggio'
		],
		maps: 4,
		accent: '#79A3C3'
	},
	{
		slug: 'new-york-6-giorni',
		city: 'New York',
		country: 'Stati Uniti',
		region: 'mondo',
		days: 6,
		title: 'New York in 6 giorni',
		tagline: 'Il tuo itinerario flessibile per scoprire New York senza perdere tempo',
		summary:
			'Musei iconici, Central Park, terrazze panoramiche e l’alba sul Ponte di Brooklyn: sei giorni per vivere la Grande Mela quartiere dopo quartiere.',
		intro: [
			'Sei giornate per scoprire Manhattan e dintorni: l’Upper East Side e il Met, Central Park e la Fifth Avenue, Midtown e Times Square, la High Line e Hudson Yards, Brooklyn all’alba e Lower Manhattan, con un’ultima giornata libera per lo shopping.',
			'Ogni sera ha il suo panorama: Summit, Top of the Rock e The Edge sono già inseriti nel percorso, con indicazioni su prenotazioni e prezzi.'
		],
		pdf: {
			file: '/itinerari/perdove-itinerario-new-york-6-giorni.pdf',
			downloadName: 'PerDove - Itinerario New York 6 giorni.pdf',
			pages: 8,
			sizeMb: 2.4
		},
		features: [
			'Mappe interattive per le giornate di visita',
			'Tempi di visita, prezzi e orari delle attrazioni',
			'Prenotazioni obbligatorie e consigliate',
			'Hotel consigliati per zona',
			'Budget indicativo e checklist di viaggio'
		],
		maps: 5,
		accent: '#3A2119'
	}
];

export const getItinerary = (slug: string) => itineraries.find((i) => i.slug === slug);

export const regionLabel = (region: Region) => REGIONS.find((r) => r.id === region)!.label;

export const daysLabel = (days: number) => (days === 1 ? '1 giorno' : `${days} giorni`);
