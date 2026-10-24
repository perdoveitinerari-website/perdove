<script lang="ts">
	import Seo from '#lib/components/Seo.svelte';
	import Icon from '#lib/components/Icon.svelte';
	import PdfActions from '#lib/components/PdfActions.svelte';
	import ItineraryCard from '#lib/components/ItineraryCard.svelte';
	import { reveal } from '#lib/reveal.ts';
	import { imageSet } from '#lib/images.ts';
	import { site } from '#lib/config.ts';
	import { trackAttrs, EVENTS } from '#lib/analytics.ts';
	import { itineraries, daysLabel, regionLabel, PRICE_TIERS, type PriceTier } from '#lib/data/itineraries.ts';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
	const it = $derived(data.itinerary);
	const wide = $derived(imageSet(`${it.slug}-wide`));
	const cover = $derived(imageSet(`${it.slug}-cover`));
	const others = $derived(itineraries.filter((i) => i.slug !== it.slug));
	const mapsCount = $derived(it.plan.filter((d) => d.map).length);

	const checklist = [
		'Prenotazioni effettuate',
		'Hotel prenotato',
		'Voli o treni prenotati',
		'Mappe salvate',
		'Documenti',
		'Eventuale assicurazione',
		'Controllo degli orari',
		'Controllo di eventuali chiusure'
	];

	const sections = $derived(
		[
			{ id: 'programma', label: 'Programma' },
			{ id: 'attrazioni', label: 'Attrazioni' },
			{ id: 'hotel', label: 'Hotel' },
			it.restaurants && { id: 'ristoranti', label: 'Ristoranti' },
			{ id: 'budget', label: 'Budget' }
		].filter(Boolean) as { id: string; label: string }[]
	);

	const euros = (tier: PriceTier) => '€'.repeat(tier);

	const PART_ICONS: Record<string, string> = {
		Mattina: 'sunrise',
		Pomeriggio: 'sun',
		Sera: 'moon',
		'Tutta la giornata': 'calendar'
	};

	// Mobile sticky download bar: visible once the hero buttons scroll out of view.
	let heroActions: HTMLElement | undefined = $state();
	let showBar = $state(false);
	$effect(() => {
		if (!heroActions) return;
		const io = new IntersectionObserver(([e]) => (showBar = !e.isIntersecting && e.boundingClientRect.top < 0));
		io.observe(heroActions);
		return () => io.disconnect();
	});

	const description = $derived(
		`${it.title}: itinerario gratuito in PDF con programma giorno per giorno, ${mapsCount} mappe interattive, tempi di visita, prezzi, hotel${it.restaurants ? ', ristoranti' : ''} e budget. Scaricalo gratis.`
	);

	const jsonLd = $derived([
		{
			'@context': 'https://schema.org',
			'@type': 'TouristTrip',
			name: it.title,
			description: it.summary,
			inLanguage: 'it-IT',
			url: `${site.url}/itinerari/${it.slug}`,
			image: `${site.url}/og/${it.slug}.jpg`,
			provider: { '@type': 'Organization', name: site.name, url: site.url },
			offers: { '@type': 'Offer', price: 0, priceCurrency: 'EUR', availability: 'https://schema.org/InStock' },
			itinerary: {
				'@type': 'ItemList',
				itemListElement: it.plan.map((day, i) => ({
					'@type': 'ListItem',
					position: i + 1,
					name: `Giorno ${i + 1}: ${day.title}`
				}))
			}
		},
		{
			'@context': 'https://schema.org',
			'@type': 'BreadcrumbList',
			itemListElement: [
				{ '@type': 'ListItem', position: 1, name: 'Home', item: site.url },
				{ '@type': 'ListItem', position: 2, name: 'Itinerari', item: `${site.url}/itinerari` },
				{ '@type': 'ListItem', position: 3, name: it.title, item: `${site.url}/itinerari/${it.slug}` }
			]
		}
	]);
</script>

<Seo
	title={`${it.title} – Itinerario gratuito in PDF`}
	{description}
	image={`/og/${it.slug}.jpg`}
	imageAlt={`Foto di ${it.city}, itinerario PerDove ${it.title}`}
	type="article"
	{jsonLd}
/>

