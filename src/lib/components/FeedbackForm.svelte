<script lang="ts">
	import { onMount, tick } from 'svelte';
	import Icon from './Icon.svelte';
	import StarRating, { MOODS } from './StarRating.svelte';
	import { FORMSPREE_FORM_ID, site } from '#lib/config.ts';
	import { track, EVENTS } from '#lib/analytics.ts';
	import { itineraries } from '#lib/data/itineraries.ts';

	type Status = 'idle' | 'sending' | 'success' | 'error';
	type Field = 'nome' | 'email' | 'voto' | 'commento' | 'privacy';

	const GENERAL = 'generale';
	const options = [
		...itineraries.map((it) => ({ value: it.slug, label: `Itinerario ${it.title}` })),
		{ value: GENERAL, label: 'PerDove in generale' }
	];
	const labelOf = (value: string) => options.find((o) => o.value === value)?.label ?? value;

	const blank = () => ({ nome: '', email: '', itinerario: GENERAL, voto: 0, commento: '', privacy: false, _gotcha: '' });

	let values = $state(blank());
	let touched = $state<Record<Field, boolean>>({ nome: false, email: false, voto: false, commento: false, privacy: false });
	let status = $state<Status>('idle');
	let errorMessage = $state('');
	let form: HTMLFormElement | undefined = $state();
	let resultBox: HTMLElement | undefined = $state();
	let stamp: HTMLElement | undefined = $state();
	let renderedAt = Date.now();

	// /feedback?itinerario=<slug> (the prompt at the end of each itinerary page) preselects it.
	onMount(() => {
		const slug = new URLSearchParams(location.search).get('itinerario');
		if (slug && options.some((o) => o.value === slug)) values.itinerario = slug;
	});

	const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

	const errors = $derived<Record<Field, string>>({
		nome: values.nome.trim().length < 2 ? 'Inserisci il tuo nome.' : '',
		// E-mail is optional: only check it when something was typed.
		email:
			values.email.trim() && !EMAIL_RE.test(values.email.trim())
				? 'Controlla l’indirizzo e-mail: sembra non essere valido.'
				: '',
		voto: values.voto ? '' : 'Scegli un voto da 1 a 5 stelle.',
		commento:
			values.commento.trim().length < 10
				? 'Raccontaci qualcosa in più (almeno 10 caratteri).'
				: values.commento.length > 3000
					? 'Il commento è troppo lungo (massimo 3000 caratteri).'
					: '',
		privacy: values.privacy ? '' : 'Per inviare il feedback devi accettare l’informativa sulla privacy.'
	});

	const show = (field: Field) => touched[field] && errors[field];

	// Fetched while the request is in flight, so the burst is ready the moment it succeeds.
	let confettiModule: Promise<typeof import('#lib/confetti.ts')> | undefined;

	async function onsubmit(event: SubmitEvent) {
		event.preventDefault();
		touched = { nome: true, email: true, voto: true, commento: true, privacy: true };
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
			errorMessage = 'Il modulo per i feedback non è ancora attivo.';
			return;
		}

		status = 'sending';
		confettiModule ??= import('#lib/confetti.ts');
		const itinerario = labelOf(values.itinerario);
		try {
			const res = await fetch(`https://formspree.io/f/${FORMSPREE_FORM_ID}`, {
				method: 'POST',
				headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
				body: JSON.stringify({
					tipo: 'Feedback',
					nome: values.nome.trim(),
					email: values.email.trim() || 'Non indicata',
					...(values.email.trim() && { _replyto: values.email.trim() }),
					_subject: `[PerDove] Feedback ${'★'.repeat(values.voto)}${'☆'.repeat(5 - values.voto)} · ${itinerario}`,
					itinerario,
					voto: `${values.voto}/5 (${MOODS[values.voto]})`,
					commento: values.commento.trim(),
					_gotcha: values._gotcha
				})
			});
			if (!res.ok) throw new Error(String(res.status));
			status = 'success';
			track(EVENTS.feedbackSent, { itinerario: values.itinerario, voto: values.voto });
			celebrate();
		} catch {
			status = 'error';
			errorMessage = 'Non siamo riusciti a inviare il feedback. Controlla la connessione e riprova tra qualche istante.';
		}
	}

	async function celebrate() {
		await tick();
		const { confetti } = await (confettiModule ??= import('#lib/confetti.ts'));
		// Wait for the stamp to land, then burst from the point of impact.
		setTimeout(() => {
			if (!stamp) return;
			const r = stamp.getBoundingClientRect();
			confetti(r.left + r.width / 2, r.top + r.height / 2);
		}, 380);
	}

	function reset() {
		values = { ...blank(), itinerario: values.itinerario };
		touched = { nome: false, email: false, voto: false, commento: false, privacy: false };
		renderedAt = Date.now();
		status = 'idle';
	}

	// Move focus to the result so screen-reader and keyboard users notice it.
	$effect(() => {
		if ((status === 'success' || status === 'error') && resultBox) resultBox.focus();
	});

	const today = new Date().toLocaleDateString('it-IT', { day: '2-digit', month: 'short', year: 'numeric' });
