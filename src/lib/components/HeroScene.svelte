<script lang="ts">
	// Illustrated take-off scene. The plane follows the runway + climb path with SMIL
	// (animateMotion keeps it in SVG user units at any size); the dashed trail is revealed
	// by a mask whose dash offset uses the same timing, so it stays glued to the plane.
	let svg: SVGSVGElement | undefined = $state();

	const DUR = '13s';
	const FLIGHT = 'M-90 441 L560 441 C760 441 880 384 1010 300 S1250 112 1560 -60';
	// keyTimes: rolling + climbing in the first 72%, then a pause off-screen before the loop.
	const KEY_TIMES = '0;0.72;1';
	const SPLINES = '0.5 0 0.6 0.95;0 0 1 1';

	$effect(() => {
		if (!svg) return;
		const media = window.matchMedia('(prefers-reduced-motion: reduce)');
		const apply = () => {
			if (media.matches) {
				svg!.setCurrentTime(7.2); // freeze on a nice mid-climb frame
				svg!.pauseAnimations();
			} else {
				svg!.unpauseAnimations();
			}
		};
		apply();
		media.addEventListener('change', apply);
		// Pause when the hero is off-screen: no wasted frames while reading the page.
		const io = new IntersectionObserver(([entry]) => {
			if (media.matches) return;
			if (entry.isIntersecting) svg!.unpauseAnimations();
			else svg!.pauseAnimations();
		});
		io.observe(svg);
		return () => {
			media.removeEventListener('change', apply);
			io.disconnect();
		};
	});
</script>

<svg
	bind:this={svg}
	class="scene"
	viewBox="0 0 1440 560"
	preserveAspectRatio="xMidYMax slice"
	role="img"
	aria-label="Illustrazione: un aereo decolla dalla pista e sale verso il cielo, sopra un orizzonte con il Colosseo, la ruota panoramica di Vienna e lo skyline di New York."
