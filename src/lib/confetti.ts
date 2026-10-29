/**
 * Tiny dependency-free confetti burst on a throwaway canvas. Loaded lazily with
 * `import('#lib/confetti.ts')` so it never weighs on the first page load.
 * Does nothing when the visitor prefers reduced motion.
 */

const COLORS = ['#c98a6b', '#ebcdb7', '#79a3c3', '#d2e2ec', '#957662', '#3a2119', '#f5e6da'];

type Piece = {
	x: number;
	y: number;
	vx: number;
	vy: number;
	size: number;
	rot: number;
	vr: number;
	flip: number;
	vflip: number;
	color: string;
	round: boolean;
};

const rand = (min: number, max: number) => min + Math.random() * (max - min);

/** Fires a burst from viewport point (x, y). Resolves when the last piece has left the screen. */
export function confetti(x: number, y: number, count = 130): Promise<void> {
	if (matchMedia('(prefers-reduced-motion: reduce)').matches) return Promise.resolve();

	const canvas = document.createElement('canvas');
	canvas.setAttribute('aria-hidden', 'true');
	Object.assign(canvas.style, { position: 'fixed', inset: '0', width: '100%', height: '100%', pointerEvents: 'none', zIndex: '80' });
	document.body.append(canvas);

	const ctx = canvas.getContext('2d')!;
	const dpr = Math.min(window.devicePixelRatio || 1, 2);
	const w = window.innerWidth;
	const h = window.innerHeight;
	canvas.width = w * dpr;
	canvas.height = h * dpr;
	ctx.scale(dpr, dpr);

	// Smaller screens get a gentler burst so it doesn't swallow the whole page.
	const power = Math.min(1, Math.max(0.65, w / 1100));
	const pieces: Piece[] = Array.from({ length: count }, () => {
		const angle = -Math.PI / 2 + rand(-1, 1) * 1.15;
		const speed = rand(7, 17) * power;
		return {
			x,
			y,
			vx: Math.cos(angle) * speed,
			vy: Math.sin(angle) * speed,
			size: rand(6, 11),
			rot: rand(0, Math.PI * 2),
			vr: rand(-0.25, 0.25),
			flip: rand(0, Math.PI * 2),
			vflip: rand(0.08, 0.22),
			color: COLORS[(Math.random() * COLORS.length) | 0],
			round: Math.random() < 0.3
		};
	});

	return new Promise((resolve) => {
		let last = performance.now();
		const started = last;

		const frame = (now: number) => {
			// Normalise to 60 fps steps so the burst looks the same on 120 Hz screens.
			const dt = Math.min((now - last) / 16.67, 3);
			last = now;
			ctx.clearRect(0, 0, w, h);

			let alive = 0;
			for (const p of pieces) {
				p.vx *= Math.pow(0.97, dt);
				p.vy = p.vy * Math.pow(0.97, dt) + 0.38 * dt;
				p.x += p.vx * dt + Math.sin(p.flip) * 0.6;
				p.y += p.vy * dt;
				p.rot += p.vr * dt;
				p.flip += p.vflip * dt;
				if (p.y > h + 20) continue;
				alive++;

				ctx.save();
				ctx.translate(p.x, p.y);
				ctx.rotate(p.rot);
				// Scaling one axis with cos() fakes a paper strip tumbling in 3D.
				ctx.scale(1, Math.cos(p.flip));
				ctx.fillStyle = p.color;
				if (p.round) {
					ctx.beginPath();
					ctx.arc(0, 0, p.size / 2.4, 0, Math.PI * 2);
					ctx.fill();
				} else {
					ctx.fillRect(-p.size / 2, -p.size / 3.2, p.size, p.size / 1.6);
				}
				ctx.restore();
			}

			if (alive && now - started < 6000) {
				requestAnimationFrame(frame);
			} else {
				canvas.remove();
				resolve();
			}
		};
		requestAnimationFrame(frame);
	});
}
