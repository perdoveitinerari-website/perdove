<script lang="ts">
	import Seo from '#lib/components/Seo.svelte';
	import LegalPage from '#lib/components/LegalPage.svelte';
	import { site } from '#lib/config.ts';
</script>

<Seo
	title="Termini e condizioni"
	description="Termini e condizioni d’uso di perdove.com e degli itinerari di viaggio gratuiti in PDF: utilizzo consentito, proprietà intellettuale e limitazioni di responsabilità."
/>

<LegalPage eyebrow="Condizioni d’uso" title="Termini e condizioni" updated="24 ottobre 2026">
	<p>
		I presenti Termini e condizioni regolano l’utilizzo del sito <strong>perdove.com</strong> (“Sito”) e degli itinerari
		di viaggio in esso pubblicati. Navigando sul Sito o scaricando un itinerario accetti questi Termini.
	</p>

	<h2>1. Il servizio</h2>
	<p>
		PerDove pubblica itinerari di viaggio in formato digitale (pagine web e file PDF) a scopo informativo. Tutti gli
		itinerari sono <strong>gratuiti</strong> e consultabili senza registrazione.
	</p>

	<h2>2. Utilizzo consentito</h2>
	<ul>
		<li>Puoi consultare, scaricare e stampare gli itinerari per uso personale e non commerciale.</li>
		<li>Puoi condividere il link alle pagine del Sito con chi vuoi.</li>
		<li>
			Non è consentito ripubblicare, vendere, distribuire o modificare i contenuti del Sito e dei PDF, in tutto o in parte,
			senza autorizzazione scritta.
		</li>
	</ul>

	<h2>3. Proprietà intellettuale</h2>
	<p>
		Testi, grafiche, logo, impaginazione e struttura degli itinerari sono di proprietà di PerDove o utilizzati con
		licenza, e sono protetti dalla normativa sul diritto d’autore. I marchi e i nomi di terzi citati appartengono ai
		rispettivi titolari.
	</p>

	<h2>4. Accuratezza delle informazioni</h2>
	<p>
		Gli itinerari sono preparati con cura, ma prezzi, orari di apertura, modalità di prenotazione e tempi di visita sono
		<strong>indicativi</strong> e possono cambiare senza preavviso. Prima di partire verifica sempre le informazioni sui
		siti ufficiali delle attrazioni, delle strutture e dei trasporti.
	</p>

	<h2>5. Strutture e servizi consigliati</h2>
	<p>
		Hotel, ristoranti e attrazioni sono suggeriti a titolo puramente indicativo. PerDove non gestisce prenotazioni né
		vendite e non è responsabile dei servizi offerti da terzi, della loro disponibilità o dei loro prezzi.
	</p>

	<h2>6. Link esterni</h2>
	<p>
		Il Sito e i PDF contengono link a servizi esterni, come le mappe interattive e i social network. Questi siti hanno
		propri termini e informative e PerDove non è responsabile dei loro contenuti.
	</p>

	<h2>7. Limitazione di responsabilità</h2>
	<p>
		Nei limiti consentiti dalla legge, PerDove non risponde di eventuali danni, disagi o costi derivanti dall’uso delle
		informazioni pubblicate, da modifiche intervenute dopo la pubblicazione o da interruzioni temporanee del Sito.
	</p>

	<h2>8. Modifiche</h2>
	<p>
		Possiamo aggiornare questi Termini in qualsiasi momento. La versione in vigore è sempre quella pubblicata su questa
		pagina, con la data di ultimo aggiornamento.
	</p>

	<h2>9. Legge applicabile e contatti</h2>
	<p>
		I presenti Termini sono regolati dalla legge italiana. Per qualsiasi domanda scrivi a
		<a href={`mailto:${site.email}`}>{site.email}</a>. Per il trattamento dei dati personali consulta la
		<a href="/privacy">Privacy Policy</a>.
	</p>
</LegalPage>
