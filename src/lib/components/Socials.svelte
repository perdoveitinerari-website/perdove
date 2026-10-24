<script lang="ts">
	import Icon from './Icon.svelte';
	import { site } from '#lib/config.ts';
	import { trackAttrs, EVENTS } from '#lib/analytics.ts';

	let { position = 'footer' }: { position?: string } = $props();

	const items = [
		{ id: 'instagram', label: 'Instagram', href: site.social.instagram },
		{ id: 'tiktok', label: 'TikTok', href: site.social.tiktok },
		{ id: 'facebook', label: 'Facebook', href: site.social.facebook as string }
	];
</script>

<ul class="socials">
	{#each items as item (item.id)}
		<li>
			{#if item.href && item.href !== '#'}
				<a
					href={item.href}
					target="_blank"
					rel="noopener noreferrer"
					aria-label={`PerDove su ${item.label} (si apre in una nuova scheda)`}
					{...trackAttrs(EVENTS.social, { rete: item.id, posizione: position })}
				>
					<Icon name={item.id} size={18} />
				</a>
			{:else}
				<!-- Placeholder until the page exists: no dead "#" link for users or crawlers. -->
				<span class="soon" title={`${item.label}: presto online`}>
					<Icon name={item.id} size={18} />
					<span class="visually-hidden">{item.label}: presto online</span>
				</span>
			{/if}
		</li>
	{/each}
</ul>

<style>
	.socials {
		display: flex;
		gap: 0.6rem;
		list-style: none;
		margin: 0;
		padding: 0;
	}

	a,
	.soon {
		display: grid;
		place-items: center;
		width: 44px;
		height: 44px;
		border-radius: 50%;
		border: 1.5px solid currentColor;
		color: inherit;
		transition:
			background-color 0.25s,
			color 0.25s,
			transform 0.3s var(--ease-out);
	}

	a:hover {
		background: var(--bisque);
		border-color: var(--bisque);
		color: var(--espresso);
		transform: translateY(-3px);
	}

	.soon {
		opacity: 0.45;
		cursor: default;
	}
</style>
