<script lang="ts">
	import Seo from '#lib/components/Seo.svelte';
	import HeroScene from '#lib/components/HeroScene.svelte';
	import ItineraryBrowser from '#lib/components/ItineraryBrowser.svelte';
	import Icon from '#lib/components/Icon.svelte';
	import { reveal } from '#lib/reveal.ts';
	import { imageSet } from '#lib/images.ts';
	import { site } from '#lib/config.ts';
	import { itineraries } from '#lib/data/itineraries.ts';
	import { trackAttrs, EVENTS } from '#lib/analytics.ts';

	const banner = imageSet('brand-banner');

	const features = [
		{ icon: 'calendar', title: 'Itinerari organizzati per giornate', text: 'Ogni giorno è diviso in mattina, pomeriggio e sera, con un ordine logico delle tappe.' },
		{ icon: 'pin', title: 'Attrazioni e luoghi da non perdere', text: 'Le tappe imperdibili di ogni destinazione, con orari e prezzi indicativi.' },
		{ icon: 'bed', title: 'Consigli su hotel e ristoranti', text: 'Hotel divisi per zona e ristoranti consigliati, quando presenti nell’itinerario.' },
		{ icon: 'map', title: 'Mappe interattive', text: 'Quando disponibili, ti mostrano tutte le tappe della giornata con un tocco.' },
		{ icon: 'clock', title: 'Tempi di visita indicativi', text: 'Per pianificare le giornate con flessibilità, senza correre e senza tempi morti.' },
		{ icon: 'wallet', title: 'Budget e checklist', text: 'Una stima delle spese giornaliere e una lista di controllo prima di partire.' }
	];

	const steps = [
		{ n: '01', title: 'Scegli la destinazione', text: 'Filtra per Italia, Europa o Resto del mondo e trova l’itinerario che fa per te.' },
		{ n: '02', title: 'Consulta o scarica il PDF', text: 'Sfoglialo online o salvalo sul telefono: è gratis e non serve registrarsi.' },
		{ n: '03', title: 'Parti senza pensieri', text: 'Segui le giornate, apri le mappe interattive e goditi il viaggio con i tuoi tempi.' }
	];

	const jsonLd = [
		{
			'@context': 'https://schema.org',
			'@type': 'Organization',
			name: site.name,
			url: site.url,
			logo: `${site.url}/logo-perdove.png`,
			email: site.email,
			sameAs: [site.social.instagram, site.social.tiktok]
		},
		{
			'@context': 'https://schema.org',
			'@type': 'WebSite',
			name: site.name,
			url: site.url,
			inLanguage: 'it-IT'
		}
	];
</script>

<Seo
	title="PerDove – Itinerari di viaggio gratuiti in PDF"
	description="Itinerari di viaggio pratici e curati, organizzati giorno per giorno, con mappe interattive, tempi di visita e consigli. Scaricali gratis in PDF, senza registrazione."
	{jsonLd}
/>

<!-- HERO -->
<section class="hero" aria-labelledby="hero-title">
	<div class="sky" aria-hidden="true"><span class="sun"></span></div>
	<div class="container hero-copy">
		<p class="eyebrow hero-in" style:--d="0ms">Itinerari di viaggio gratuiti</p>
		<h1 id="hero-title" class="hero-in" style:--d="90ms">
			Itinerari che ti portano <em>lontano</em>
		</h1>
		<p class="lead hero-in" style:--d="180ms">
			Itinerari digitali pratici e curati, organizzati giorno per giorno. Consultali online o scaricali gratis in PDF e
			parti senza pensieri.
		</p>
		<div class="btn-row hero-in" style:--d="270ms">
			<a class="btn" href="/itinerari" {...trackAttrs(EVENTS.cta, { posizione: 'hero' })}>
				Scopri gli itinerari
				<Icon name="arrow" />
			</a>
			<a
				class="btn btn-outline"
				href="/contatti?argomento=personalizzato#modulo"
				{...trackAttrs(EVENTS.cta, { posizione: 'hero-personalizzato' })}
			>
				<Icon name="compass" />
				Itinerario personalizzato
			</a>
			<a class="btn btn-outline" href="#come-funziona">Come funziona</a>
		</div>
		<ul class="trust hero-in" style:--d="360ms">
			<li><Icon name="check" size={18} />100% gratuiti</li>
			<li><Icon name="check" size={18} />Nessuna registrazione</li>
			<li><Icon name="check" size={18} />PDF da portare con te</li>
		</ul>
	</div>
	<div class="scene-wrap">
		<HeroScene />
	</div>
</section>