<!-- HERO -->
<section class="hero" aria-labelledby="it-title">
	<img
		class="hero-img"
		src={wide.src}
		srcset={wide.srcset}
		sizes="100vw"
		width={wide.width}
		height={wide.height}
		alt=""
		fetchpriority="high"
	/>
	<div class="hero-shade" aria-hidden="true"></div>
	<div class="container hero-inner">
		<nav class="crumbs" aria-label="Percorso di navigazione">
			<ol>
				<li><a href="/">Home</a></li>
				<li><a href="/itinerari">Itinerari</a></li>
				<li aria-current="page">{it.city}</li>
			</ol>
		</nav>
		<p class="tags">
			<span>{regionLabel(it.region)}</span>
			{#if it.country !== regionLabel(it.region)}<span>{it.country}</span>{/if}
		</p>
		<h1 id="it-title">{it.title}</h1>
		<p class="tagline">{it.tagline}</p>
		<ul class="facts">
			<li><Icon name="calendar" size={18} />{daysLabel(it.days)}</li>
			<li><Icon name="map" size={18} />{mapsCount} mappe interattive</li>
			<li><Icon name="book" size={18} />PDF · {it.pdf.pages} pagine · {it.pdf.sizeMb.toLocaleString('it-IT')} MB</li>
		</ul>
		<div bind:this={heroActions}>
			<PdfActions itinerary={it} position="hero" tone="light" />
		</div>
	</div>
</section>

<!-- In-page navigation -->
<nav class="subnav" aria-label="Sezioni dell’itinerario">
	<div class="container">
		<ul>
			{#each sections as s (s.id)}
				<li><a href={`#${s.id}`}>{s.label}</a></li>
			{/each}
		</ul>
	</div>
</nav>

<!-- OVERVIEW -->
<section class="section overview" aria-labelledby="overview-title">
	<div class="container overview-grid">
		<div {@attach reveal()}>
			<p class="eyebrow">Panoramica</p>
			<h2 id="overview-title">{it.summary}</h2>
			{#each it.intro as paragraph, i (i)}
				<p class="intro">{paragraph}</p>
			{/each}

			<h3 class="included-title">Cosa trovi nel PDF</h3>
			<ul class="included">
				{#each it.features as feature (feature)}
					<li><span class="tick"><Icon name="check" size={16} /></span>{feature}</li>
				{/each}
			</ul>
		</div>

		<aside class="pdf-card" aria-label="Scarica l’itinerario" {@attach reveal(120)}>
			<img
				src={cover.src}
				srcset={cover.srcset}
				sizes="(max-width: 900px) 70vw, 340px"
				width={cover.width}
				height={cover.height}
				alt={`Copertina del PDF ${it.title}`}
				loading="lazy"
				decoding="async"
			/>
			<div class="pdf-card-body">
				<p class="pdf-card-title">Itinerario completo in PDF</p>
				<p class="pdf-card-meta">{it.pdf.pages} pagine · {it.pdf.sizeMb.toLocaleString('it-IT')} MB · gratuito</p>
				<PdfActions itinerary={it} position="scheda" />
				<p class="pdf-card-note">Nessuna registrazione richiesta.</p>
			</div>
		</aside>
	</div>
</section>

<!-- DAY BY DAY -->
<section class="section plan" id="programma" aria-labelledby="plan-title">
	<div class="container">
		<header class="section-head" {@attach reveal()}>
			<p class="eyebrow">Giorno per giorno</p>
			<h2 id="plan-title">Il programma</h2>
			<p class="lead">
				Ogni giornata è divisa in mattina, pomeriggio e sera: puoi modificare liberamente ordine e tempi delle visite in
				base alle tue esigenze.
			</p>
		</header>

		<ol class="timeline">
			{#each it.plan as day, i (day.title)}
				<li class="day" {@attach reveal(60)}>
					<div class="day-marker" aria-hidden="true">
						<span>{i + 1}</span>
					</div>
					<article class="day-card">
						<header class="day-head">
							<p class="day-label">Giorno {i + 1}</p>
							<h3>{day.title}</h3>
						</header>
						<dl class="parts">
							{#each day.parts as part (part.label)}
								<div class="part">
									<dt>
										<Icon name={PART_ICONS[part.label]} size={16} />
										{part.label}
									</dt>
									<dd>
										<ul>
											{#each part.stops as stop (stop.name)}
												<li>
													{stop.name}{#if stop.note}<span class="note"> · {stop.note}</span>{/if}
												</li>
											{/each}
										</ul>
									</dd>
								</div>
							{/each}
						</dl>
						{#if day.map}
							<a
								class="link-arrow map-link"
								href={day.map}
								target="_blank"
								rel="noopener noreferrer"
								{...trackAttrs(EVENTS.map, { itinerario: it.slug, giorno: i + 1 })}
							>
								<Icon name="map" />
								Apri la mappa interattiva del giorno {i + 1}
								<span class="visually-hidden">(Wanderlog, si apre in una nuova scheda)</span>
								<Icon name="external" size={16} />
							</a>
						{/if}
					</article>
				</li>
			{/each}
		</ol>
	</div>
</section>

<!-- ATTRACTIONS -->
<section class="section attractions" id="attrazioni" aria-labelledby="attr-title">
	<div class="container">
		<header class="section-head" {@attach reveal()}>
			<p class="eyebrow">Informazioni pratiche</p>
			<h2 id="attr-title">Attrazioni: tempi, prezzi e orari</h2>
			<p class="lead">
				Tutto quello che serve per organizzarti, con le attrazioni da prenotare in anticipo ben evidenziate.
			</p>
		</header>
		<ul class="attr-grid">
			{#each it.attractions as a, i (a.name)}
				<li class="attr" {@attach reveal((i % 3) * 70)}>
					<header>
						{#if a.day}<span class="attr-day">Giorno {a.day}</span>{/if}
						{#if a.booking}
							<span class="booking" class:required={a.booking === 'obbligatoria'}>
								Prenotazione {a.booking}
							</span>
						{/if}
					</header>
					<h3>{a.name}</h3>
					<dl>
						{#if a.time}
							<div><dt><Icon name="clock" size={17} /><span class="visually-hidden">Tempo di visita</span></dt><dd>{a.time}</dd></div>
						{/if}
						{#if a.price}
							<div><dt><Icon name="ticket" size={17} /><span class="visually-hidden">Prezzo</span></dt><dd>{a.price}</dd></div>
						{/if}
						{#if a.hours}
							<div><dt><Icon name="calendar" size={17} /><span class="visually-hidden">Orari</span></dt><dd>{a.hours}</dd></div>
						{/if}
					</dl>
					{#if a.notes}
						{#each a.notes as note (note)}
							<p class="attr-note">{note}</p>
						{/each}
					{/if}
				</li>
			{/each}
		</ul>
		<p class="disclaimer">
			<Icon name="alert" size={18} />
			Prezzi e orari sono indicativi e possono cambiare: verifica sempre sui siti ufficiali prima di partire.
		</p>
	</div>
</section>

<!-- HOTELS + RESTAURANTS -->
<section class="section stay" aria-label="Dove dormire e dove mangiare">
	<div class="container stay-grid" class:single={!it.restaurants}>
		<div id="hotel" class="stay-col" {@attach reveal()}>
			<p class="eyebrow">Dove dormire</p>
			<h2>Hotel consigliati</h2>
			{@render areaList(it.hotels, 'bed')}
		</div>
		{#if it.restaurants}
			<div id="ristoranti" class="stay-col" {@attach reveal(100)}>
				<p class="eyebrow">Dove mangiare</p>
				<h2>Ristoranti consigliati</h2>
				{@render areaList(it.restaurants, 'fork')}
			</div>
		{/if}
	</div>
	<p class="container tiers">
		{#each [1, 2, 3] as const as t (t)}
			<span><strong>{euros(t)}</strong> {PRICE_TIERS[t]}</span>
		{/each}
	</p>

	{#if it.food}
		<div class="container" {@attach reveal()}>
			<div class="food">
				<div>
					<p class="eyebrow">Sapori locali</p>
					<h2>Cibi tipici da assaggiare</h2>
					<ul class="dishes">
						{#each it.food.dishes as dish (dish)}
							<li>{dish}</li>
						{/each}
					</ul>
				</div>
				<div class="food-places">
					<h3>Ristoranti tipici dove mangiarli</h3>
					<ul>
						{#each it.food.places as place (place)}
							<li><Icon name="fork" size={18} />{place}</li>
						{/each}
					</ul>
				</div>
			</div>
		</div>
	{/if}
</section>

{#snippet areaList(areas: typeof it.hotels, icon: string)}
	<ul class="areas">
		{#each areas as area (area.area)}
			<li class="area">
				<h3><Icon name="pin" size={17} />{area.area}</h3>
				<ul>
					{#each area.places as place (place.name)}
						<li>
							<span class="place"><Icon name={icon} size={17} />{place.name}</span>
							<span class="tier" title={PRICE_TIERS[place.tier]}>
								<span aria-hidden="true">{euros(place.tier)}</span>
								<span class="visually-hidden">{PRICE_TIERS[place.tier]}</span>
							</span>
						</li>
					{/each}
				</ul>
			</li>
		{/each}
	</ul>
{/snippet}

<!-- BUDGET + CHECKLIST -->
<section class="section budget" id="budget" aria-labelledby="budget-title">
	<div class="container">
		<header class="section-head" {@attach reveal()}>
			<p class="eyebrow">Quanto costa</p>
			<h2 id="budget-title">Budget indicativo</h2>
			<p class="lead">{it.budgetNote}</p>
		</header>
		<ul class="budget-grid">
			{#each it.budget as b, i (b.tier)}
				<li class="budget-card" class:featured={b.tier === 2} {@attach reveal(i * 90)}>
					<p class="budget-tier">{euros(b.tier)} · {PRICE_TIERS[b.tier]}</p>
					<p class="budget-range">{b.range}</p>
					<p>{b.description}</p>
				</li>
			{/each}
		</ul>
		<p class="total" {@attach reveal()}>
			<Icon name="ticket" />
			<span>Costo indicativo dei biglietti delle attrazioni incluse nell’itinerario: <strong>{it.attractionsTotal}</strong></span>
		</p>

		<div class="checklist" {@attach reveal()}>
			<div>
				<p class="eyebrow">Prima di partire</p>
				<h2>La checklist</h2>
				<p>Anche questa la trovi nel PDF, pronta da spuntare.</p>
			</div>
			<ul>
				{#each checklist as item (item)}
					<li><span class="tick"><Icon name="check" size={16} /></span>{item}</li>
				{/each}
			</ul>
		</div>
	</div>
</section>

<!-- DOWNLOAD CTA -->
<section class="download" aria-labelledby="download-title">
	<div class="container">
		<div class="download-card" {@attach reveal()}>
			<div>
				<h2 id="download-title">Buon viaggio e buona scoperta di {it.city}!</h2>
				<p>Porta l’itinerario sempre con te: scaricalo sul telefono e consultalo anche offline.</p>
			</div>
			<PdfActions itinerary={it} position="cta-finale" tone="light" />
		</div>
	</div>
</section>

<!-- OTHER ITINERARIES -->
{#if others.length}
	<section class="section others" aria-labelledby="others-title">
		<div class="container">
			<header class="section-head" {@attach reveal()}>
				<p class="eyebrow">Continua a esplorare</p>
				<h2 id="others-title">Altri itinerari</h2>
			</header>
			<ul class="others-grid">
				{#each others as other, i (other.slug)}
					<li {@attach reveal(i * 90)}><ItineraryCard itinerary={other} /></li>
				{/each}
			</ul>
		</div>
	</section>
{/if}

<div class="sticky-bar" class:show={showBar} aria-hidden={!showBar} inert={!showBar}>
	<PdfActions itinerary={it} position="barra-mobile" compact />
</div>

<style>
	/* ---------- Hero ---------- */
	.hero {
		position: relative;
		display: flex;
		align-items: flex-end;
		min-height: min(88svh, 760px);
		margin-top: calc(-1 * var(--header-h));
		padding: calc(var(--header-h) + 3rem) 0 clamp(2.5rem, 6vw, 4.5rem);
		color: #fff;
		overflow: hidden;
		isolation: isolate;
	}

	.hero-img {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		object-fit: cover;
		z-index: -2;
		animation: ken-burns 18s ease-out both;
	}

	@keyframes ken-burns {
		from {
			transform: scale(1.12);
		}
	}

	.hero-shade {
		position: absolute;
		inset: 0;
		z-index: -1;
		background:
			linear-gradient(180deg, rgb(251 247 242 / 0.85) 0, rgb(251 247 242 / 0) calc(var(--header-h) + 40px)),
			linear-gradient(0deg, rgb(30 16 12 / 0.88) 0%, rgb(30 16 12 / 0.45) 50%, rgb(30 16 12 / 0.1) 80%);
	}

	.hero-inner > * {
		animation: rise 0.9s var(--ease-out) both;
	}

	.hero-inner > :nth-child(2) {
		animation-delay: 60ms;
	}
	.hero-inner > :nth-child(3) {
		animation-delay: 120ms;
	}
	.hero-inner > :nth-child(4) {
		animation-delay: 180ms;
	}
	.hero-inner > :nth-child(5) {
		animation-delay: 240ms;
	}
	.hero-inner > :nth-child(6) {
		animation-delay: 300ms;
	}

	@keyframes rise {
		from {
			opacity: 0;
			transform: translateY(20px);
		}
	}

	.crumbs ol {
		display: flex;
		flex-wrap: wrap;
		gap: 0.4rem;
		list-style: none;
		margin: 0 0 1.25rem;
		padding: 0;
		font-size: 0.9rem;
		color: #f1e4da;
	}

	.crumbs li + li::before {
		content: '/';
		margin-right: 0.4rem;
		opacity: 0.6;
	}

	.crumbs a {
		color: #fff;
	}

	.tags {
		display: flex;
		gap: 0.5rem;
		margin-bottom: 1rem;
	}

	.tags span {
		padding: 0.3rem 0.85rem;
		border-radius: 999px;
		background: rgb(255 255 255 / 0.16);
		border: 1px solid rgb(255 255 255 / 0.35);
		backdrop-filter: blur(6px);
		font-size: 0.8rem;
		font-weight: 800;
		letter-spacing: 0.08em;
		text-transform: uppercase;
	}

	.hero h1 {
		font-size: clamp(2.6rem, 1.6rem + 4.4vw, 5.2rem);
		color: #fff;
		margin-bottom: 0.75rem;
		text-shadow: 0 2px 30px rgb(0 0 0 / 0.25);
	}

	.tagline {
		max-width: 46ch;
		font-size: var(--step-1);
		color: #f6ece5;
	}

	.facts {
		display: flex;
		flex-wrap: wrap;
		gap: 0.6rem 1.5rem;
		list-style: none;
		margin: 0 0 2rem;
		padding: 0;
		font-weight: 600;
		font-size: 0.95rem;
	}

	.facts li {
		display: inline-flex;
		align-items: center;
		gap: 0.45rem;
	}

	/* ---------- Sub navigation ---------- */
	.subnav {
		position: sticky;
		top: var(--header-h);
		z-index: 20;
		background: rgb(251 247 242 / 0.92);
		backdrop-filter: blur(12px);
		-webkit-backdrop-filter: blur(12px);
		border-bottom: 1px solid var(--line);
	}

	.subnav ul {
		display: flex;
		gap: 0.25rem;
		list-style: none;
		margin: 0;
		padding: 0.5rem 0;
		overflow-x: auto;
		scrollbar-width: none;
	}

	.subnav a {
		display: block;
		padding: 0.5rem 0.95rem;
		border-radius: 999px;
		color: var(--espresso);
		font-weight: 700;
		font-size: 0.92rem;
		text-decoration: none;
		white-space: nowrap;
		transition: background-color 0.2s;
	}

	.subnav a:hover {
		background: var(--sand);
	}

	/* ---------- Overview ---------- */
	.overview-grid {
		display: grid;
		grid-template-columns: 1fr 360px;
		gap: clamp(2rem, 6vw, 5rem);
		align-items: start;
	}

	.overview h2 {
		font-size: var(--step-2);
		line-height: 1.3;
	}

	.intro {
		color: var(--text-muted);
		font-size: 1.05rem;
	}

	.included-title {
		margin-top: 2rem;
	}

	.included {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 0.75rem 1.5rem;
		list-style: none;
		margin: 0;
		padding: 0;
	}

	.included li,
	.checklist li {
		display: flex;
		align-items: flex-start;
		gap: 0.65rem;
		font-weight: 600;
	}

	.tick {
		display: grid;
		place-items: center;
		flex: none;
		width: 26px;
		height: 26px;
		margin-top: 0.05rem;
		border-radius: 50%;
		background: var(--glacier);
		color: var(--chambray-ink);
	}

	.pdf-card {
		position: sticky;
		top: calc(var(--header-h) + 72px);
		background: var(--surface);
		border-radius: var(--radius-l);
		box-shadow: var(--shadow);
		overflow: hidden;
	}

	.pdf-card img {
		width: 100%;
		aspect-ratio: 4 / 3;
		object-fit: cover;
		object-position: top;
	}

	.pdf-card-body {
		padding: 1.5rem;
	}

	.pdf-card-title {
		font-family: var(--font-display);
		font-size: var(--step-1);
		margin-bottom: 0.2rem;
	}

	.pdf-card-meta,
	.pdf-card-note {
		font-size: 0.9rem;
		color: var(--text-muted);
	}

	.pdf-card-note {
		margin: 0.9rem 0 0;
	}

	.pdf-card :global(.actions) {
		flex-direction: column;
	}

	/* ---------- Timeline ---------- */
	.plan {
		background: var(--sand);
		border-radius: clamp(28px, 5vw, 56px);
		margin-inline: clamp(0px, 2vw, 24px);
	}

	.timeline {
		position: relative;
		list-style: none;
		margin: 0;
		padding: 0;
		display: grid;
		gap: 1.5rem;
	}

	.timeline::before {
		content: '';
		position: absolute;
		left: 27px;
		top: 20px;
		bottom: 20px;
		border-left: 2px dashed var(--clay);
		opacity: 0.45;
	}

	.day {
		display: grid;
		grid-template-columns: 56px 1fr;
		gap: clamp(1rem, 3vw, 2rem);
	}

	.day-marker span {
		position: relative;
		display: grid;
		place-items: center;
		width: 56px;
		height: 56px;
		border-radius: 50%;
		background: var(--espresso);
		color: #fff;
		font-family: var(--font-display);
		font-size: 1.4rem;
		box-shadow: 0 0 0 6px var(--sand);
	}

	.day-card {
		background: var(--surface);
		border-radius: var(--radius-l);
		padding: clamp(1.25rem, 3vw, 2rem);
		box-shadow: var(--shadow-s);
	}

	.day-label {
		margin: 0 0 0.2rem;
		font-size: 0.8rem;
		font-weight: 800;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		color: var(--clay-ink);
	}

	.day-head h3 {
		font-size: var(--step-2);
	}

	.parts {
		display: grid;
		gap: 0.9rem;
		margin: 1rem 0 0;
	}

	.part {
		display: grid;
		grid-template-columns: 170px 1fr;
		gap: 1rem;
		padding-top: 0.9rem;
		border-top: 1px solid var(--line);
	}

	.part dt {
		display: inline-flex;
		align-items: center;
		gap: 0.45rem;
		align-self: start;
		font-weight: 800;
		font-size: 0.9rem;
		color: var(--chambray-ink);
	}

	.part dd {
		margin: 0;
	}

	.part ul {
		list-style: none;
		margin: 0;
		padding: 0;
		display: flex;
		flex-wrap: wrap;
		gap: 0.45rem;
	}

	.part li {
		padding: 0.3rem 0.8rem;
		border-radius: 999px;
		background: var(--bg);
		border: 1px solid var(--line);
		font-weight: 600;
		font-size: 0.95rem;
	}

	.note {
		font-weight: 500;
		color: var(--text-muted);
	}

	.map-link {
		margin-top: 1.25rem;
		color: var(--chambray-ink);
	}

	/* ---------- Attractions ---------- */
	.attr-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(min(100%, 300px), 1fr));
		gap: 1.25rem;
		list-style: none;
		margin: 0;
		padding: 0;
	}

	.attr {
		padding: 1.5rem;
		background: var(--surface);
		border: 1px solid var(--line);
		border-radius: var(--radius-l);
		transition:
			transform 0.4s var(--ease-out),
			box-shadow 0.4s var(--ease-out);
	}

	.attr:hover {
		transform: translateY(-4px);
		box-shadow: var(--shadow);
	}

	.attr header {
		display: flex;
		flex-wrap: wrap;
		gap: 0.4rem;
		margin-bottom: 0.8rem;
	}

	.attr-day,
	.booking {
		padding: 0.2rem 0.65rem;
		border-radius: 999px;
		font-size: 0.75rem;
		font-weight: 800;
		letter-spacing: 0.04em;
	}

	.attr-day {
		background: var(--sand);
		color: var(--espresso);
	}

	.booking {
		background: var(--glacier);
		color: var(--chambray-ink);
	}

	.booking.required {
		background: #f6dccd;
		color: #8a3f1e;
	}

	.attr dl {
		display: grid;
		gap: 0.5rem;
		margin: 0;
	}

	.attr dl div {
		display: grid;
		grid-template-columns: 24px 1fr;
		gap: 0.5rem;
		font-size: 0.95rem;
	}

	.attr dt {
		color: var(--clay-ink);
		padding-top: 0.15rem;
	}

	.attr dd {
		margin: 0;
	}

	.attr-note {
		margin: 0.75rem 0 0;
		padding: 0.55rem 0.8rem;
		border-radius: var(--radius-s);
		background: var(--bisque-soft);
		font-size: 0.88rem;
	}

	.disclaimer {
		display: flex;
		align-items: center;
		gap: 0.6rem;
		margin-top: 1.75rem;
		font-size: 0.92rem;
		color: var(--text-muted);
	}

	/* ---------- Stay ---------- */
	.stay {
		padding-top: 0;
	}

	.stay-grid {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: clamp(1.5rem, 4vw, 3rem);
	}

	.stay-grid.single {
		grid-template-columns: minmax(0, 720px);
	}

	.stay-col {
		padding: clamp(1.5rem, 3vw, 2.25rem);
		background: var(--surface);
		border-radius: var(--radius-l);
		box-shadow: var(--shadow-s);
	}

	.stay-col h2 {
		font-size: var(--step-2);
	}

	.areas {
		list-style: none;
		margin: 0;
		padding: 0;
	}

	.area {
		padding: 1rem 0;
		border-top: 1px solid var(--line);
	}

	.area h3 {
		display: flex;
		align-items: center;
		gap: 0.4rem;
		font-family: var(--font-body);
		font-size: 0.82rem;
		font-weight: 800;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		color: var(--clay-ink);
		margin-bottom: 0.6rem;
	}

	.area ul {
		list-style: none;
		margin: 0;
		padding: 0;
		display: grid;
		gap: 0.45rem;
	}

	.area li {
		display: flex;
		justify-content: space-between;
		gap: 1rem;
		font-weight: 600;
	}

	.place {
		display: inline-flex;
		align-items: flex-start;
		gap: 0.5rem;
	}

	.place :global(svg) {
		margin-top: 0.25rem;
		color: var(--chambray-ink);
		flex: none;
	}

	.tier {
		flex: none;
		color: var(--clay-ink);
		font-weight: 800;
		letter-spacing: 0.08em;
	}

	.tiers {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem 1.5rem;
		margin-top: 1.25rem;
		font-size: 0.9rem;
		color: var(--text-muted);
	}

	.tiers strong {
		color: var(--clay-ink);
	}

	.food {
		display: grid;
		grid-template-columns: 1.4fr 1fr;
		gap: 2rem;
		margin-top: clamp(1.5rem, 4vw, 3rem);
		padding: clamp(1.5rem, 4vw, 2.75rem);
		border-radius: var(--radius-l);
		background: linear-gradient(135deg, var(--glacier-soft), var(--bisque-soft));
	}

	.food h2 {
		font-size: var(--step-2);
	}

	.dishes {
		display: flex;
		flex-wrap: wrap;
		gap: 0.55rem;
		list-style: none;
		margin: 0;
		padding: 0;
	}

	.dishes li {
		padding: 0.5rem 1rem;
		border-radius: 999px;
		background: var(--surface);
		font-family: var(--font-display);
		font-size: 1.1rem;
		box-shadow: var(--shadow-s);
	}

	.food-places ul {
		list-style: none;
		margin: 0;
		padding: 0;
		display: grid;
		gap: 0.6rem;
		font-weight: 600;
	}

	.food-places li {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	/* ---------- Budget ---------- */
	.budget {
		padding-top: 0;
	}

	.budget-grid {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 1.25rem;
		list-style: none;
		margin: 0;
		padding: 0;
	}

	.budget-card {
		padding: 1.75rem;
		border-radius: var(--radius-l);
		background: var(--surface);
		border: 1px solid var(--line);
	}

	.budget-card.featured {
		background: var(--espresso);
		color: #f3e7dc;
		border-color: var(--espresso);
	}

	.budget-tier {
		font-size: 0.8rem;
		font-weight: 800;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		color: var(--clay-ink);
	}

	.featured .budget-tier {
		color: var(--bisque);
	}

	.budget-range {
		font-family: var(--font-display);
		font-size: var(--step-2);
		line-height: 1.2;
		margin-bottom: 0.6rem;
	}

	.featured .budget-range {
		color: #fff;
	}

	.budget-card p:last-child {
		margin: 0;
		font-size: 0.95rem;
	}

	.total {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		margin: 1.5rem 0 0;
		padding: 1rem 1.25rem;
		border-radius: var(--radius);
		background: var(--glacier-soft);
		color: var(--espresso);
	}

	.total :global(svg) {
		flex: none;
		color: var(--chambray-ink);
	}

	.checklist {
		display: grid;
		grid-template-columns: 1fr 1.3fr;
		gap: 2rem;
		margin-top: clamp(3rem, 7vw, 5rem);
		padding: clamp(1.5rem, 4vw, 2.75rem);
		border: 2px dashed var(--bisque);
		border-radius: var(--radius-l);
	}

	.checklist h2 {
		font-size: var(--step-2);
	}

	.checklist ul {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 0.8rem 1.5rem;
		list-style: none;
		margin: 0;
		padding: 0;
		align-content: center;
	}

	/* ---------- Download CTA ---------- */
	.download-card {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		justify-content: space-between;
		gap: 1.5rem 3rem;
		padding: clamp(2rem, 5vw, 3.5rem);
		border-radius: clamp(28px, 4vw, 44px);
		background:
			radial-gradient(500px 260px at 100% 0%, rgb(121 163 195 / 0.45), transparent 70%),
			linear-gradient(135deg, #4a2c22, var(--espresso));
		color: #f3e7dc;
	}

	.download-card h2 {
		color: #fff;
		font-size: var(--step-3);
		max-width: 20ch;
	}

	.download-card p {
		margin: 0;
	}

	/* ---------- Others ---------- */
	.others-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(min(100%, 320px), 1fr));
		gap: 1.5rem;
		list-style: none;
		margin: 0;
		padding: 0;
	}

	/* ---------- Mobile sticky CTA ---------- */
	.sticky-bar {
		display: none;
	}

	@media (max-width: 900px) {
		.overview-grid,
		.stay-grid,
		.food,
		.checklist {
			grid-template-columns: 1fr;
		}

		.pdf-card {
			position: static;
			max-width: 420px;
		}

		.sticky-bar {
			display: block;
			position: fixed;
			left: 0;
			right: 0;
			bottom: 0;
			z-index: 40;
			padding: 0.75rem var(--gutter) calc(0.75rem + env(safe-area-inset-bottom));
			background: rgb(251 247 242 / 0.94);
			backdrop-filter: blur(14px);
			-webkit-backdrop-filter: blur(14px);
			box-shadow: 0 -1px 0 var(--line), 0 -10px 30px -12px rgb(58 33 25 / 0.25);
			transform: translateY(110%);
			transition: transform 0.45s var(--ease-out);
		}

		.sticky-bar.show {
			transform: none;
		}
	}

	@media (max-width: 720px) {
		.budget-grid,
		.included,
		.checklist ul {
			grid-template-columns: 1fr;
		}

		.part {
			grid-template-columns: 1fr;
			gap: 0.5rem;
		}

		.timeline::before {
			left: 19px;
		}

		.day {
			grid-template-columns: 40px 1fr;
			gap: 0.85rem;
		}

		.day-marker span {
			width: 40px;
			height: 40px;
			font-size: 1.1rem;
		}
	}
</style>
