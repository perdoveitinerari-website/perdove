<script lang="ts">
	let { eyebrow, title, lead }: { eyebrow: string; title: string; lead?: string } = $props();
</script>

<header class="page-hero">
	<svg class="route" viewBox="0 0 1200 220" preserveAspectRatio="none" aria-hidden="true">
		<path d="M-20 190 C 220 190 260 70 470 100 S 820 200 960 90 S 1150 30 1240 40" />
	</svg>
	<div class="container">
		<p class="eyebrow">{eyebrow}</p>
		<h1>{title}</h1>
		{#if lead}<p class="lead">{lead}</p>{/if}
	</div>
</header>

<style>
	.page-hero {
		position: relative;
		padding: clamp(3rem, 8vw, 6rem) 0 clamp(2.5rem, 5vw, 4rem);
		margin-top: calc(-1 * var(--header-h));
		padding-top: calc(var(--header-h) + clamp(2.5rem, 7vw, 5rem));
		background: linear-gradient(180deg, #e3eef4 0%, var(--bg) 100%);
		overflow: hidden;
		isolation: isolate;
	}

	.route {
		position: absolute;
		left: 0;
		right: 0;
		bottom: 0;
		width: 100%;
		height: 70%;
		z-index: -1;
		opacity: 0.6;
	}

	.route > path {
		fill: none;
		stroke: var(--terracotta);
		stroke-width: 2;
		stroke-dasharray: 3 11;
		stroke-linecap: round;
		vector-effect: non-scaling-stroke;
		animation: dash 30s linear infinite;
	}

	@keyframes dash {
		to {
			stroke-dashoffset: -280;
		}
	}

	h1,
	.eyebrow,
	.lead {
		animation: rise 0.8s var(--ease-out) both;
	}

	h1 {
		animation-delay: 70ms;
		max-width: 18ch;
	}

	.lead {
		animation-delay: 140ms;
		max-width: 56ch;
		margin: 0;
	}

	@keyframes rise {
		from {
			opacity: 0;
			transform: translateY(18px);
		}
	}
</style>
