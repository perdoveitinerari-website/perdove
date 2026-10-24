<script lang="ts">
	import { onMount } from 'svelte';
	import Icon from './Icon.svelte';
	import { FORMSPREE_FORM_ID, site } from '#lib/config.ts';
	import { track, EVENTS } from '#lib/analytics.ts';

	type Status = 'idle' | 'sending' | 'success' | 'error';
	type Field = 'nome' | 'email' | 'messaggio' | 'privacy';

	const CUSTOM_SUBJECT = 'Itinerario personalizzato';
	const CUSTOM_TEMPLATE =
		'Ciao! Vorrei un itinerario personalizzato.\n\nDestinazione: \nDate o durata del viaggio: \nNumero di persone: \nInteressi e budget: ';

	const subjects = [
		'Informazioni su un itinerario',
		CUSTOM_SUBJECT,
		'Suggerisci una destinazione',
		'Segnala un errore o un aggiornamento',
		'Collaborazioni',
		'Altro'
	];

	let values = $state({ nome: '', email: '', oggetto: subjects[0], messaggio: '', privacy: false, _gotcha: '' });
	let touched = $state<Record<Field, boolean>>({ nome: false, email: false, messaggio: false, privacy: false });
	let status = $state<Status>('idle');
	let errorMessage = $state('');
	let form: HTMLFormElement | undefined = $state();
	let resultBox: HTMLElement | undefined = $state();
	const renderedAt = Date.now();

	// /contatti?argomento=personalizzato (the homepage button) preselects the topic and a message outline.
	onMount(() => {
		if (new URLSearchParams(location.search).get('argomento') !== 'personalizzato') return;
		values.oggetto = CUSTOM_SUBJECT;
		if (!values.messaggio) values.messaggio = CUSTOM_TEMPLATE;
	});

	const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

	const errors = $derived<Record<Field, string>>({
		nome: values.nome.trim().length < 2 ? 'Inserisci il tuo nome.' : '',
		email: !values.email.trim()
			? 'Inserisci il tuo indirizzo e-mail.'
			: EMAIL_RE.test(values.email.trim())
				? ''
				: 'Controlla l’indirizzo e-mail: sembra non essere valido.',
		messaggio:
			values.messaggio.trim().length < 10
				? 'Scrivi un messaggio di almeno 10 caratteri.'
				: values.messaggio.length > 3000
					? 'Il messaggio è troppo lungo (massimo 3000 caratteri).'
					: '',
		privacy: values.privacy ? '' : 'Per inviare il messaggio devi accettare l’informativa sulla privacy.'
	});

	const show = (field: Field) => touched[field] && errors[field];

	async function onsubmit(event: SubmitEvent) {
		event.preventDefault();
		touched = { nome: true, email: true, messaggio: true, privacy: true };
		const firstInvalid = (Object.keys(errors) as Field[]).find((f) => errors[f]);
		if (firstInvalid) {
			form?.querySelector<HTMLElement>(`[name="${firstInvalid}"]`)?.focus();
			return;
		}

		// Spam protection: honeypot filled or form submitted faster than a human could type.
		if (values._gotcha || Date.now() - renderedAt < 3000) {
			status = 'success';
			return;
		}

		if (!FORMSPREE_FORM_ID) {
			status = 'error';
			errorMessage = 'Il modulo di contatto non è ancora attivo.';
			return;
		}

		status = 'sending';
		try {
			const res = await fetch(`https://formspree.io/f/${FORMSPREE_FORM_ID}`, {
				method: 'POST',
				headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
				body: JSON.stringify({
					nome: values.nome.trim(),
					email: values.email.trim(),
					_replyto: values.email.trim(),
					_subject: `[PerDove] ${values.oggetto}`,
					oggetto: values.oggetto,
					messaggio: values.messaggio.trim(),
					_gotcha: values._gotcha
				})
			});
			if (!res.ok) throw new Error(String(res.status));
			status = 'success';
			track(EVENTS.contactSent, { oggetto: values.oggetto });
		} catch {
			status = 'error';
			errorMessage = 'Non siamo riusciti a inviare il messaggio. Controlla la connessione e riprova tra qualche istante.';
		}
	}

	function reset() {
		values = { nome: '', email: '', oggetto: subjects[0], messaggio: '', privacy: false, _gotcha: '' };
		touched = { nome: false, email: false, messaggio: false, privacy: false };
		status = 'idle';
	}

	// Move focus to the result so screen-reader and keyboard users notice it.
	$effect(() => {
		if ((status === 'success' || status === 'error') && resultBox) resultBox.focus();
	});
</script>

