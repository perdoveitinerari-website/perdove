<script lang="ts">
	let { tone = 'dark', compact = false }: { tone?: 'dark' | 'light'; compact?: boolean } = $props();
</script>

<span class="logo" class:light={tone === 'light'} class:compact>
	<svg class="mark" viewBox="0 0 64 64" aria-hidden="true">
		<circle cx="32" cy="34" r="25" fill="#D2E2EC" />
		<path d="M8.5 42.55 L19 31 L26 37.5 L38 25 L55.5 42.55 A25 25 0 0 1 8.5 42.55Z" fill="#3A2119" />
		<path d="M38 25 L55.5 42.55 A25 25 0 0 1 40.55 57.5 C46 48 44 37 38 25Z" fill="#C98A6B" />
		<path
			d="M27.7 58.6 C27 52 37.5 50.5 34.5 45.5 C32.8 42.6 36.5 40.5 35.5 38"
			fill="none"
			stroke="#F6EBDD"
			stroke-width="3.6"
			stroke-linecap="round"
		/>
		<path class="ring" d="M41.75 60.78 A28.5 28.5 0 0 1 11.85 13.85" fill="none" stroke-width="3" stroke-linecap="round" />
		<g class="pin">
			<path
				d="M33 5c-5.8 0-10.5 4.6-10.5 10.3 0 7.6 10.5 17.7 10.5 17.7s10.5-10.1 10.5-17.7C43.5 9.6 38.8 5 33 5z"
				fill="#3A2119"
				stroke="#F6EBDD"
				stroke-width="1.6"
			/>
			<circle cx="33" cy="15.3" r="4" fill="#F6EBDD" />
		</g>
	</svg>
	{#if !compact}
		<span class="word"><span class="per">Per</span><span class="dove">Dove</span></span>
	{/if}
</span>

<style>
	.logo {
		display: inline-flex;
		align-items: center;
		gap: 0.55rem;
		line-height: 1;
	}

	.mark {
		width: 2.6rem;
		height: 2.6rem;
		flex: none;
		overflow: visible;
	}

	.ring {
		stroke: #79a3c3;
	}

	.pin {
		transform-origin: 33px 33px;
		transition: transform 0.45s var(--ease-out);
	}

	:global(a:hover) > .logo .pin {
		transform: translateY(-3px);
	}

	.word {
		font-family: var(--font-display);
		font-size: 1.65rem;
		font-weight: 560;
		letter-spacing: -0.02em;
	}

	.per {
		color: var(--espresso);
	}

	.dove {
		color: #5b8bb0;
	}

	.light .per {
		color: #fff;
	}

	.light .dove {
		color: var(--glacier);
	}
</style>
