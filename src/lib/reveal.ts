/**
 * Scroll-reveal attachment: `<div {@attach reveal()}>` or `{@attach reveal(120)}` for a stagger delay (ms).
 * One shared IntersectionObserver for the whole page; elements reveal once.
 */
import type { Attachment } from 'svelte/attachments';

let observer: IntersectionObserver | undefined;

function getObserver() {
	observer ??= new IntersectionObserver(
		(entries) => {
			for (const entry of entries) {
				if (!entry.isIntersecting) continue;
				entry.target.classList.add('is-visible');
				observer!.unobserve(entry.target);
			}
		},
		{ rootMargin: '0px 0px -8% 0px', threshold: 0.12 }
	);
	return observer;
}

export function reveal(delay = 0): Attachment<HTMLElement> {
	return (node) => {
		// Content already on screen at hydration stays put (no flash); the rest fades in on scroll.
		if (node.getBoundingClientRect().top < window.innerHeight * 0.92) return;
		node.classList.add('reveal');
		if (delay) node.style.setProperty('--reveal-delay', `${delay}ms`);
		const io = getObserver();
		io.observe(node);
		return () => io.unobserve(node);
	};
}
