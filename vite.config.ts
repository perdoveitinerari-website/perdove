import adapter from '@sveltejs/adapter-static';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [
		sveltekit({
			compilerOptions: {
				// Force runes mode for the project, except for libraries. Can be removed in svelte 6.
				runes: ({ filename }) =>
					filename.split(/[/\\]/).includes('node_modules') ? undefined : true
			},

			// Fully static output for GitHub Pages. `404.html` lets Pages serve the custom error page.
			adapter: adapter({ fallback: '404.html' }),
			prerender: {
				handleHttpError: ({ path, message }) => {
					// PDFs and static files are copied as-is; anything else that 404s is a real broken link.
					if (path.startsWith('/itinerari/') && path.endsWith('.pdf')) return;
					throw new Error(message);
				}
			}
		})
	]
});