>
	<defs>
		<linearGradient id="ground" x1="0" y1="0" x2="0" y2="1">
			<stop offset="0" stop-color="#EBCDB7" />
			<stop offset="1" stop-color="#E2BEA4" />
		</linearGradient>
		<linearGradient id="haze" x1="0" y1="0" x2="0" y2="1">
			<stop offset="0" stop-color="#D2E2EC" stop-opacity="0" />
			<stop offset="1" stop-color="#F3EEE8" />
		</linearGradient>
		<clipPath id="airborne">
			<rect x="-200" y="-200" width="1900" height="634" />
		</clipPath>
		<mask id="trail-mask" maskUnits="userSpaceOnUse" x="-200" y="-200" width="1900" height="900">
			<path
				d={FLIGHT}
				pathLength="1"
				fill="none"
				stroke="#fff"
				stroke-width="40"
				stroke-dasharray="1 1"
				stroke-dashoffset="1"
			>
				<animate
					attributeName="stroke-dashoffset"
					values="1;0;0"
					keyTimes={KEY_TIMES}
					calcMode="spline"
					keySplines={SPLINES}
					dur={DUR}
					begin="0.4s"
					repeatCount="indefinite"
				/>
			</path>
		</mask>
	</defs>

	<!-- Drifting clouds -->
	<g class="clouds" fill="#fff">
		<g class="cloud c1"><path d="M0 40a26 26 0 0 1 48-14 20 20 0 0 1 36 6 16 16 0 0 1 14 8z" /></g>
		<g class="cloud c2"><path d="M0 30a20 20 0 0 1 37-11 16 16 0 0 1 28 5 12 12 0 0 1 11 6z" /></g>
		<g class="cloud c3"><path d="M0 46a30 30 0 0 1 56-16 24 24 0 0 1 42 7 19 19 0 0 1 17 9z" /></g>
	</g>

	<!-- Birds -->
	<g class="birds" fill="none" stroke="#957662" stroke-width="2" stroke-linecap="round">
		<path d="M1080 150q7-7 14 0q7-7 14 0" />
		<path d="M1112 132q5-5 10 0q5-5 10 0" />
		<path d="M1050 128q4-4 8 0q4-4 8 0" />
	</g>

	<!-- Horizon: far hills + landmarks of the three itineraries -->
	<g fill="#C4D8E5">
		<path d="M0 420V352c120-30 230-34 340-14s210 26 330 6 260-60 400-50 270 40 370 60v66z" />
	</g>
	<g fill="#AFC8DA">
		<!-- Colosseo -->
		<path d="M148 420V352q92-34 190-10v78z" />
		<!-- Riesenrad (Vienna) -->
		<g transform="translate(560 336)">
			<circle r="58" fill="none" stroke="#AFC8DA" stroke-width="5" />
			<g stroke="#AFC8DA" stroke-width="2.4">
				<path d="M-58 0h116M0-58v116M-41-41l82 82M41-41l-82 82" />
			</g>
			<circle r="7" />
			<path d="M-6 6-38 84h10L0 18 28 84h10L6 6z" />
			{#each Array.from({ length: 12 }) as _, i (i)}
				<rect
					x={Math.cos((i * Math.PI) / 6) * 58 - 5}
					y={Math.sin((i * Math.PI) / 6) * 58 - 4}
					width="10"
					height="9"
					rx="2"
				/>
			{/each}
		</g>
		<!-- New York skyline with the Empire State Building -->
		<path
			d="M1030 420v-60h34v-22h28v82zM1098 420v-96h40v96zM1146 420v-70h30v70zM1236 420V300h10v-20h6v-14h8v14h6v20h10v120zM1290 420v-84h36v84zM1332 420v-54h44v54z"
		/>
		<path d="M1251 266v-26h2v26z" />
	</g>
	<g fill="#D9E6EE">
		<!-- Colosseo arches -->
		{#each Array.from({ length: 6 }) as _, i (i)}
			<rect x={162 + i * 28} y="372" width="14" height="20" rx="7" />
			<rect x={162 + i * 28} y="398" width="14" height="18" rx="7" />
		{/each}
	</g>
	<rect y="380" width="1440" height="44" fill="url(#haze)" />

	<!-- Ground, control tower and runway -->
	<path d="M0 420c240-10 480-12 720-8s480 10 720 2v146H0z" fill="url(#ground)" />
	<g class="tower" fill="#957662">
		<path d="M262 452V384h14v68z" />
		<path d="M250 384l6-22h40l6 22z" fill="#3A2119" />
		<rect x="254" y="366" width="44" height="10" rx="2" fill="#79A3C3" />
		<circle class="beacon" cx="276" cy="356" r="4" fill="#C98A6B" />
	</g>
	<rect y="457" width="1440" height="16" fill="#5A3B30" />
	<path d="M0 465h1440" stroke="#F4EBE2" stroke-width="2" stroke-dasharray="26 22" />
	<g class="lights" fill="#F6D7A8">
		{#each Array.from({ length: 16 }) as _, i (i)}
			<circle cx={20 + i * 92} cy="477" r="2.4" style:--d={`${i * 0.12}s`} />
		{/each}
	</g>
	<path d="M0 500c300-12 700-10 1440 0v60H0z" fill="#E0B99D" opacity="0.6" />

	<!-- Trail (only visible once airborne) -->
	<g clip-path="url(#airborne)" mask="url(#trail-mask)">
		<path
			d={FLIGHT}
			fill="none"
			stroke="#C98A6B"
			stroke-width="3"
			stroke-linecap="round"
			stroke-dasharray="2 12"
		/>
	</g>

	<!-- Plane (drawn pointing right, centred on 0,0) -->
	<g class="plane">
		<g>
			<animateMotion
				path={FLIGHT}
				rotate="auto"
				keyPoints="0;1;1"
				keyTimes={KEY_TIMES}
				calcMode="spline"
				keySplines={SPLINES}
				dur={DUR}
				begin="0.4s"
				repeatCount="indefinite"
				fill="freeze"
			/>
			<g transform="scale(1.25)">
				<g class="gear" stroke="#3A2119" stroke-width="1.6">
					<animate
						attributeName="opacity"
						values="1;1;0;0;1"
						keyTimes="0;0.36;0.42;0.995;1"
						dur={DUR}
						begin="0.4s"
						repeatCount="indefinite"
					/>
					<path d="M-12 5v7M24 5v7" />
					<circle cx="-12" cy="12.5" r="2.6" fill="#3A2119" />
					<circle cx="24" cy="12.5" r="2.6" fill="#3A2119" />
				</g>
				<path d="M-38 -7 L-47 -27 L-37.5 -27 L-25 -8 Z" fill="#79A3C3" />
				<path d="M-40 -1 L-53 -6 L-48 3 Z" fill="#5B8BB0" />
				<path
					d="M-43 -1.5 C-43 -6.5 -37 -9 -31 -9 L27 -9 C36 -9 44.5 -5 47 0 C44.5 4.5 38 6.5 29 6.5 L-34 6.5 C-40 6.5 -43 3.5 -43 -1.5 Z"
					fill="#fff"
					stroke="#3A2119"
					stroke-width="1.4"
				/>
				<path d="M-42 1.8 H44" stroke="#C98A6B" stroke-width="2" />
				<path d="M36 -7.4 C40 -6.4 43.6 -4 45.4 -1.6 L37.5 -1.6 Z" fill="#3A2119" />
				{#each Array.from({ length: 10 }) as _, i (i)}
					<circle cx={-26 + i * 5.6} cy="-3.4" r="1.45" fill="#5B8BB0" />
				{/each}
				<path d="M-6 1.5 L-24 18 L-13.5 18 L13 2.5 Z" fill="#5B8BB0" />
				<ellipse cx="-4" cy="9" rx="7.5" ry="3.4" fill="#3A2119" />
			</g>
		</g>
	</g>
</svg>

<style>
	.scene {
		display: block;
		width: 100%;
		height: 100%;
	}

	.cloud {
		animation: drift linear infinite;
	}

	.c1 {
		--y: 70px;
		animation-duration: 70s;
		animation-delay: -20s;
	}

	.c2 {
		--y: 190px;
		animation-duration: 95s;
		animation-delay: -60s;
		opacity: 0.85;
	}

	.c3 {
		--y: 250px;
		animation-duration: 120s;
		animation-delay: -10s;
	}

	@keyframes drift {
		from {
			transform: translate(-160px, var(--y));
		}
		to {
			transform: translate(1560px, var(--y));
		}
	}

	.birds {
		animation: birds 9s ease-in-out infinite alternate;
	}

	@keyframes birds {
		to {
			transform: translate(-40px, -14px);
		}
	}

	.beacon {
		animation: blink 1.6s ease-in-out infinite;
	}

	.lights circle {
		animation: blink 2.4s ease-in-out infinite;
		animation-delay: var(--d);
	}

	@keyframes blink {
		50% {
			opacity: 0.25;
		}
	}
</style>
