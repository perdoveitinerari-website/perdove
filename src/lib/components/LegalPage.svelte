<script lang="ts">
	import type { Snippet } from 'svelte';
	import PageHero from './PageHero.svelte';

	let { title, eyebrow, updated, children }: { title: string; eyebrow: string; updated: string; children: Snippet } =
		$props();
</script>

<PageHero {eyebrow} {title} lead={`Ultimo aggiornamento: ${updated}`} />

<section class="legal">
	<div class="container prose">
		{@render children()}
	</div>
</section>

<style>
	.prose {
		max-width: 760px;
	}

	.prose :global(h2) {
		font-size: var(--step-2);
		margin-top: 2.5rem;
	}

	.prose :global(h3) {
		margin-top: 1.75rem;
	}

	.prose :global(p),
	.prose :global(li) {
		color: #4d362e;
	}

	.prose :global(ul) {
		padding-left: 1.2rem;
		margin: 0 0 1.25rem;
	}

	.prose :global(li + li) {
		margin-top: 0.4rem;
	}

	.prose :global(li::marker) {
		color: var(--terracotta);
	}

	.prose :global(.box) {
		padding: 1.25rem 1.5rem;
		border-radius: var(--radius);
		background: var(--glacier-soft);
		margin-bottom: 1.5rem;
	}

	.prose :global(.box p:last-child) {
		margin: 0;
	}
</style>
