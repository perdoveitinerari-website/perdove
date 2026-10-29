<script lang="ts">
	import Logo from './Logo.svelte';
	import Socials from './Socials.svelte';
	import { site } from '#lib/config.ts';
	import { REGIONS } from '#lib/data/itineraries.ts';
</script>

<footer class="footer">
	<svg class="wave" viewBox="0 0 1440 60" preserveAspectRatio="none" aria-hidden="true">
		<path d="M0 60V28C180 4 360 0 540 14s360 40 540 30 270-34 360-40v68z" />
	</svg>
	<div class="container">
		<div class="top">
			<div class="brand">
				<a href="/" class="logo-link" aria-label="PerDove, torna alla home"><Logo tone="light" /></a>
				<p>
					Itinerari di viaggio gratuiti, pratici e curati con passione, da consultare online o portare con te durante il
					viaggio.
				</p>
				<Socials />
			</div>

			<nav aria-label="Destinazioni">
				<h2>Destinazioni</h2>
				<ul>
					{#each REGIONS as region (region.id)}
						<li><a href={`/itinerari?regione=${region.id}`}>{region.label}</a></li>
					{/each}
				</ul>
			</nav>

			<nav aria-label="Informazioni">
				<h2>Informazioni</h2>
				<ul>
					<li><a href="/faq">Domande frequenti</a></li>
					<li><a href="/contatti">Contatti</a></li>
					<li><a href="/feedback">Lascia un feedback</a></li>
					<li><a href="/privacy">Privacy Policy</a></li>
					<li><a href="/termini">Termini e condizioni</a></li>
				</ul>
			</nav>
		</div>

		<div class="bottom">
			<p>© Copyright 2026. perdove.com. All Rights Reserved.</p>
			<a href={`mailto:${site.email}`}>{site.email}</a>
		</div>
	</div>
</footer>

<style>
	.footer {
		position: relative;
		margin-top: clamp(3rem, 8vw, 6rem);
		background: var(--espresso);
		color: #f3e7dc;
		padding: clamp(3rem, 7vw, 5rem) 0 calc(1.5rem + env(safe-area-inset-bottom));
	}

	.wave {
		position: absolute;
		left: 0;
		bottom: calc(100% - 1px);
		width: 100%;
		height: clamp(24px, 4vw, 60px);
		fill: var(--espresso);
	}

	.top {
		display: grid;
		grid-template-columns: 1.6fr repeat(2, 1fr);
		gap: 2.5rem;
	}

	.brand p {
		max-width: 34ch;
		margin: 1.25rem 0 1.5rem;
		color: #dcc8b9;
	}

	.logo-link {
		display: inline-block;
		text-decoration: none;
	}

	h2 {
		font-family: var(--font-body);
		font-size: 0.8rem;
		font-weight: 800;
		letter-spacing: 0.16em;
		text-transform: uppercase;
		color: var(--bisque);
		margin-bottom: 1rem;
	}

	ul {
		list-style: none;
		margin: 0;
		padding: 0;
	}

	li + li {
		margin-top: 0.55rem;
	}

	a {
		color: #f3e7dc;
		text-decoration: none;
	}

	nav a:hover,
	.bottom a:hover {
		color: #fff;
		text-decoration: underline;
	}

	.bottom {
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
		gap: 0.75rem 2rem;
		margin-top: 3rem;
		padding-top: 1.5rem;
		border-top: 1px solid rgb(255 255 255 / 0.14);
		font-size: 0.9rem;
		color: #cdb6a6;
	}

	.bottom p {
		margin: 0;
	}

	@media (max-width: 900px) {
		.top {
			grid-template-columns: 1fr 1fr;
		}

		.brand {
			grid-column: 1 / -1;
		}
	}

	@media (max-width: 420px) {
		.top {
			grid-template-columns: 1fr;
		}
	}
</style>
