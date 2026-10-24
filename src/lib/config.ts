/**
 * Site-wide settings. Third-party IDs below are public by design (they end up in the HTML),
 * so they are not secrets: paste them here when the accounts are ready.
 */
export const site = {
	name: 'PerDove',
	tagline: 'Itinerari che ti portano lontano',
	url: 'https://perdove.com',
	email: 'perdoveitinerari@gmail.com',
	locale: 'it_IT',
	defaultOgImage: '/og/perdove.jpg',
	social: {
		// TODO: replace with the real Facebook page URL when available.
		facebook: '#',
		instagram: 'https://www.instagram.com/perdoveitinerari/',
		tiktok: 'https://www.tiktok.com/@perdove'
	}
} as const;

/**
 * Formspree (https://formspree.io): create a form and paste its ID (the part after /f/).
 * While empty, the contact form shows a fallback with the e-mail address.
 */
export const FORMSPREE_FORM_ID = 'xrppezzb';

/**
 * Umami analytics (https://umami.is, cookieless and GDPR-friendly, no consent banner needed).
 * Paste the Website ID from Umami Cloud > Settings > Websites. Leave empty to disable tracking.
 * `src` only changes if you self-host Umami.
 */
export const UMAMI = {
	websiteId: '08475efd-cc3a-47e5-81fa-b3917c88402e',
	src: 'https://cloud.umami.is/script.js',
	domains: 'perdove.com,www.perdove.com'
} as const;
