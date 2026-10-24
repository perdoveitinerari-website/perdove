<script lang="ts">
	import Seo from '#lib/components/Seo.svelte';
	import PageHero from '#lib/components/PageHero.svelte';
	import ContactForm from '#lib/components/ContactForm.svelte';
	import Socials from '#lib/components/Socials.svelte';
	import Icon from '#lib/components/Icon.svelte';
	import { site } from '#lib/config.ts';
</script>

<Seo
	title="Contatti"
	description="Scrivi a PerDove per domande sugli itinerari, suggerimenti di nuove destinazioni o segnalazioni. Ti risponderemo il prima possibile."
/>

<PageHero
	eyebrow="Contatti"
	title="Scrivici, ci fa sempre piacere"
	lead="Hai una domanda su un itinerario, vuoi suggerirci una destinazione o hai notato un’informazione da aggiornare? Siamo qui."
/>

<section class="contact" aria-label="Modulo e recapiti">
	<div class="container grid">
		<div class="card form-card">
			<h2 class="visually-hidden">Modulo di contatto</h2>
			<ContactForm />
		</div>

		<aside class="info">
			<div class="info-block">
				<span class="info-icon"><Icon name="mail" size={22} /></span>
				<div>
					<h2>E-mail</h2>
					<p><a href={`mailto:${site.email}`}>{site.email}</a></p>
				</div>
			</div>
			<div class="info-block">
				<span class="info-icon"><Icon name="heart" size={22} /></span>
				<div>
					<h2>Seguici</h2>
					<p>Ispirazioni, anteprime e nuovi itinerari sui nostri social.</p>
					<Socials position="contatti" />
				</div>
			</div>
			<div class="info-block">
				<span class="info-icon"><Icon name="compass" size={22} /></span>
				<div>
					<h2>Domande frequenti</h2>
					<p>Forse la risposta che cerchi è già nelle <a href="/faq">FAQ</a>.</p>
				</div>
			</div>
		</aside>
	</div>
</section>

<style>
	.grid {
		display: grid;
		grid-template-columns: 1.5fr 1fr;
		gap: clamp(1.5rem, 5vw, 4rem);
		align-items: start;
	}

	.form-card {
		padding: clamp(1.5rem, 4vw, 2.75rem);
		background: var(--surface);
		border-radius: var(--radius-l);
		box-shadow: var(--shadow);
	}

	.info {
		display: grid;
		gap: 1.75rem;
		padding-top: 0.5rem;
	}

	.info-block {
		display: flex;
		gap: 1rem;
	}

	.info-block h2 {
		font-size: var(--step-1);
		margin-bottom: 0.25rem;
	}

	.info-block p {
		color: var(--text-muted);
		margin-bottom: 0.75rem;
	}

	.info-block a {
		font-weight: 700;
		word-break: break-word;
	}

	.info-icon {
		display: grid;
		place-items: center;
		flex: none;
		width: 48px;
		height: 48px;
		border-radius: 14px;
		background: var(--glacier);
		color: var(--chambray-ink);
	}

	@media (max-width: 900px) {
		.grid {
			grid-template-columns: 1fr;
		}
	}
</style>
