<script lang="ts">
	import Seo from '#lib/components/Seo.svelte';
	import LegalPage from '#lib/components/LegalPage.svelte';
	import { site } from '#lib/config.ts';
</script>

<Seo
	title="Privacy Policy"
	description="Informativa sul trattamento dei dati personali di perdove.com ai sensi del Regolamento (UE) 2016/679 (GDPR): dati raccolti, finalità, cookie e diritti degli utenti."
/>

<LegalPage eyebrow="Informativa" title="Privacy Policy" updated="24 ottobre 2026">
	<div class="box">
		<p>
			<strong>In breve:</strong> per scaricare gli itinerari non chiediamo alcun dato. Il sito non usa cookie di profilazione
			né cookie di terze parti, e le statistiche di visita sono anonime e aggregate. Trattiamo i tuoi dati personali solo se
			ci scrivi tramite il modulo di contatto o per e-mail, e solo per risponderti.
		</p>
	</div>

	<p>
		La presente informativa descrive come vengono trattati i dati personali degli utenti che visitano il sito
		<strong>perdove.com</strong> (di seguito “Sito”), ai sensi degli articoli 13 e 14 del Regolamento (UE) 2016/679
		(“GDPR”) e del D.Lgs. 196/2003 (“Codice Privacy”) come modificato dal D.Lgs. 101/2018.
	</p>

	<h2>1. Titolare del trattamento</h2>
	<p>
		Il Titolare del trattamento è il gestore del progetto PerDove, contattabile all’indirizzo e-mail
		<a href={`mailto:${site.email}`}>{site.email}</a>.
	</p>

	<h2>2. Dati trattati</h2>
	<h3>Dati di navigazione</h3>
	<p>
		Il Sito è ospitato da GitHub Pages (GitHub, Inc.). Come avviene per qualsiasi sito web, i server del fornitore di
		hosting registrano automaticamente alcuni dati tecnici necessari al funzionamento e alla sicurezza del servizio, come
		l’indirizzo IP, la data e l’ora della richiesta e il tipo di browser. Questi dati non vengono usati per identificare gli
		utenti.
	</p>

	<h3>Statistiche di visita</h3>
	<p>
		Per capire quali pagine e itinerari sono più apprezzati utilizziamo Umami, uno strumento di analisi rispettoso della
		privacy che <strong>non usa cookie</strong>, non raccoglie dati personali e non traccia gli utenti tra siti diversi. I
		dati raccolti (ad esempio pagine visitate, download degli itinerari, tipo di dispositivo e Paese di provenienza) sono
		anonimi e consultabili solo in forma aggregata.
	</p>

	<h3>Dati forniti volontariamente</h3>
	<p>
		Se ci contatti tramite il modulo della pagina <a href="/contatti">Contatti</a> o per e-mail, trattiamo i dati che ci
		comunichi (nome, indirizzo e-mail e contenuto del messaggio). Il modulo di contatto è gestito tramite il servizio
		Formspree (Formspree, Inc.), che riceve i messaggi e li inoltra alla nostra casella e-mail.
	</p>

	<h2>3. Finalità e base giuridica</h2>
	<ul>
		<li>
			<strong>Rispondere alle tue richieste</strong> inviate tramite modulo o e-mail: base giuridica è l’esecuzione di
			misure richieste dall’interessato (art. 6, par. 1, lett. b GDPR) e il tuo consenso (art. 6, par. 1, lett. a GDPR).
		</li>
		<li>
			<strong>Garantire il funzionamento e la sicurezza del Sito</strong> e produrre statistiche anonime: legittimo
			interesse del Titolare (art. 6, par. 1, lett. f GDPR).
		</li>
	</ul>
	<p>I dati non vengono utilizzati per finalità di marketing né ceduti a terzi per scopi commerciali.</p>

	<h2>4. Conservazione dei dati</h2>
	<p>
		I messaggi ricevuti sono conservati per il tempo necessario a gestire la richiesta e, in ogni caso, non oltre 24 mesi
		dall’ultimo contatto, salvo obblighi di legge. Le statistiche di visita sono anonime e aggregate.
	</p>

	<h2>5. Destinatari e trasferimenti extra UE</h2>
	<p>
		I dati possono essere trattati, in qualità di responsabili del trattamento, dai fornitori dei servizi tecnici sopra
		indicati (GitHub, Inc. per l’hosting, Formspree, Inc. per il modulo di contatto e Umami per le statistiche anonime).
		Alcuni di questi fornitori hanno sede negli Stati Uniti: in tali casi il trasferimento avviene sulla base del Data
		Privacy Framework UE-USA o delle Clausole Contrattuali Standard approvate dalla Commissione europea.
	</p>

	<h2>6. Cookie</h2>
	<p>
		Il Sito <strong>non utilizza cookie</strong>, né tecnici né di profilazione, e non installa strumenti di tracciamento di
		terze parti. Per questo motivo non è necessario un banner per il consenso ai cookie. I caratteri tipografici sono
		ospitati direttamente sul Sito, senza collegamenti a servizi esterni.
	</p>
	<p>
		Le mappe interattive (Wanderlog) e i nostri profili social (Instagram, TikTok, Facebook) sono raggiungibili tramite
		semplici link: quando li apri, vieni indirizzato a siti esterni che applicano le proprie informative sulla privacy e
		sui cookie.
	</p>

	<h2>7. I tuoi diritti</h2>
	<p>In qualsiasi momento puoi esercitare i diritti previsti dagli articoli 15-22 del GDPR, tra cui:</p>
	<ul>
		<li>accedere ai tuoi dati e ottenerne una copia;</li>
		<li>chiederne la rettifica o la cancellazione;</li>
		<li>chiedere la limitazione del trattamento od opporti ad esso;</li>
		<li>ricevere i dati in un formato strutturato (portabilità);</li>
		<li>revocare il consenso, senza pregiudicare la liceità del trattamento effettuato prima della revoca.</li>
	</ul>
	<p>
		Per esercitare i tuoi diritti scrivi a <a href={`mailto:${site.email}`}>{site.email}</a>. Hai inoltre il diritto di
		proporre reclamo al Garante per la protezione dei dati personali (<a
			href="https://www.garanteprivacy.it"
			target="_blank"
			rel="noopener noreferrer">www.garanteprivacy.it</a
		>).
	</p>

	<h2>8. Modifiche all’informativa</h2>
	<p>
		Questa informativa può essere aggiornata, ad esempio in caso di nuovi servizi o di modifiche normative. La data
		dell’ultimo aggiornamento è indicata in cima alla pagina.
	</p>
</LegalPage>
