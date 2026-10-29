<script lang="ts">
	import Seo from '#lib/components/Seo.svelte';
	import PageHero from '#lib/components/PageHero.svelte';
	import FeedbackForm from '#lib/components/FeedbackForm.svelte';
	import Icon from '#lib/components/Icon.svelte';
</script>

<Seo
	title="Feedback"
	description="Hai seguito un itinerario PerDove? Raccontaci la tua esperienza: il tuo voto e i tuoi consigli ci aiutano a creare itinerari sempre migliori."
/>

<PageHero
	eyebrow="Feedback"
	title="Raccontaci la tua esperienza con PerDove"
	lead="Hai seguito uno dei nostri itinerari? Dicci cosa ti è piaciuto e cosa possiamo migliorare: ogni parere ci aiuta a creare viaggi ancora più belli."
/>

<section class="feedback" id="modulo" aria-label="Modulo di feedback">
	<div class="container grid">
		<div class="card form-card">
			<h2 class="visually-hidden">Lascia il tuo feedback</h2>
			<FeedbackForm />
		</div>

		<aside class="info">
			<div class="info-block">
				<span class="info-icon"><Icon name="heart" size={22} /></span>
				<div>
					<h2>Leggiamo tutto</h2>
					<p>Ogni feedback arriva direttamente a noi e lo leggiamo con attenzione, uno per uno.</p>
				</div>
			</div>
			<div class="info-block">
				<span class="info-icon"><Icon name="clock" size={22} /></span>
				<div>
					<h2>Bastano due minuti</h2>
					<p>Ti chiediamo solo il nome, un voto e qualche riga. L’e-mail è facoltativa.</p>
				</div>
			</div>
			<div class="info-block">
				<span class="info-icon"><Icon name="mail" size={22} /></span>
				<div>
					<h2>Hai una domanda?</h2>
					<p>Per richieste o itinerari personalizzati usa la pagina <a href="/contatti">Contatti</a>.</p>
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
		padding: clamp(1.25rem, 4vw, 2.75rem);
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
		margin: 0;
	}

	.info-block a {
		font-weight: 700;
	}

	.info-icon {
		display: grid;
		place-items: center;
		flex: none;
		width: 48px;
		height: 48px;
		border-radius: 14px;
		background: var(--bisque-soft);
		color: var(--clay-ink);
	}

	@media (max-width: 900px) {
		.grid {
			grid-template-columns: 1fr;
		}
	}
</style>
