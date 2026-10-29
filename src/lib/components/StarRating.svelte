<script lang="ts" module>
	export const MOODS = ['', 'Da migliorare', 'Così così', 'Bene', 'Molto bene', 'Fantastico!'];
</script>

<script lang="ts">
	import { STAR_PATH } from './Icon.svelte';

	let {
		value = $bindable(0),
		invalid = false,
		describedby,
		onchange
	}: { value?: number; invalid?: boolean; describedby?: string; onchange?: () => void } = $props();

	let hover = $state(0);
	// Bumped on every pick: the {#key} blocks below re-run the pop and sparkle animations.
	let burst = $state(0);
	const shown = $derived(hover || value);

	function pick(n: number) {
		value = n;
		burst++;
		onchange?.();
	}
</script>

<fieldset class="rating" class:invalid aria-describedby={describedby}>
	<legend>Quanto ti è piaciuto? <span aria-hidden="true">*</span></legend>
	<div class="stars" role="presentation" onpointerleave={() => (hover = 0)}>
		{#each [1, 2, 3, 4, 5] as n (n)}
			<label
				class="star"
				class:on={n <= shown}
				class:preview={hover > 0 && n <= hover && n > value}
				style:--i={n}
				onpointerenter={(e) => e.pointerType === 'mouse' && (hover = n)}
			>
				<input
					type="radio"
					name="voto"
					value={n}
					checked={value === n}
					onchange={() => pick(n)}
				/>
				<span class="visually-hidden">{n} {n === 1 ? 'stella' : 'stelle'} su 5: {MOODS[n]}</span>
				{#key burst && n <= value ? burst : 0}
					<svg
						class="shape"
						class:jump={burst > 0 && n <= value}
						class:hero={burst > 0 && n === value}
						class:top={value === 5}
						viewBox="0 0 24 24"
						aria-hidden="true"
					>
						<path d={STAR_PATH} />
					</svg>
					{#if burst > 0 && n === value}
						<span class="sparks" aria-hidden="true">
							{#each { length: 8 } as _, k (k)}<span style:--a={`${k * 45 + 22}deg`}></span>{/each}
						</span>
					{/if}
				{/key}
			</label>
		{/each}
	</div>
	<p class="mood" aria-hidden="true">
		{#key shown}
			<span class:empty={!shown}>{shown ? MOODS[shown] : 'Tocca una stella'}</span>
		{/key}
	</p>
</fieldset>

<style>
	.rating {
		margin: 0;
		padding: 0;
		border: 0;
		min-width: 0;
	}

	legend {
		padding: 0;
		margin-bottom: 0.4rem;
		font-weight: 700;
		font-size: 0.95rem;
	}

	.stars {
		display: flex;
		gap: 0.15rem;
		margin-left: -6px;
	}

	.star {
		position: relative;
		display: grid;
		place-items: center;
		width: 52px;
		height: 52px;
		cursor: pointer;
		border-radius: 14px;
		-webkit-tap-highlight-color: transparent;
	}

	.star input {
		position: absolute;
		inset: 0;
		margin: 0;
		opacity: 0;
		cursor: pointer;
	}

	.star:has(input:focus-visible) {
		outline: 3px solid var(--chambray);
		outline-offset: -2px;
	}

	.shape {
		width: 38px;
		height: 38px;
		overflow: visible;
		pointer-events: none;
		transition: transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
		/* Stagger hover previews from left to right, like a wave. */
		transition-delay: calc((var(--i) - 1) * 25ms);
	}

	.shape path {
		fill: var(--surface);
		stroke: rgb(58 33 25 / 0.32);
		stroke-width: 1.6;
		stroke-linejoin: round;
		transition:
			fill 0.25s,
			stroke 0.25s;
		transition-delay: inherit;
	}

	.invalid .shape path {
		stroke: #b4441d;
	}

	.on .shape path {
		fill: var(--terracotta);
		stroke: var(--clay-ink);
	}

	.preview .shape path {
		fill: var(--bisque);
		stroke: var(--terracotta);
	}

	@media (hover: hover) {
		.star:hover .shape {
			transform: scale(1.18) rotate(-8deg);
			transition-delay: 0ms;
		}
	}

	.star:active .shape {
		transform: scale(0.86);
		transition-duration: 0.1s;
	}

	/* Every lit star hops in sequence; the picked one pops bigger. */
	.jump {
		animation: hop 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) both;
		animation-delay: calc((var(--i) - 1) * 45ms);
	}

	.hero {
		animation-name: pop;
		animation-duration: 0.6s;
	}

	/* Five stars: the last one does a full star-turn (72° looks identical at rest). */
	.hero.top {
		animation-name: pop-spin;
		animation-duration: 0.8s;
	}

	@keyframes hop {
		40% {
			transform: translateY(-9px) scale(1.08);
		}
	}

	@keyframes pop {
		0% {
			transform: scale(0.6);
		}
		45% {
			transform: scale(1.35) rotate(-12deg);
		}
		75% {
			transform: scale(0.95) rotate(4deg);
		}
	}

	@keyframes pop-spin {
		0% {
			transform: scale(0.6) rotate(0);
		}
		50% {
			transform: scale(1.4) rotate(216deg);
		}
		100% {
			transform: scale(1) rotate(360deg);
		}
	}

	.sparks {
		position: absolute;
		inset: 0;
		pointer-events: none;
	}

	.sparks span {
		position: absolute;
		left: 50%;
		top: 50%;
		width: 6px;
		height: 6px;
		margin: -3px;
		border-radius: 50%;
		background: var(--terracotta);
		opacity: 0;
		animation: spark 0.6s var(--ease-out) both;
		animation-delay: calc((var(--i) - 1) * 45ms + 120ms);
	}

	.sparks span:nth-child(even) {
		width: 4px;
		height: 4px;
		margin: -2px;
		background: var(--chambray);
	}

	@keyframes spark {
		0% {
			opacity: 1;
			transform: rotate(var(--a)) translateY(-10px) scale(1);
		}
		100% {
			opacity: 0;
			transform: rotate(var(--a)) translateY(-34px) scale(0.3);
		}
	}

	.mood {
		position: relative;
		height: 1.6em;
		margin: 0.15rem 0 0;
		font-weight: 700;
		color: var(--clay-ink);
	}

	.mood span {
		position: absolute;
		left: 0;
		animation: mood-in 0.35s var(--ease-out) both;
	}

	.mood .empty {
		font-weight: 500;
		color: var(--text-muted);
	}

	@keyframes mood-in {
		from {
			opacity: 0;
			transform: translateY(8px);
		}
	}

	@media (max-width: 360px) {
		.star {
			width: 46px;
			height: 46px;
		}

		.shape {
			width: 34px;
			height: 34px;
		}
	}
</style>