</script>

{#if status === 'success'}
	<div class="thanks" role="status" tabindex="-1" bind:this={resultBox}>
		<div class="stamp" bind:this={stamp} aria-hidden="true">
			<span class="stamp-top">PerDove</span>
			<span class="stamp-main">Ricevuto</span>
			<span class="stamp-date">{today}</span>
		</div>
		<h2>{values.voto >= 4 ? 'Che bello, grazie di cuore!' : 'Grazie per la tua sincerità!'}</h2>
		<p>
			{values.voto >= 4
				? 'Il tuo feedback è arrivato e ci ha strappato un sorriso. Lo leggeremo con attenzione: ci aiuta a creare itinerari sempre più belli.'
				: 'Il tuo feedback è arrivato. Lo leggeremo con attenzione e lo useremo per migliorare i prossimi itinerari.'}
		</p>
		<p class="recap">
			<span class="visually-hidden">Hai votato {values.voto} su 5.</span>
			{#each [1, 2, 3, 4, 5] as n (n)}
				<span class="recap-star" class:on={n <= values.voto} style:--i={n} aria-hidden="true"><Icon name="star" size={22} /></span>
			{/each}
		</p>
		<div class="btn-row">
			<a class="btn" href="/itinerari">Esplora gli itinerari <Icon name="arrow" /></a>
			<button type="button" class="btn btn-outline" onclick={reset}>Lascia un altro feedback</button>
		</div>
	</div>
{:else}
	<form bind:this={form} class="form" novalidate {onsubmit} aria-describedby="feedback-note">
		{#if status === 'error'}
			<div class="form-error" role="alert" tabindex="-1" bind:this={resultBox}>
				<Icon name="alert" size={22} />
				<p>
					{errorMessage} In alternativa scrivici direttamente a
					<a href={`mailto:${site.email}`}>{site.email}</a>.
				</p>
			</div>
		{/if}

		<div class="row">
			<div class="field" class:invalid={show('nome')}>
				<label for="fb-nome">Nome <span aria-hidden="true">*</span></label>
				<input
					id="fb-nome"
					name="nome"
					type="text"
					autocomplete="given-name"
					required
					maxlength="80"
					bind:value={values.nome}
					onblur={() => (touched.nome = true)}
					aria-invalid={show('nome') ? 'true' : undefined}
					aria-describedby={show('nome') ? 'fb-nome-err' : undefined}
				/>
				{#if show('nome')}<p class="err" id="fb-nome-err">{errors.nome}</p>{/if}
			</div>

			<div class="field">
				<label for="fb-itinerario">Argomento</label>
				<div class="select">
					<select id="fb-itinerario" name="itinerario" bind:value={values.itinerario}>
						{#each options as option (option.value)}
							<option value={option.value}>{option.label}</option>
						{/each}
					</select>
				</div>
			</div>
		</div>

		<div class="field">
			<StarRating
				bind:value={values.voto}
				invalid={!!show('voto')}
				describedby={show('voto') ? 'voto-err' : undefined}
				onchange={() => (touched.voto = true)}
			/>
			{#if show('voto')}<p class="err" id="voto-err">{errors.voto}</p>{/if}
		</div>

		<div class="field" class:invalid={show('commento')}>
			<label for="fb-commento">Il tuo commento <span aria-hidden="true">*</span></label>
			<textarea
				id="fb-commento"
				name="commento"
				rows="5"
				required
				maxlength="3000"
				placeholder="Cosa ti è piaciuto di più? C’è qualcosa che possiamo migliorare?"
				bind:value={values.commento}
				onblur={() => (touched.commento = true)}
				aria-invalid={show('commento') ? 'true' : undefined}
				aria-describedby={show('commento') ? 'commento-err' : 'commento-count'}
			></textarea>
			<div class="field-foot">
				{#if show('commento')}<p class="err" id="commento-err">{errors.commento}</p>{/if}
				<span class="count" id="commento-count">{values.commento.length}/3000</span>
			</div>
		</div>

		<div class="field" class:invalid={show('email')}>
			<label for="fb-email">E-mail <span class="optional">(facoltativa, se vuoi una risposta)</span></label>
			<input
				id="fb-email"
				name="email"
				type="email"
				autocomplete="email"
				inputmode="email"
				maxlength="120"
				bind:value={values.email}
				onblur={() => (touched.email = true)}
				aria-invalid={show('email') ? 'true' : undefined}
				aria-describedby={show('email') ? 'fb-email-err' : undefined}
			/>
			{#if show('email')}<p class="err" id="fb-email-err">{errors.email}</p>{/if}
		</div>

		<!-- Honeypot: hidden from people, irresistible to bots. -->
		<div class="hp" aria-hidden="true">
			<label for="fb-sito-web">Lascia vuoto questo campo</label>
			<input id="fb-sito-web" name="_gotcha" type="text" tabindex="-1" autocomplete="off" bind:value={values._gotcha} />
		</div>

		<div class="field check" class:invalid={show('privacy')}>
			<label>
				<input
					type="checkbox"
					name="privacy"
					bind:checked={values.privacy}
					onchange={() => (touched.privacy = true)}
					aria-invalid={show('privacy') ? 'true' : undefined}
					aria-describedby={show('privacy') ? 'fb-privacy-err' : undefined}
				/>
				<span class="box" aria-hidden="true"><Icon name="check" size={14} /></span>
				<span>Ho letto e accetto l’<a href="/privacy" target="_blank">informativa sulla privacy</a>. <span aria-hidden="true">*</span></span>
			</label>
			{#if show('privacy')}<p class="err" id="fb-privacy-err">{errors.privacy}</p>{/if}
		</div>

		<div class="submit-row">
			<button class="btn send" type="submit" disabled={status === 'sending'} aria-busy={status === 'sending'}>
				{#if status === 'sending'}
					<span class="spinner" aria-hidden="true"></span> Invio in corso…
				{:else}
					Invia il feedback <span class="plane"><Icon name="send" /></span>
				{/if}
			</button>
			<p class="note" id="feedback-note">I campi con * sono obbligatori.</p>
		</div>
	</form>
{/if}

<style>
	/* Field styles are shared with the contact form: see "Forms" in app.css. */

	/* The paper plane takes a little test flight on hover. */
	.plane {
		display: inline-flex;
	}

	@media (hover: hover) {
		.send:hover .plane {
			animation: test-flight 0.7s var(--ease-out);
		}
	}

	@keyframes test-flight {
		45% {
			transform: translate(14px, -10px) rotate(8deg);
			opacity: 0;
		}
		46% {
			transform: translate(-14px, 8px);
		}
	}

	/* ---------- Thank-you ---------- */
	.thanks {
		position: relative;
		padding: clamp(2rem, 5vw, 3rem) clamp(1rem, 4vw, 2.5rem);
		text-align: center;
		border-radius: var(--radius-l);
		background: var(--glacier-soft);
		animation: card-in 0.5s var(--ease-out) both;
	}

	.thanks:focus {
		outline: none;
	}

	.thanks h2 {
		font-size: var(--step-3);
		animation: rise 0.6s var(--ease-out) 0.5s both;
	}

	.thanks p {
		max-width: 48ch;
		margin-inline: auto;
		color: var(--text-muted);
		animation: rise 0.6s var(--ease-out) 0.6s both;
	}

	.thanks .btn-row {
		justify-content: center;
		animation: rise 0.6s var(--ease-out) 0.9s both;
	}

	/* A passport stamp that thumps onto the card. */
	.stamp {
		display: inline-grid;
		justify-items: center;
		gap: 0.1rem;
		margin-bottom: 1.5rem;
		padding: 0.7rem 1.4rem 0.6rem;
		border: 3px solid var(--clay-ink);
		outline: 1.5px dashed var(--clay-ink);
		outline-offset: 4px;
		border-radius: 14px;
		color: var(--clay-ink);
		text-transform: uppercase;
		transform: rotate(-8deg);
		animation: thump 0.55s cubic-bezier(0.5, 0, 0.75, 0) 0.05s both;
	}

	.stamp-top,
	.stamp-date {
		font-size: 0.7rem;
		font-weight: 800;
		letter-spacing: 0.22em;
	}

	.stamp-main {
		font-family: var(--font-display);
		font-size: clamp(1.7rem, 1.3rem + 2vw, 2.3rem);
		font-weight: 650;
		line-height: 1;
		letter-spacing: 0.06em;
	}

	@keyframes thump {
		0% {
			opacity: 0;
			transform: scale(2.6) rotate(-20deg);
		}
		60% {
			opacity: 1;
			transform: scale(0.92) rotate(-7deg);
			animation-timing-function: cubic-bezier(0.34, 1.56, 0.64, 1);
		}
		100% {
			transform: scale(1) rotate(-8deg);
		}
	}

	.recap {
		display: flex;
		justify-content: center;
		gap: 0.25rem;
		margin-bottom: 1.75rem;
	}

	.recap-star {
		color: rgb(58 33 25 / 0.18);
		animation: twinkle 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) both;
		animation-delay: calc(0.7s + var(--i) * 70ms);
	}

	.recap-star.on {
		color: var(--terracotta);
	}

	@keyframes twinkle {
		from {
			opacity: 0;
			transform: scale(0.2) rotate(-90deg);
		}
	}

	@keyframes card-in {
		from {
			opacity: 0;
			transform: scale(0.96);
		}
	}

	@keyframes rise {
		from {
			opacity: 0;
			transform: translateY(12px);
		}
	}
</style>
