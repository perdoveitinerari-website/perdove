/**
 * Thin wrapper around Umami. Clicks are mostly tracked declaratively with
 * `data-umami-event` / `data-umami-event-*` attributes (see `trackAttrs`);
 * use `track()` for events that are not a click (form submissions, filters).
 */

type EventData = Record<string, string | number>;

declare global {
	interface Window {
		umami?: { track: (event: string, data?: EventData) => void };
	}
}

export const EVENTS = {
	pdfDownload: 'pdf-download',
	pdfView: 'pdf-view',
	filter: 'filtro-regione',
	social: 'social',
	cta: 'cta',
	contactSent: 'contatto-inviato'
} as const;

export function track(event: string, data?: EventData): void {
	try {
		window.umami?.track(event, data);
	} catch {
		// Analytics must never break the page.
	}
}

/** Spreads Umami's declarative attributes on an element: `<a {...trackAttrs('cta', { posizione: 'hero' })}>`. */
export function trackAttrs(event: string, data: EventData = {}): Record<string, string> {
	const attrs: Record<string, string> = { 'data-umami-event': event };
	for (const [key, value] of Object.entries(data)) attrs[`data-umami-event-${key}`] = String(value);
	return attrs;
}
