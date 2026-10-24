<script lang="ts">
	import Seo from '#lib/components/Seo.svelte';
	import PageHero from '#lib/components/PageHero.svelte';
	import Icon from '#lib/components/Icon.svelte';
	import { reveal } from '#lib/reveal.ts';

	// `html` answers may contain internal links; the text is static and authored here.
	const faqs: { q: string; a: string }[] = [
		{
			q: 'Gli itinerari sono davvero gratuiti?',
			a: 'Sì, tutti gli itinerari di PerDove sono completamente gratuiti. Nasciamo dalla passione per i viaggi: non ci sono costi nascosti, abbonamenti o contenuti a pagamento.'
		},
		{
			q: 'Devo registrarmi per scaricare un itinerario?',
			a: 'No. Non serve creare un account né lasciare la tua e-mail: apri la pagina dell’itinerario e scarica subito il PDF.'
		},
		{
			q: 'Come posso consultare un itinerario?',
			a: 'Dalla pagina di ogni itinerario puoi scegliere <strong>Visualizza online</strong> per sfogliare il PDF nel browser oppure <strong>Scarica il PDF gratis</strong> per salvarlo sul telefono, sul tablet o sul computer.'
		},
		{
			q: 'Posso usare l’itinerario senza connessione internet?',
			a: 'Sì: una volta scaricato, il PDF si apre anche offline. Le mappe interattive, invece, sono pagine web e richiedono una connessione per essere consultate.'
		},
		{
			q: 'Cosa sono le mappe interattive?',
			a: 'Sono mappe online, collegate a ciascuna giornata quando disponibili, che mostrano tutte le tappe del giorno. Le trovi sia nel PDF sia nel programma pubblicato sulla pagina dell’itinerario.'
		},
		{
			q: 'Prezzi e orari indicati sono aggiornati?',
			a: 'Prezzi, orari e tempi di visita sono indicativi e possono cambiare in base alla stagione e alle decisioni dei gestori. Ti consigliamo di verificarli sempre sui siti ufficiali prima di partire, soprattutto per le attrazioni che richiedono la prenotazione.'
		},
		{
			q: 'Posso cambiare l’ordine delle tappe?',
			a: 'Certo. Ogni giornata è divisa in mattina, pomeriggio e sera, ma gli itinerari sono pensati per essere flessibili: puoi modificare ordine e tempi delle visite in base ai tuoi interessi e al tuo ritmo.'
		},
		{
			q: 'Cosa comprende il budget indicativo?',
			a: 'Ogni itinerario riporta una stima delle spese giornaliere a persona su tre fasce (economica, media e alta) e una stima del costo dei biglietti delle attrazioni incluse. Cosa è compreso nella stima è spiegato nella sezione budget di ciascun itinerario.'
		},
		{
			q: 'Posso stampare o condividere un itinerario?',
			a: 'Puoi stamparlo e usarlo liberamente per i tuoi viaggi. Se vuoi consigliarlo a qualcuno, condividi il link della pagina: ci aiuti a crescere! Non è invece consentito ripubblicare o vendere i contenuti. Trovi i dettagli nei <a href="/termini">Termini e condizioni</a>.'
		},
		{
			q: 'Pubblicherete nuove destinazioni?',
			a: 'Sì, stiamo lavorando a nuovi itinerari in Italia, in Europa e nel resto del mondo. Seguici sui social per scoprirli in anteprima o <a href="/contatti">suggeriscici</a> la tua prossima meta.'
		},
		{
			q: 'Ho trovato un’informazione non corretta: come posso segnalarla?',
			a: 'Grazie in anticipo! Scrivici dalla pagina <a href="/contatti">Contatti</a> indicando l’itinerario e l’informazione da correggere: aggiorneremo il contenuto il prima possibile.'
		}
	];

	const strip = (html: string) => html.replace(/<[^>]+>/g, '');

	const jsonLd = {
		'@context': 'https://schema.org',
		'@type': 'FAQPage',
		mainEntity: faqs.map((f) => ({
			'@type': 'Question',
			name: f.q,
			acceptedAnswer: { '@type': 'Answer', text: strip(f.a) }
		}))
	};
</script>

<Seo
	title="Domande frequenti (FAQ)"
	description="Risposte alle domande più comuni su PerDove: itinerari gratuiti, download dei PDF senza registrazione, mappe interattive, prezzi e orari indicativi."
	{jsonLd}
/>

<PageHero
	eyebrow="FAQ"
	title="Domande frequenti"
	lead="Tutto quello che c’è da sapere sugli itinerari PerDove. Non trovi la risposta? Scrivici!"
/>

<section class="faq" aria-label="Elenco delle domande">
	<div class="container narrow">
		<div class="list">
			{#each faqs as item, i (item.q)}
				<details {@attach reveal(Math.min(i, 4) * 50)} open={i === 0}>
					<summary>
						<span>{item.q}</span>
						<span class="sign" aria-hidden="true"><Icon name="plus" size={18} /></span>
					</summary>
					<div class="answer">
						<p>{@html item.a}</p>
					</div>
				</details>
			{/each}
		</div>

		<div class="more">
			<h2>Hai ancora dubbi?</h2>
			<p>Rispondiamo volentieri a ogni domanda.</p>
			<a class="btn" href="/contatti">Contattaci <Icon name="arrow" /></a>
		</div>
	</div>
</section>

<style>
	.narrow {
		max-width: 820px;
	}

	.list {
		display: grid;
		gap: 0.85rem;
	}

	details {
		background: var(--surface);
		border: 1px solid var(--line);
		border-radius: var(--radius);
		transition:
			box-shadow 0.3s,
			border-color 0.3s;
	}

	details[open] {
		box-shadow: var(--shadow);
		border-color: transparent;
	}

	summary {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 1rem;
		min-height: 64px;
		padding: 1rem 1.25rem 1rem 1.5rem;
		font-family: var(--font-display);
		font-size: var(--step-1);
		font-weight: 520;
		cursor: pointer;
		list-style: none;
	}

	summary::-webkit-details-marker {
		display: none;
	}

	summary:focus-visible {
		border-radius: var(--radius);
	}

	.sign {
		display: grid;
		place-items: center;
		flex: none;
		width: 36px;
		height: 36px;
		border-radius: 50%;
		background: var(--sand);
		transition:
			transform 0.4s var(--ease-out),
			background-color 0.3s,
			color 0.3s;
	}

	details[open] .sign {
		transform: rotate(45deg);
		background: var(--espresso);
		color: #fff;
	}

	.answer {
		padding: 0 1.5rem 1.35rem;
		color: var(--text-muted);
	}

	details[open] .answer {
		animation: open 0.45s var(--ease-out);
	}

	@keyframes open {
		from {
			opacity: 0;
			transform: translateY(-6px);
		}
	}

	.answer p {
		margin: 0;
	}

	.more {
		margin-top: clamp(3rem, 7vw, 4.5rem);
		padding: clamp(2rem, 5vw, 3rem);
		text-align: center;
		border-radius: var(--radius-l);
		background: var(--sand);
	}

	.more h2 {
		font-size: var(--step-2);
	}
</style>