{#if status === 'success'}
	<div class="result success" role="status" tabindex="-1" bind:this={resultBox}>
		<span class="result-icon"><Icon name="check" size={30} /></span>
		<h2>Grazie, messaggio inviato!</h2>
		<p>Abbiamo ricevuto il tuo messaggio e ti risponderemo il prima possibile all’indirizzo che ci hai indicato.</p>
		<div class="btn-row">
			<a class="btn" href="/itinerari">Esplora gli itinerari <Icon name="arrow" /></a>
			<button type="button" class="btn btn-outline" onclick={reset}>Invia un altro messaggio</button>
		</div>
	</div>
{:else}
	<form bind:this={form} class="form" novalidate {onsubmit} aria-describedby="form-note">
		{#if status === 'error'}
			<div class="result error" role="alert" tabindex="-1" bind:this={resultBox}>
				<Icon name="alert" size={22} />
				<p>
					{errorMessage} In alternativa scrivici direttamente a
					<a href={`mailto:${site.email}`}>{site.email}</a>.
				</p>
			</div>
		{/if}

		<div class="row">
			<div class="field" class:invalid={show('nome')}>
				<label for="nome">Nome <span aria-hidden="true">*</span></label>
				<input
					id="nome"
					name="nome"
					type="text"
					autocomplete="name"
					required
					maxlength="80"
					bind:value={values.nome}
					onblur={() => (touched.nome = true)}
					aria-invalid={show('nome') ? 'true' : undefined}
					aria-describedby={show('nome') ? 'nome-err' : undefined}
				/>
				{#if show('nome')}<p class="err" id="nome-err">{errors.nome}</p>{/if}
			</div>

			<div class="field" class:invalid={show('email')}>
				<label for="email">E-mail <span aria-hidden="true">*</span></label>
				<input
					id="email"
					name="email"
					type="email"
					autocomplete="email"
					inputmode="email"
					required
					maxlength="120"
					bind:value={values.email}
					onblur={() => (touched.email = true)}
					aria-invalid={show('email') ? 'true' : undefined}
					aria-describedby={show('email') ? 'email-err' : undefined}
				/>
				{#if show('email')}<p class="err" id="email-err">{errors.email}</p>{/if}
			</div>
		</div>

		<div class="field">
			<label for="oggetto">Argomento</label>
			<div class="select">
				<select id="oggetto" name="oggetto" bind:value={values.oggetto}>
					{#each subjects as subject (subject)}
						<option>{subject}</option>
					{/each}
				</select>
			</div>
		</div>

		<div class="field" class:invalid={show('messaggio')}>
			<label for="messaggio">Messaggio <span aria-hidden="true">*</span></label>
			<textarea
				id="messaggio"
				name="messaggio"
				rows="6"
				required
				maxlength="3000"
				bind:value={values.messaggio}
				onblur={() => (touched.messaggio = true)}
				aria-invalid={show('messaggio') ? 'true' : undefined}
				aria-describedby={show('messaggio') ? 'messaggio-err' : 'messaggio-count'}
			></textarea>
			<div class="field-foot">
				{#if show('messaggio')}<p class="err" id="messaggio-err">{errors.messaggio}</p>{/if}
				<span class="count" id="messaggio-count">{values.messaggio.length}/3000</span>
			</div>
		</div>

		<!-- Honeypot: hidden from people, irresistible to bots. -->
		<div class="hp" aria-hidden="true">
			<label for="sito-web">Lascia vuoto questo campo</label>
			<input id="sito-web" name="_gotcha" type="text" tabindex="-1" autocomplete="off" bind:value={values._gotcha} />
		</div>

		<div class="field check" class:invalid={show('privacy')}>
			<label>
				<input
					type="checkbox"
					name="privacy"
					bind:checked={values.privacy}
					onchange={() => (touched.privacy = true)}
					aria-invalid={show('privacy') ? 'true' : undefined}
					aria-describedby={show('privacy') ? 'privacy-err' : undefined}
				/>
				<span class="box" aria-hidden="true"><Icon name="check" size={14} /></span>
				<span>Ho letto e accetto l’<a href="/privacy" target="_blank">informativa sulla privacy</a>. <span aria-hidden="true">*</span></span>
			</label>
			{#if show('privacy')}<p class="err" id="privacy-err">{errors.privacy}</p>{/if}
		</div>

		<div class="submit-row">
			<button class="btn" type="submit" disabled={status === 'sending'} aria-busy={status === 'sending'}>
				{#if status === 'sending'}
					<span class="spinner" aria-hidden="true"></span> Invio in corso…
				{:else}
					Invia il messaggio <Icon name="arrow" />
				{/if}
			</button>
			<p class="note" id="form-note">I campi con * sono obbligatori.</p>
		</div>
	</form>
{/if}

<style>
	.form {
		display: grid;
		gap: 1.25rem;
	}

	.row {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 1.25rem;
	}

	.field {
		display: grid;
		gap: 0.4rem;
	}

	label {
		font-weight: 700;
		font-size: 0.95rem;
	}

	input[type='text'],
	input[type='email'],
	textarea,
	select {
		width: 100%;
		min-height: 52px;
		padding: 0.8rem 1rem;
		border: 1.5px solid rgb(58 33 25 / 0.2);
		border-radius: 14px;
		background: var(--surface);
		transition:
			border-color 0.2s,
			box-shadow 0.2s;
	}

	textarea {
		resize: vertical;
		min-height: 150px;
	}

	input:hover,
	textarea:hover,
	select:hover {
		border-color: var(--clay);
	}

	input:focus,
	textarea:focus,
	select:focus {
		outline: none;
		border-color: var(--chambray-ink);
		box-shadow: 0 0 0 4px rgb(121 163 195 / 0.3);
	}

	.invalid input,
	.invalid textarea {
		border-color: #b4441d;
	}

	.select {
		position: relative;
	}

	.select select {
		appearance: none;
		padding-right: 2.75rem;
		cursor: pointer;
	}

	.select::after {
		content: '';
		position: absolute;
		right: 1.1rem;
		top: 50%;
		width: 9px;
		height: 9px;
		border-right: 2px solid var(--espresso);
		border-bottom: 2px solid var(--espresso);
		transform: translateY(-70%) rotate(45deg);
		pointer-events: none;
	}

	.err {
		display: flex;
		gap: 0.4rem;
		margin: 0;
		font-size: 0.88rem;
		font-weight: 600;
		color: #a33a16;
	}

	.field-foot {
		display: flex;
		justify-content: space-between;
		gap: 1rem;
	}

	.count {
		margin-left: auto;
		font-size: 0.82rem;
		color: var(--text-muted);
	}

	.hp {
		position: absolute;
		left: -9999px;
		width: 1px;
		height: 1px;
		overflow: hidden;
	}

	.check label {
		position: relative;
		display: flex;
		align-items: flex-start;
		gap: 0.75rem;
		font-weight: 500;
		cursor: pointer;
	}

	.check input {
		position: absolute;
		opacity: 0;
		width: 24px;
		height: 24px;
		margin: 0;
	}

	.box {
		display: grid;
		place-items: center;
		flex: none;
		width: 24px;
		height: 24px;
		border: 1.5px solid rgb(58 33 25 / 0.35);
		border-radius: 7px;
		background: var(--surface);
		color: transparent;
		transition:
			background-color 0.2s,
			border-color 0.2s,
			color 0.2s;
	}

	.check input:checked + .box {
		background: var(--espresso);
		border-color: var(--espresso);
		color: #fff;
	}

	.check input:focus-visible + .box {
		outline: 3px solid var(--chambray);
		outline-offset: 2px;
	}

	.invalid .box {
		border-color: #b4441d;
	}

	.submit-row {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 1rem 1.5rem;
	}

	.submit-row .note {
		margin: 0;
		font-size: 0.88rem;
		color: var(--text-muted);
	}

	.btn[disabled] {
		opacity: 0.75;
		cursor: progress;
		transform: none;
	}

	.spinner {
		width: 18px;
		height: 18px;
		border-radius: 50%;
		border: 2.5px solid rgb(255 255 255 / 0.35);
		border-top-color: #fff;
		animation: spin 0.8s linear infinite;
	}

	@keyframes spin {
		to {
			transform: rotate(360deg);
		}
	}

	.result {
		border-radius: var(--radius-l);
	}

	.result:focus {
		outline: none;
	}

	.result.error {
		display: flex;
		gap: 0.75rem;
		align-items: flex-start;
		padding: 1rem 1.25rem;
		background: #fbe6dc;
		color: #7a2e12;
	}

	.result.error p {
		margin: 0;
	}

	.result.success {
		padding: clamp(2rem, 5vw, 3rem);
		text-align: center;
		background: var(--glacier-soft);
		animation: pop 0.6s var(--ease-out) both;
	}

	.result.success .btn-row {
		justify-content: center;
	}

	.result-icon {
		display: grid;
		place-items: center;
		width: 68px;
		height: 68px;
		margin: 0 auto 1.25rem;
		border-radius: 50%;
		background: var(--espresso);
		color: #fff;
	}

	@keyframes pop {
		from {
			opacity: 0;
			transform: scale(0.96);
		}
	}

	@media (max-width: 640px) {
		.row {
			grid-template-columns: 1fr;
		}
	}
</style>