<!-- DESTINATIONS + FILTERS -->
<section class="section destinations" id="itinerari" aria-labelledby="dest-title">
	<div class="container">
		<header class="section-head center" {@attach reveal()}>
			<p class="eyebrow">Dove vuoi andare?</p>
			<h2 id="dest-title">Scegli la tua prossima meta</h2>
			<p class="lead">
				{itineraries.length} itinerari completi, pronti da consultare o scaricare. Filtra per destinazione e lasciati ispirare.
			</p>
		</header>
		<div {@attach reveal(100)}>
			<ItineraryBrowser />
		</div>
	</div>
</section>

<!-- WELCOME -->
<section class="section welcome" aria-labelledby="welcome-title">
	<div class="container welcome-grid">
		<div class="welcome-copy" {@attach reveal()}>
			<p class="eyebrow">Benvenuti su PerDove</p>
			<h2 id="welcome-title">Il viaggio dei tuoi sogni, senza ore di pianificazione</h2>
			<p>
				Ami viaggiare, ma organizzare un viaggio da zero ti porta via troppo tempo? <strong>PerDove</strong> nasce per
				aiutarti a scoprire nuove destinazioni con itinerari digitali pratici, curati e facili da consultare, pensati per
				rendere l’organizzazione del tuo prossimo viaggio più semplice e piacevole.
			</p>
			<blockquote class="goal">
				<p class="goal-label">Il nostro obiettivo</p>
				<p>
					Aiutarti a risparmiare tempo nella preparazione del viaggio, per lasciarti più spazio per goderti la destinazione
					e vivere nuove esperienze.
				</p>
			</blockquote>
			<p class="muted">
				Tutti gli itinerari sono disponibili <strong>gratuitamente in formato PDF</strong>: puoi consultarli online o
				portarli con te durante il viaggio.
			</p>
		</div>
		<figure class="welcome-media" {@attach reveal(120)}>
			<img
				src={banner.src}
				srcset={banner.srcset}
				sizes="(max-width: 900px) 92vw, 560px"
				width={banner.width}
				height={banner.height}
				alt="Logo PerDove su uno sfondo illustrato con mappamondo, francobollo e aerei in volo"
				loading="lazy"
				decoding="async"
			/>
			<figcaption>
				<span class="stamp" aria-hidden="true"><Icon name="heart" size={18} /></span>
				Creati per passione, gratuiti per sempre.
			</figcaption>
		</figure>
	</div>
</section>

