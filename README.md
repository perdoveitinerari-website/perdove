# PerDove – perdove.com

Static website for PerDove, free travel itineraries in PDF. Built with SvelteKit (Svelte 5) and
`@sveltejs/adapter-static`, deployed on GitHub Pages. All visitor-facing content is in Italian.

## Development

```sh
npm install
npm run dev        # http://localhost:5173
npm run check      # type and Svelte checks
npm run build      # static site in ./build
npm run preview    # serve the production build
```

## Where things live

| What | Where |
| --- | --- |
| Third-party IDs (Formspree, Umami), site URL, e-mail, social links | `src/lib/config.ts` |
| Itinerary content (days, attractions, hotels, budget…) | `src/lib/data/itineraries.ts` |
| Downloadable PDFs (optimized) | `static/itinerari/` |
| Responsive photos (WebP) | `src/lib/assets/img/` |
| Favicons, manifest, OG images, robots.txt, CNAME | `static/` |
| Original assets (logo, banner, brand mark, source PDFs) | `assets-source/` |
| Pages | `src/routes/` (home, `itinerari`, `itinerari/[slug]`, `contatti`, `faq`, `privacy`, `termini`, `+error`, `sitemap.xml`) |
| Design tokens, buttons, global styles | `src/app.css` |

## Connecting the services

Both IDs are public by design (they end up in the page), so they go straight into `src/lib/config.ts`.

- **Contact form (Formspree)**: create a form at formspree.io, copy the ID after `/f/` into
  `FORMSPREE_FORM_ID`. Until then the form validates but shows a message with the e-mail address
  instead of sending. Spam protection: honeypot field + minimum fill time (+ Formspree's own filter).
- **Analytics (Umami)**: create a website in Umami Cloud and paste its ID into `UMAMI.websiteId`.
  Umami is cookieless, so no cookie banner is required. Tracked events:

  | Event | Data | When |
  | --- | --- | --- |
  | `pdf-download` | `itinerario`, `posizione` | "Scarica il PDF" clicked |
  | `pdf-view` | `itinerario`, `posizione` | "Visualizza online" clicked |
  | `mappa-interattiva` | `itinerario`, `giorno` | a day's Wanderlog map opened |
  | `filtro-regione` | `regione` | Italia / Europa / Resto del mondo filter used |
  | `cta` | `posizione` | main call-to-action buttons |
  | `social` | `rete`, `posizione` | social profile opened |
  | `contatto-inviato` | `oggetto` | contact form sent successfully |

  Page views are tracked automatically.

- **Facebook**: put the page URL in `site.social.facebook`; while it is `'#'` the icon is shown
  greyed out with no link.

## Adding a new itinerary

1. Put the PDF in `assets-source/pdf/` and add an entry to `ITINERARIES` in
   `scripts/prepare-assets.py` (it compresses the PDF and extracts cover/landscape photos).
2. Run `python scripts/prepare-assets.py` (needs `pip install pymupdf pillow`).
3. Add the itinerary to `src/lib/data/itineraries.ts` (region `italia`, `europa` or `mondo`).
   The page, catalogue filters, sitemap and footer pick it up automatically.

## Deploying to GitHub Pages

The workflow in `.github/workflows/deploy.yml` builds and publishes on every push to `main`.

1. Push the repository to GitHub.
2. Repository **Settings → Pages → Source: GitHub Actions**.
3. Custom domain: `static/CNAME` already contains `perdove.com`. At the DNS provider add the
   GitHub Pages `A`/`AAAA` records for the apex domain and a `CNAME` `www → <user>.github.io`,
   then tick **Enforce HTTPS** in the Pages settings once the certificate is issued.
4. After the first deploy, check `https://perdove.com`, `/sitemap.xml`, `/robots.txt` and a missing
   URL (custom 404), then submit the sitemap in Google Search Console.

Note: the original PDFs in `assets-source/pdf/` are git-ignored because of their size (≈67 MB);
the optimized copies in `static/itinerari/` are what the site serves.
