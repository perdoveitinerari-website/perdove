/**
 * The three itineraries, transcribed from the original PDFs (assets-source/pdf).
 * Only information actually present in each PDF is listed here.
 */

export type Region = 'italia' | 'europa' | 'mondo';

export const REGIONS: { id: Region; label: string; short: string; description: string }[] = [
	{ id: 'italia', label: 'Italia', short: 'Italia', description: 'Città d’arte e borghi di casa nostra' },
	{ id: 'europa', label: 'Europa', short: 'Europa', description: 'Capitali e tesori a poche ore di volo' },
	{ id: 'mondo', label: 'Resto del mondo', short: 'Mondo', description: 'Viaggi lontani da vivere senza stress' }
];

export type PriceTier = 1 | 2 | 3;

export const PRICE_TIERS: Record<PriceTier, string> = {
	1: 'Economico',
	2: 'Fascia media',
	3: 'Fascia alta'
};

export type Stop = { name: string; note?: string };

export type DayPart = { label: 'Mattina' | 'Pomeriggio' | 'Sera' | 'Tutta la giornata'; stops: Stop[] };

export type Day = { title: string; parts: DayPart[]; map?: string };

export type Attraction = {
	name: string;
	day?: number;
	time?: string;
	price?: string;
	hours?: string;
	booking?: 'obbligatoria' | 'consigliata';
	notes?: string[];
};

export type Place = { name: string; tier: PriceTier };

export type Area = { area: string; places: Place[] };

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
	plan: Day[];
	attractions: Attraction[];
	hotels: Area[];
	restaurants?: Area[];
	food?: { dishes: string[]; places: string[] };
	budget: { tier: PriceTier; range: string; description: string }[];
	budgetNote: string;
	attractionsTotal: string;
	accent: string;
};

