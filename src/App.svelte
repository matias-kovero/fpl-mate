<script>
	//export let name;
	import session from './store';
	import Footer from './components/Footer.svelte';

	// Pages - maybe use dynamic import?
	import Landing from './pages/Landing.svelte';
	import PageHom from './pages/Home.svelte';
	import PagePro from './pages/Profile.svelte'
	import PageFix from './pages/Fixtures.svelte';
	import PageLea from	'./pages/Leagues.svelte';
	import PageSet from './pages/Settings.svelte';

	function loadPage() {
		switch ($session.page.active) {
			case 'Home': return PageHom;
			case 'Profile': return PagePro;
			case 'Fixtures': return PageFix;
			case 'Leagues': return PageLea;
			case 'Settings': return PageSet;
			default: return PageHom;
		}
	}
</script>

{#if $session.user.valid}
	<div class="content-wrap">
		{#key $session.page.active}
		<main>
			<div class="content">
				<svelte:component this={loadPage()} />
			</div>
		</main>
		{/key}
		<Footer />
	</div>
{:else}
	<Landing />
{/if}

<style>
	.content-wrap {
		display: grid;
		grid-template-rows: 1fr auto;
		min-height: 100%;
		grid-column: 1/2;
		grid-row: 1/2;
	}
	main {
		text-align: center;
		padding: 1em;
		max-width: 240px;
		margin: 0 auto;
	}

	@media (min-width: 640px) {
		main {
			max-width: none;
		}
	}
</style>