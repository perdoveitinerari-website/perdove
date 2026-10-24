<script lang="ts">
	import { page } from '$app/state';
	import { afterNavigate } from '$app/navigation';
	import Logo from './Logo.svelte';
	import Icon from './Icon.svelte';
	import { trackAttrs, EVENTS } from '#lib/analytics.ts';

	const links = [
		{ href: '/itinerari', label: 'Itinerari' },
		{ href: '/#come-funziona', label: 'Come funziona' },
		{ href: '/faq', label: 'FAQ' },
		{ href: '/contatti', label: 'Contatti' }
	];

	let scrolled = $state(false);
	let open = $state(false);
	let toggle: HTMLButtonElement | undefined = $state();

	const isActive = (href: string) =>
		!href.includes('#') && (page.url.pathname === href || page.url.pathname.startsWith(`${href}/`));

	afterNavigate(() => (open = false));

	$effect(() => {
		const onScroll = () => (scrolled = window.scrollY > 8);
		onScroll();
		window.addEventListener('scroll', onScroll, { passive: true });
		return () => window.removeEventListener('scroll', onScroll);
	});

	$effect(() => {
		document.documentElement.style.overflow = open ? 'hidden' : '';
		if (!open) return;
		const onKey = (e: KeyboardEvent) => {
			if (e.key === 'Escape') {
				open = false;
				toggle?.focus();
			}
		};
		window.addEventListener('keydown', onKey);
		return () => window.removeEventListener('keydown', onKey);
	});
</script>

<a class="skip" href="#contenuto">Vai al contenuto</a>

<header class="header" class:scrolled class:open>
	<div class="container bar">
		<a href="/" class="brand" aria-label="PerDove, torna alla home">
			<Logo />
		</a>

		<nav class="nav" aria-label="Navigazione principale">
			<ul>
				{#each links as link (link.href)}
					<li>
						<a href={link.href} aria-current={isActive(link.href) ? 'page' : undefined}>{link.label}</a>
					</li>
				{/each}
			</ul>
		</nav>

		<a class="btn cta" href="/itinerari" {...trackAttrs(EVENTS.cta, { posizione: 'header' })}>
			Scarica gratis
			<Icon name="download" />
		</a>

		<button
			bind:this={toggle}
			class="toggle"
			aria-expanded={open}
			aria-controls="menu-mobile"
			onclick={() => (open = !open)}
		>
			<span class="visually-hidden">{open ? 'Chiudi il menu' : 'Apri il menu'}</span>
			<span class="burger" aria-hidden="true"><span></span><span></span><span></span></span>
		</button>
	</div>

	<div id="menu-mobile" class="drawer" hidden={!open}>
		<nav aria-label="Menu mobile">
			<ul>
				{#each links as link, i (link.href)}
					<li style:--i={i}>
						<a href={link.href} aria-current={isActive(link.href) ? 'page' : undefined}>
							{link.label}
							<Icon name="arrow" />
						</a>
					</li>
				{/each}
			</ul>
			<a class="btn drawer-cta" href="/itinerari" {...trackAttrs(EVENTS.cta, { posizione: 'menu-mobile' })}>
				Scopri gli itinerari gratuiti
			</a>
		</nav>
	</div>
</header>

<style>
	.skip {
		position: fixed;
		left: 1rem;
		top: -100px;
		z-index: 100;
		padding: 0.75rem 1.25rem;
		background: var(--espresso);
		color: #fff;
		border-radius: 999px;
		font-weight: 700;
		text-decoration: none;
	}

	.skip:focus {
		top: 1rem;
	}

	.header {
		position: sticky;
		top: 0;
		z-index: 50;
		transition:
			background-color 0.35s,
			box-shadow 0.35s,
			backdrop-filter 0.35s;
	}

	.header.scrolled,
	.header.open {
		background: rgb(251 247 242 / 0.86);
		backdrop-filter: saturate(1.4) blur(14px);
		-webkit-backdrop-filter: saturate(1.4) blur(14px);
		box-shadow: 0 1px 0 var(--line);
	}

	.bar {
		display: flex;
		align-items: center;
		gap: 1.5rem;
		height: var(--header-h);
	}

	.brand {
		text-decoration: none;
		margin-right: auto;
		border-radius: 12px;
	}

	.nav ul {
		display: flex;
		gap: 0.25rem;
		list-style: none;
		margin: 0;
		padding: 0;
	}

	.nav a {
		position: relative;
		display: block;
		padding: 0.5rem 0.9rem;
		color: var(--espresso);
		text-decoration: none;
		font-weight: 600;
		font-size: 0.96rem;
	}

	.nav a::after {
		content: '';
		position: absolute;
		left: 0.9rem;
		right: 0.9rem;
		bottom: 0.2rem;
		height: 2px;
		border-radius: 2px;
		background: var(--terracotta);
		transform: scaleX(0);
		transform-origin: left;
		transition: transform 0.35s var(--ease-out);
	}

	.nav a:hover::after,
	.nav a[aria-current='page']::after {
		transform: scaleX(1);
	}

	.cta {
		min-height: 42px;
		padding-inline: 1.15em;
		font-size: 0.92rem;
	}

	.toggle {
		display: none;
		width: 48px;
		height: 48px;
		margin-right: -8px;
		border: 0;
		background: none;
		cursor: pointer;
		border-radius: 12px;
	}

	.burger {
		position: relative;
		display: block;
		width: 22px;
		height: 14px;
		margin: auto;
	}

	.burger span {
		position: absolute;
		left: 0;
		width: 100%;
		height: 2px;
		border-radius: 2px;
		background: var(--espresso);
		transition:
			transform 0.35s var(--ease-out),
			opacity 0.2s;
	}

	.burger span:nth-child(1) {
		top: 0;
	}
	.burger span:nth-child(2) {
		top: 6px;
	}
	.burger span:nth-child(3) {
		top: 12px;
	}

	.open .burger span:nth-child(1) {
		transform: translateY(6px) rotate(45deg);
	}
	.open .burger span:nth-child(2) {
		opacity: 0;
	}
	.open .burger span:nth-child(3) {
		transform: translateY(-6px) rotate(-45deg);
	}

	.drawer {
		position: fixed;
		inset: var(--header-h) 0 0;
		background: var(--bg);
		overflow-y: auto;
		padding: 1.5rem var(--gutter) calc(2rem + env(safe-area-inset-bottom));
	}

	.drawer ul {
		list-style: none;
		margin: 0 0 2rem;
		padding: 0;
	}

	.drawer li {
		border-bottom: 1px solid var(--line);
		animation: drawer-in 0.5s var(--ease-out) both;
		animation-delay: calc(var(--i) * 60ms + 60ms);
	}

	.drawer li a {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 1.1rem 0.25rem;
		font-family: var(--font-display);
		font-size: 1.7rem;
		color: var(--espresso);
		text-decoration: none;
	}

	.drawer li a[aria-current='page'] {
		color: var(--clay-ink);
	}

	.drawer-cta {
		width: 100%;
	}

	@keyframes drawer-in {
		from {
			opacity: 0;
			transform: translateY(14px);
		}
	}

	@media (max-width: 900px) {
		.nav,
		.cta {
			display: none;
		}

		.toggle {
			display: block;
		}
	}
</style>