const wanderlog = (id: string, name: string) => `https://wanderlog.com/view/${id}/${name}/shared`;

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
		plan: [
			{
				title: 'Roma antica e centro storico',
				map: wanderlog('zzhdowjyss', 'viaggio-a-rome'),
				parts: [
					{
						label: 'Mattina',
						stops: [
							{ name: 'Colosseo' },
							{ name: 'Arco di Costantino' },
							{ name: 'Fori Imperiali' },
							{ name: 'Monte Palatino' }
						]
					},
					{
						label: 'Pomeriggio',
						stops: [
							{ name: 'Via dei Fori Imperiali' },
							{ name: 'Piazza del Campidoglio' },
							{ name: 'Altare della Patria' },
							{ name: 'Piazza Venezia' },
							{ name: 'Fontana di Trevi' },
							{ name: 'Via del Corso' },
							{ name: 'Piazza di Spagna' }
						]
					},
					{ label: 'Sera', stops: [{ name: 'Colosseo illuminato e quartiere Monti' }] }
				]
			},
			{
				title: 'Vaticano e centro storico',
				map: wanderlog('tqympadnof', 'viaggio-a-rome-giorno-2'),
				parts: [
					{ label: 'Mattina', stops: [{ name: 'Musei Vaticani' }, { name: 'Cappella Sistina' }] },
					{
						label: 'Pomeriggio',
						stops: [
							{ name: 'Basilica di San Pietro' },
							{ name: 'Castel Sant’Angelo' },
							{ name: 'Ponte Sant’Angelo' },
							{ name: 'Piazza Navona' },
							{ name: 'Pantheon' }
						]
					},
					{ label: 'Sera', stops: [{ name: 'Piazza Navona, Campo de’ Fiori e Trastevere' }] }
				]
			},
			{
				title: 'Ville, terme e tramonto',
				map: wanderlog('eyodxqhfzn', 'viaggio-a-rome-giorno-3'),
				parts: [
					{
						label: 'Mattina',
						stops: [{ name: 'Villa Borghese' }, { name: 'Terrazza del Pincio' }, { name: 'Piazza del Popolo' }]
					},
					{
						label: 'Pomeriggio',
						stops: [
							{ name: 'Terme di Caracalla' },
							{ name: 'Circo Massimo' },
							{ name: 'Bocca della Verità' },
							{ name: 'Aventino' },
							{ name: 'Giardino degli Aranci', note: 'al tramonto' }
						]
					},
					{ label: 'Sera', stops: [{ name: 'Isola Tiberina, Piazza Navona e Fontana di Trevi' }] }
				]
			}
		],
		attractions: [
			{
				name: 'Colosseo',
				day: 1,
				time: '2 ore per il Colosseo, altre 2 ore per Fori e Palatino',
				price: '18 €',
				hours: '8:30–18:15',
				booking: 'obbligatoria'
			},
			{
				name: 'Altare della Patria',
				day: 1,
				time: '30–45 min per la parte esterna (gratuita), 2 ore per la visita completa',
				price: '18 €',
				hours: '9:30–19:30'
			},
			{
				name: 'Fontana di Trevi',
				day: 1,
				price: '2 € (solo per il perimetro interno)',
				hours: 'Lunedì e venerdì 11:30–22:00, altri giorni 9:00–22:00',
				notes: ['Fuori da questi orari l’accesso è gratuito']
			},
			{
				name: 'Musei Vaticani e Cappella Sistina',
				day: 2,
				time: '3–4 ore',
				price: '20 € + 5 € di prevendita',
				hours: '8:00–20:00, domenica chiuso',
				booking: 'consigliata',
				notes: ['Ultima domenica del mese ingresso gratuito 9:00–14:00']
			},
			{
				name: 'Basilica di San Pietro',
				day: 2,
				time: '45–60 min la sola basilica, 2–2,5 ore con la cupola',
				price: 'Cupola 17 €',
				hours: '7:00–20:00; cupola fino alle 18:00 (17:00 in inverno)',
				booking: 'consigliata',
				notes: ['Considera una possibile coda ai controlli di sicurezza nei giorni più affollati']
			},
			{
				name: 'Castel Sant’Angelo',
				day: 2,
				time: '2 ore',
				price: '18 €',
				hours: '9:00–19:30',
				booking: 'consigliata'
			},
			{ name: 'Pantheon', day: 2, time: '30 min', price: '5 €', hours: '9:00–19:00' },
			{
				name: 'Galleria Borghese (Villa Borghese)',
				day: 3,
				time: 'Massimo 2 ore',
				price: '16 € + 2 € di prenotazione',
				hours: 'Da martedì a domenica 9:00–19:00',
				booking: 'obbligatoria'
			},
			{
				name: 'Terme di Caracalla',
				day: 3,
				time: '1–2 ore',
				price: '8 €',
				hours: '9:00–19:00, lunedì chiuso'
			},
			{
				name: 'Circo Massimo',
				day: 3,
				time: '1 ora e 30 min',
				price: '7 €',
				hours: '9:30–19:00, lunedì chiuso',
				notes: ['Area verde gratuita e sempre aperta']
			}
		],
		hotels: [
			{
				area: 'Colosseo e Monti',
				places: [
					{ name: 'Elysium Suites Colosseo', tier: 3 },
					{ name: 'Raffaelli Suites', tier: 2 },
					{ name: 'Relais Manzoni', tier: 2 }
				]
			},
			{ area: 'San Giovanni', places: [{ name: 'Ventuno Dei Luxury Suites San Giovanni', tier: 2 }] },
			{ area: 'Termini / Esquilino', places: [{ name: 'Angolo di Roma Guest House', tier: 1 }] },
			{ area: 'Vaticano e Prati', places: [{ name: 'We Love Roma Guest House', tier: 1 }] },
			{ area: 'Centro storico / Campo Marzio', places: [{ name: 'Campo Marzio Hotelier', tier: 3 }] },
			{ area: 'Trastevere', places: [{ name: 'Imperiale Top', tier: 1 }] }
		],
		restaurants: [
			{
				area: 'Centro storico',
				places: [
					{ name: 'Da Fortunata', tier: 2 },
					{ name: 'Osteria delle Coppelle', tier: 2 },
					{ name: 'Senza Fondo', tier: 1 },
					{ name: 'Vecchia Roma', tier: 2 }
				]
			},
			{ area: 'Monti / Colosseo', places: [{ name: 'Da Danilo', tier: 2 }] },
			{ area: 'Prati / Vaticano', places: [{ name: 'Bonci Pizzarium', tier: 1 }] },
			{
				area: 'Trastevere',
				places: [
					{ name: 'Frumentario', tier: 1 },
					{ name: 'Fratelli Sancio', tier: 3 }
				]
			},
			{
				area: 'Testaccio',
				places: [
					{ name: 'Felice a Testaccio', tier: 2 },
					{ name: 'Fratelli Trecca', tier: 1 }
				]
			}
		],
		budget: [
			{
				tier: 1,
				range: '50–80 € al giorno',
				description: 'Pasti semplici, street food e spostamenti soprattutto a piedi.'
			},
			{
				tier: 2,
				range: '80–120 € al giorno',
				description: 'Equilibrio tra spesa e comfort: ristoranti di fascia media, snack e mezzi pubblici.'
			},
			{
				tier: 3,
				range: 'Oltre 120 € al giorno',
				description: 'Più libertà nella scelta di ristoranti, consumazioni, taxi e piccole spese.'
			}
		],
		budgetNote:
			'Stime a persona al giorno per pasti, bevande, piccoli extra e trasporti urbani. Non includono alloggio, voli e biglietti delle attrazioni.',
		attractionsTotal: 'circa 136 € a persona',
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
		plan: [
			{
				title: 'Centro storico e Hofburg',
				map: wanderlog('aqawuieycl', 'viaggio-a-vienna'),
				parts: [
					{
						label: 'Mattina',
						stops: [
							{ name: 'Ankeruhr' },
							{ name: 'Stephansdom', note: 'Cattedrale di Santo Stefano' },
							{ name: 'Graben e Kohlmarkt' },
							{ name: 'Biblioteca Nazionale Austriaca' }
						]
					},
					{ label: 'Pomeriggio', stops: [{ name: 'Hofburg' }, { name: 'Volksgarten' }] },
					{ label: 'Sera', stops: [{ name: 'Centro' }] }
				]
			},
			{
				title: 'Schönbrunn e giardini imperiali',
				map: wanderlog('utxrlpmtuq', 'viaggio-a-vienna'),
				parts: [{ label: 'Tutta la giornata', stops: [{ name: 'Castello di Schönbrunn' }] }]
			},
			{
				title: 'MuseumsQuartier e arte moderna',
				map: wanderlog('ilwxjalecj', 'viaggio-a-vienna'),
				parts: [
					{ label: 'Mattina', stops: [{ name: 'MuseumsQuartier' }] },
					{ label: 'Pomeriggio', stops: [{ name: 'Kunsthistorisches Museum' }] },
					{ label: 'Sera', stops: [{ name: 'Centro' }] }
				]
			},
			{
				title: 'Musei imperiali e Belvedere',
				map: wanderlog('bazkefmxqj', 'viaggio-a-vienna'),
				parts: [
					{ label: 'Mattina', stops: [{ name: 'Castello del Belvedere' }] },
					{ label: 'Pomeriggio', stops: [{ name: 'Hundertwasserhaus' }, { name: 'Prater' }] },
					{ label: 'Sera', stops: [{ name: 'Centro' }] }
				]
			}
		],
		attractions: [
			{
				name: 'Biblioteca Nazionale Austriaca',
				day: 1,
				time: '30 min – 1 ora',
				price: '11 €',
				hours: '9:00–18:00'
			},
			{
				name: 'Hofburg',
				day: 1,
				time: '2 ore la visita normale, 3 ore con i Tesori, 3 ore e 30 con i giardini (Volksgarten)',
				price: '20 € (museo e appartamenti)',
				hours: '9:00–17:30'
			},
			{
				name: 'Castello di Schönbrunn',
				day: 2,
				time: '3–4 ore per castello e Gloriette, 5–6 ore con zoo, labirinto e serra',
				price: '80 € palazzo, giardini, labirinto, zoo e serra · 42 € solo palazzo · 16 € giardini, labirinto e Gloriette',
				hours: '8:30–17:30 (variabili in base a stagione e giorni)',
				notes: ['Parco del castello aperto tutti i giorni 6:30–21:00']
			},
			{
				name: 'MuseumsQuartier',
				day: 3,
				time: '2 ore per un museo, 45 min per i cortili, 4–5 ore per tutti i musei',
				price: 'Leopold + mumok 33 € · Leopold 19 € · mumok 18 €',
				hours: '10:00–18:00'
			},
			{
				name: 'Kunsthistorisches Museum',
				day: 3,
				time: '3–4 ore',
				price: '22 €',
				hours: '10:00–18:00 (variabili in base a stagione e giorni)'
			},
			{
				name: 'Castello del Belvedere',
				day: 4,
				time: '2–3 ore; giardini 30–45 min; Belvedere Inferiore e Orangerie 1 ora',
				price: 'Superiore 23 € · Inferiore 20 € · biglietto unico 32 €',
				hours: '9:00–18:00'
			},
			{
				name: 'Hundertwasserhaus',
				day: 4,
				time: '20–30 min per l’esterno, 1–2 ore con il Village, 2–3 ore con il museo',
				price: 'Museo 15 €',
				hours: '10:00–18:00'
			},
			{
				name: 'Prater',
				day: 4,
				time: '4–5 ore',
				price: 'Ingresso gratuito, attrazioni a pagamento',
				hours: 'Aperto 24 ore su 24'
			}
		],
		hotels: [
			{
				area: 'Centro storico',
				places: [
					{ name: 'Hotel Pension Suzanne', tier: 1 },
					{ name: 'Austria Trend Hotel Europa Wien', tier: 2 },
					{ name: 'Park Hyatt Vienna', tier: 3 },
					{ name: 'The Amauris Vienna', tier: 3 }
				]
			},
			{ area: 'Leopoldstadt', places: [{ name: 'Ibis Budget Wien Messe', tier: 1 }] },
			{ area: 'Hauptbahnhof', places: [{ name: 'A&O Wien Hauptbahnhof', tier: 1 }] },
			{ area: 'Wieden', places: [{ name: 'Hotel Kaiserhof Wien', tier: 2 }] },
			{ area: 'Neubau', places: [{ name: '25hours Hotel beim MuseumsQuartier', tier: 2 }] }
		],
		restaurants: [
			{
				area: 'Neubau',
				places: [
					{ name: 'H11 Nbau', tier: 1 },
					{ name: 'Glacis Beisl', tier: 2 }
				]
			},
			{
				area: 'Leopoldstadt',
				places: [
					{ name: 'Schank zum Reichsapfel', tier: 1 },
					{ name: 'El Gaucho', tier: 2 }
				]
			},
			{
				area: 'Centro storico',
				places: [
					{ name: 'Reinthaler', tier: 1 },
					{ name: 'Plachutta Wollzeile', tier: 2 },
					{ name: 'Loca Casual Fine Dining', tier: 3 },
					{ name: 'Glasswing Restaurant', tier: 3 }
				]
			},
			{ area: 'Landstraße', places: [{ name: 'Steirereck', tier: 3 }] }
		],
		food: {
			dishes: ['Wiener Schnitzel', 'Tafelspitz', 'Gulasch', 'Apfelstrudel', 'Sachertorte', 'Käsekrainer'],
			places: ['Pulkautaler', 'Bratenwirtschaft', 'Reinthaler’s Beisl']
		},
		budget: [
			{
				tier: 1,
				range: '90–130 € al giorno',
				description: 'Alloggio economico, pasti semplici, trasporti pubblici e una selezione di attrazioni a pagamento.'
			},
			{
				tier: 2,
				range: '150–220 € al giorno',
				description: 'Hotel 3–4 stelle, pasti al ristorante, trasporti pubblici e visite alle principali attrazioni.'
			},
			{
				tier: 3,
				range: '300–500 € al giorno',
				description: 'Hotel di lusso, ristoranti di fascia alta, trasporti più comodi ed esperienze esclusive.'
			}
		],
		budgetNote: 'Stime indicative a persona al giorno: le cifre possono variare in base ad abitudini e periodo.',
		attractionsTotal: 'circa 213 € a persona',
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
		plan: [
			{
				title: 'Upper East Side',
				map: wanderlog('iymscvdovr', 'new-york-giorno-1'),
				parts: [
					{ label: 'Mattina', stops: [{ name: 'The Met', note: 'Metropolitan Museum of Art' }] },
					{ label: 'Pomeriggio', stops: [{ name: 'Upper East Side' }] },
					{ label: 'Sera', stops: [{ name: 'Summit One Vanderbilt' }] }
				]
			},
			{
				title: 'Central Park e Fifth Avenue',
				map: wanderlog('gewjsaadqq', 'new-york-giorno-2'),
				parts: [
					{
						label: 'Mattina',
						stops: [{ name: 'Central Park', note: 'Bethesda Terrace, Bow Bridge, The Mall, Belvedere Castle' }]
					},
					{ label: 'Pomeriggio', stops: [{ name: 'Fifth Avenue' }, { name: 'Guggenheim Museum' }] },
					{ label: 'Sera', stops: [{ name: 'Top of the Rock' }] }
				]
			},
			{
				title: 'Midtown e Times Square',
				map: wanderlog('kebsorlwsi', 'new-york-giorno-3'),
				parts: [
					{
						label: 'Mattina',
						stops: [
							{ name: 'Grand Central Terminal' },
							{ name: 'Cattedrale di San Patrizio' },
							{ name: 'New York Public Library' },
							{ name: 'Bryant Park' },
							{ name: 'Museo delle cere' }
						]
					},
					{ label: 'Pomeriggio', stops: [{ name: 'MoMA' }] },
					{ label: 'Sera', stops: [{ name: 'Times Square' }] }
				]
			},
			{
				title: 'Chelsea, Hudson Yards e Upper West Side',
				map: wanderlog('lungwbgowl', 'new-york-giorno-4'),
				parts: [
					{
						label: 'Mattina',
						stops: [{ name: 'Flatiron Building' }, { name: 'High Line' }, { name: 'Little Island' }]
					},
					{
						label: 'Pomeriggio',
						stops: [{ name: 'Museo di Storia Naturale' }, { name: 'Tempo libero o shopping' }]
					},
					{ label: 'Sera', stops: [{ name: 'The Edge' }] }
				]
			},
			{
				title: 'Brooklyn e Lower Manhattan',
				map: wanderlog('uqvkdsaxzt', 'new-york-giorno-5'),
				parts: [
					{
						label: 'Mattina',
						stops: [
							{ name: 'Ponte di Brooklyn', note: 'all’alba' },
							{ name: 'DUMBO' },
							{ name: 'Brooklyn Bridge Park' },
							{ name: 'Jane’s Carousel' },
							{ name: 'Pebble Beach' },
							{ name: 'Financial District', note: 'Wall Street, Charging Bull, Fearless Girl, Federal Hall (esterno)' }
						]
					},
					{ label: 'Pomeriggio', stops: [{ name: 'Little Italy' }, { name: 'Chinatown' }] },
					{ label: 'Sera', stops: [{ name: 'Traghetto per Staten Island' }] }
				]
			},
			{
				title: 'Shopping e partenza',
				parts: [
					{ label: 'Mattina', stops: [{ name: 'Tempo libero, shopping ed eventuali recuperi' }] },
					{ label: 'Pomeriggio', stops: [{ name: 'Tempo libero' }, { name: 'Rientro in aeroporto' }] }
				]
			}
		],
		attractions: [
			{
				name: 'The Met',
				day: 1,
				time: '3–4 ore',
				price: '30 €',
				hours: '10:00–17:00; venerdì e sabato 10:00–21:00; mercoledì chiuso',
				booking: 'consigliata'
			},
			{
				name: 'Summit One Vanderbilt',
				day: 1,
				time: '1 ora – 1 ora e 30',
				price: '40–50 €',
				hours: '8:00–24:00',
				booking: 'obbligatoria'
			},
			{
				name: 'Guggenheim Museum',
				day: 2,
				time: '1 ora e 30 – 3 ore',
				price: '30 €',
				hours: '10:30–17:30',
				booking: 'consigliata'
			},
			{
				name: 'Top of the Rock',
				day: 2,
				time: '45 min – 1 ora',
				price: '40–70 €',
				hours: '8:00–24:00',
				booking: 'obbligatoria'
			},
			{
				name: 'Museo delle cere',
				day: 3,
				time: '1 ora e 30 – 2 ore',
				price: '34 € online, 44 € in biglietteria',
				hours: 'Da domenica a giovedì 10:00–19:00; venerdì e sabato 10:00–21:00'
			},
			{
				name: 'MoMA',
				day: 3,
				time: '2–4 ore',
				price: '30 €',
				hours: 'Da sabato a giovedì 10:00–17:30; venerdì 10:30–20:30',
				booking: 'obbligatoria'
			},
			{
				name: 'Museo di Storia Naturale',
				day: 4,
				time: '3–4 ore',
				price: '30 €',
				hours: '10:00–17:30',
				booking: 'consigliata',
				notes: ['Ingresso gratuito tutti i giorni dalle 16:30 alle 17:30']
			},
			{
				name: 'Traghetto per Staten Island',
				day: 5,
				time: 'Circa 25 min a tratta',
				price: 'Gratuito',
				notes: ['Si prende al Whitehall Terminal']
			}
		],
		hotels: [
			{
				area: 'Midtown Manhattan',
				places: [
					{ name: 'YOTEL New York', tier: 2 },
					{ name: 'Staypineapple New York', tier: 2 }
				]
			},
			{
				area: 'Financial District / Lower Manhattan',
				places: [{ name: 'Fairfield Inn & Suites by Marriott New York', tier: 3 }]
			},
			{ area: 'Lower East Side', places: [{ name: 'Madison LES Hotel', tier: 1 }] },
			{
				area: 'Long Island City (Queens)',
				places: [
					{ name: 'Romana Hotel', tier: 1 },
					{ name: 'Z NYC Hotel', tier: 1 }
				]
			}
		],
		budget: [
			{
				tier: 1,
				range: '70–100 € al giorno',
				description: 'Pasti semplici, street food e spostamenti soprattutto a piedi.'
			},
			{
				tier: 2,
				range: '100–150 € al giorno',
				description: 'Equilibrio tra spesa e comfort: ristoranti di fascia media, snack e mezzi pubblici.'
			},
			{
				tier: 3,
				range: 'Oltre 150 € al giorno',
				description: 'Più libertà nella scelta di ristoranti, consumazioni, taxi e piccole spese.'
			}
		],
		budgetNote:
			'Stime a persona al giorno per pasti, bevande, piccoli extra e trasporti urbani. Non includono alloggio, voli e biglietti delle attrazioni.',
		attractionsTotal: 'circa 280 € a persona',
		accent: '#3A2119'
	}
];

export const getItinerary = (slug: string) => itineraries.find((i) => i.slug === slug);

export const regionLabel = (region: Region) => REGIONS.find((r) => r.id === region)!.label;

export const daysLabel = (days: number) => (days === 1 ? '1 giorno' : `${days} giorni`);
