<script>
	//export let name;
	import "@fontsource/titan-one"
	import session from './store';
	import Footer from './components/Footer.svelte';
	import { fade } from 'svelte/transition';
	// Pages - maybe use dynamic import?
	import Landing from './pages/Landing.svelte';
	import PageHom from './pages/Home.svelte';
	import PagePro from './pages/Profile.svelte'
	import PageFix from './pages/Fixtures.svelte';
	import PageLea from	'./pages/Leagues.svelte';
	import PageSet from './pages/Settings/index.svelte';

	function loadPage() {
		switch ($session.page.active) {
			case 'Home': return PageHom;
			case 'Profile': return PagePro;
			case 'Fixtures': return PageFix;
			case 'Leagues': return PageLea;
			case 'Settings': return PageSet;
			default: return Landing;
		}
	}
</script>
<div class="content-wrap">
	{#if $session.user.valid}
		{#key $session.page.active}
			<main>
				<div class="content" in:fade out:fade>
					<svelte:component this={loadPage()} />
				</div>
			</main>
		{/key}
		<Footer />
	{:else}
		<Landing />
	{/if}
</div>

<style>
	.content-wrap {
		display: grid;
		grid-template-rows: 1fr auto;
		min-height: 100%;
		max-height: 100%;
		grid-column: 1/2;
		grid-row: 1/2;
		/* background-color: var(--surface1);
		background: linear-gradient(
			180deg,
			var(--surface1) 0%,
			var(--surface1) 10.45%,
			var(--surface1) 41.35%
		); */
		/* overflow: hidden; */
		/* border-bottom-left-radius: 1em;
    border-bottom-right-radius: 1em; */
		background: #000;
	}
	main {
		text-align: center;
		padding: 1em 1em;
		overflow: hidden;
		overflow-y: scroll;
		/* max-width: 240px; */
		/* margin: 0 30px; */
		grid-column: 1/2;
    grid-row: 1/2;
		background-color: var(--surface1);
		background: linear-gradient(
			180deg,
			var(--surface1) 0%,
			var(--surface1) 10.45%,
			var(--surface1) 41.35%
		);
		border-bottom-left-radius: 18px;
		border-bottom-right-radius: 18px;
	}
	.content {
		overflow: scroll;
	}

	@media (min-width: 640px) {
		main {
			max-width: none;
		}
	}
</style>