<!-- WHAT YOU FIND -->
<section class="section features" aria-labelledby="features-title">
	<div class="container">
		<header class="section-head center" {@attach reveal()}>
			<p class="eyebrow">Cosa trovi su PerDove</p>
			<h2 id="features-title">Tutto quello che serve, in un unico itinerario</h2>
		</header>
		<ul class="feature-grid">
			{#each features as f, i (f.title)}
				<li class="feature" {@attach reveal(i * 70)}>
					<span class="feature-icon"><Icon name={f.icon} size={24} /></span>
					<h3>{f.title}</h3>
					<p>{f.text}</p>
				</li>
			{/each}
		</ul>
	</div>
</section>

<!-- HOW IT WORKS -->
<section class="section how" id="come-funziona" aria-labelledby="how-title">
	<div class="container">
		<header class="section-head center" {@attach reveal()}>
			<p class="eyebrow">Come funziona</p>
			<h2 id="how-title">Dalla scelta alla partenza in tre passi</h2>
		</header>
		<ol class="steps">
			{#each steps as s, i (s.n)}
				<li class="step" {@attach reveal(i * 120)}>
					<span class="step-n" aria-hidden="true">{s.n}</span>
					<h3>{s.title}</h3>
					<p>{s.text}</p>
				</li>
			{/each}
		</ol>
	</div>
</section>

<!-- FINAL CTA -->
<section class="final" aria-labelledby="final-title">
	<div class="container">
		<div class="final-card" {@attach reveal()}>
			<svg class="final-path" viewBox="0 0 600 200" aria-hidden="true">
				<path d="M10 170 C 150 170 170 60 300 90 S 470 40 590 20" />
			</svg>
			<h2 id="final-title">La tua prossima avventura comincia qui!</h2>
			<p>Scegli un itinerario, scaricalo gratis e preparati a partire.</p>
			<a class="btn btn-light" href="/itinerari" {...trackAttrs(EVENTS.cta, { posizione: 'cta-finale' })}>
				Esplora gli itinerari
				<Icon name="arrow" />
			</a>
		</div>
	</div>
</section>

<style>
	/* ---------- Hero ---------- */
	.hero {
		position: relative;
		display: flex;
		flex-direction: column;
		min-height: calc(100svh - var(--header-h));
		margin-top: calc(-1 * var(--header-h));
		padding-top: calc(var(--header-h) + clamp(2rem, 7vh, 5rem));
		overflow: hidden;
		isolation: isolate;
	}

	.sky {
		position: absolute;
		inset: 0;
		z-index: -2;
		background:
			radial-gradient(1200px 500px at 80% 0%, rgb(255 255 255 / 0.7), transparent 60%),
			linear-gradient(180deg, #dcebf3 0%, #ebf2f5 45%, #f6f0ea 100%);
	}

	.sun {
		position: absolute;
		top: 12%;
		right: 12%;
		width: clamp(120px, 16vw, 220px);
		aspect-ratio: 1;
		border-radius: 50%;
		background: radial-gradient(circle at 40% 40%, #f8e3d2, #ebcdb7 60%, rgb(235 205 183 / 0) 72%);
		animation: sun 8s ease-in-out infinite alternate;
	}

	@keyframes sun {
		to {
			transform: translateY(12px) scale(1.04);
		}
	}

	.hero-copy {
		position: relative;
		z-index: 1;
	}

	.hero h1 {
		max-width: 13ch;
		font-size: clamp(2.6rem, 1.6rem + 4.6vw, 5.4rem);
		font-weight: 520;
		letter-spacing: -0.03em;
		margin-bottom: 1.25rem;
	}

	.hero h1 em {
		font-style: italic;
		font-weight: 420;
		color: var(--clay-ink);
	}

	.hero .lead {
		max-width: 46ch;
		margin-bottom: 2rem;
	}

	.trust {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem 1.4rem;
		list-style: none;
		margin: 1.75rem 0 0;
		padding: 0;
		font-size: 0.92rem;
		font-weight: 600;
		color: var(--text-muted);
	}

	.trust li {
		display: inline-flex;
		align-items: center;
		gap: 0.4rem;
	}

	.trust :global(svg) {
		color: var(--chambray-ink);
	}

	.hero-in {
		animation: hero-in 1s var(--ease-out) both;
		animation-delay: var(--d);
	}

	@keyframes hero-in {
		from {
			opacity: 0;
			transform: translateY(22px);
		}
	}

	.scene-wrap {
		position: relative;
		flex: 1;
		min-height: clamp(260px, 42vh, 520px);
		margin-top: clamp(-9rem, -10vw, -2rem);
		z-index: -1;
		pointer-events: none;
	}

	.scene-wrap :global(svg) {
		position: absolute;
		inset: 0;
	}

	/* ---------- Destinations ---------- */
	.destinations {
		background: var(--bg);
	}

	/* ---------- Welcome ---------- */
	.welcome {
		background: var(--sand);
		border-radius: clamp(28px, 5vw, 56px);
		margin-inline: clamp(0px, 2vw, 24px);
	}

	.welcome-grid {
		display: grid;
		grid-template-columns: 1.05fr 1fr;
		gap: clamp(2rem, 5vw, 4.5rem);
		align-items: center;
	}

	.goal {
		margin: 1.75rem 0;
		padding: 1.25rem 1.5rem;
		border-left: 4px solid var(--terracotta);
		background: rgb(255 255 255 / 0.6);
		border-radius: 0 var(--radius) var(--radius) 0;
		font-family: var(--font-display);
		font-size: var(--step-1);
		line-height: 1.45;
	}

	.goal p:last-child {
		margin: 0;
	}

	.goal-label {
		font-family: var(--font-body);
		font-size: 0.78rem;
		font-weight: 800;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		color: var(--clay-ink);
		margin-bottom: 0.4rem;
	}

	.muted {
		color: var(--text-muted);
	}

	.welcome-media {
		position: relative;
		margin: 0;
	}

	.welcome-media img {
		width: 100%;
		aspect-ratio: 4 / 3;
		object-fit: cover;
		object-position: 45% 50%;
		border-radius: var(--radius-l);
		box-shadow: var(--shadow-l);
		transform: rotate(1.5deg);
	}

	figcaption {
		position: absolute;
		left: clamp(-1rem, -2vw, 0rem);
		bottom: -1.25rem;
		display: flex;
		align-items: center;
		gap: 0.6rem;
		padding: 0.75rem 1.1rem;
		background: var(--surface);
		border-radius: 999px;
		box-shadow: var(--shadow);
		font-weight: 700;
		font-size: 0.92rem;
	}

	.stamp {
		display: grid;
		place-items: center;
		width: 32px;
		height: 32px;
		border-radius: 50%;
		background: var(--bisque);
		color: var(--espresso);
	}

	/* ---------- Features ---------- */
	.feature-grid {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 1.25rem;
		list-style: none;
		margin: 0;
		padding: 0;
	}

	.feature {
		padding: 1.75rem;
		background: var(--surface);
		border: 1px solid var(--line);
		border-radius: var(--radius-l);
		transition:
			transform 0.4s var(--ease-out),
			box-shadow 0.4s var(--ease-out),
			border-color 0.4s;
	}

	.feature:hover {
		transform: translateY(-4px);
		box-shadow: var(--shadow);
		border-color: transparent;
	}

	.feature-icon {
		display: grid;
		place-items: center;
		width: 52px;
		height: 52px;
		margin-bottom: 1.1rem;
		border-radius: 16px;
		background: var(--glacier);
		color: var(--chambray-ink);
		transition: transform 0.5s var(--ease-out);
	}

	.feature:nth-child(3n + 2) .feature-icon {
		background: var(--bisque-soft);
		color: var(--clay-ink);
	}

	.feature:nth-child(3n) .feature-icon {
		background: var(--sand);
		color: var(--espresso);
	}

	.feature:hover .feature-icon {
		transform: rotate(-8deg) scale(1.06);
	}

	.feature h3 {
		margin-bottom: 0.4rem;
	}

	.feature p {
		margin: 0;
		color: var(--text-muted);
		font-size: 0.97rem;
	}

	/* ---------- Steps ---------- */
	.how {
		padding-top: 0;
	}

	.steps {
		position: relative;
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: clamp(1.5rem, 4vw, 3rem);
		list-style: none;
		margin: 0;
		padding: 0;
		counter-reset: none;
	}

	.steps::before {
		content: '';
		position: absolute;
		top: 34px;
		left: 8%;
		right: 8%;
		border-top: 2px dashed var(--bisque);
	}

	.step {
		position: relative;
		text-align: center;
	}

	.step-n {
		display: grid;
		place-items: center;
		width: 68px;
		height: 68px;
		margin: 0 auto 1.25rem;
		border-radius: 50%;
		background: var(--espresso);
		color: #fff;
		font-family: var(--font-display);
		font-size: 1.5rem;
		box-shadow: 0 0 0 8px var(--bg);
	}

	.step p {
		max-width: 32ch;
		margin-inline: auto;
		color: var(--text-muted);
	}

	/* ---------- Final CTA ---------- */
	.final-card {
		position: relative;
		overflow: hidden;
		padding: clamp(3rem, 8vw, 5.5rem) clamp(1.5rem, 5vw, 4rem);
		border-radius: clamp(28px, 4vw, 44px);
		background:
			radial-gradient(600px 300px at 90% 0%, rgb(121 163 195 / 0.45), transparent 70%),
			linear-gradient(135deg, #4a2c22, var(--espresso));
		color: #fff;
		text-align: center;
	}

	.final-card h2 {
		color: #fff;
		max-width: 18ch;
		margin-inline: auto;
	}

	.final-card p {
		color: #ead9cc;
		margin-bottom: 2rem;
	}

	.final-path {
		position: absolute;
		inset: auto 0 0 0;
		width: 100%;
		height: 100%;
		opacity: 0.35;
		pointer-events: none;
	}

	.final-path path {
		fill: none;
		stroke: var(--bisque);
		stroke-width: 2;
		stroke-dasharray: 3 10;
		stroke-linecap: round;
	}

	/* Light variant of the primary button, for dark backgrounds */
	.btn-light {
		--btn-bg: #fff;
		--btn-fg: var(--espresso);
		--btn-border: #fff;
		position: relative;
	}

	/* ---------- Responsive ---------- */
	@media (max-width: 1024px) {
		.feature-grid {
			grid-template-columns: repeat(2, 1fr);
		}
	}

	@media (max-width: 900px) {
		.welcome-grid {
			grid-template-columns: 1fr;
		}

		.welcome-media {
			max-width: 560px;
		}
	}

	@media (max-width: 720px) {
		.steps {
			grid-template-columns: 1fr;
		}

		.steps::before {
			top: 0;
			bottom: 0;
			left: 50%;
			right: auto;
			border-top: 0;
			border-left: 2px dashed var(--bisque);
		}

		.step {
			background: var(--bg);
			padding-bottom: 0.5rem;
		}
	}

	@media (max-width: 560px) {
		.hero {
			padding-top: calc(var(--header-h) + 1.75rem);
		}

		.sun {
			top: 7%;
			right: -6%;
			width: 120px;
			opacity: 0.75;
		}

		.scene-wrap {
			min-height: 300px;
			margin-top: -1.5rem;
		}

		.feature-grid {
			grid-template-columns: 1fr;
		}

		.hero .btn-row .btn {
			flex: 1 1 100%;
		}
	}
</style>
