<script>
	import Footer from './Footer/index.svelte'
	import Landing from './Landing/index.svelte'
	import session from './store'
	// Pages - find an way to dynamically import ??
	import PageHome 	 from './pages/Home.svelte';
	import PageProfile from './pages/Profile.svelte';
	import PageFixture from './pages/Fixtures.svelte';
	import PageLeagues from './pages/Leagues.svelte';
	import PageSetting from './pages/Settings.svelte';

	export let name;

	// Is there an way to use dynamic import, this is hell - don't copypaste this
	function loadPage() {
		switch ($session.user.activePage) {
			case 'Home':
				return PageHome
			case 'Profile':
				return PageProfile
			case 'Fixtures':
				return PageFixture
			case 'Leagues':
				return PageLeagues
			case 'Settings':
				return PageSetting
			default:
				return PageHome
		}
	}
	$: pageName = $session.user.activePage;
</script>

<!-- {#key pageName}
	<div></div>
{/key} -->

{#if $session.user.valid}
	<div class="content-wrapper">
		<main>
			{#if $session.user.activePage}
				<div class="wrapper">
					<svelte:component this={loadPage()} />
				</div>
			{:else }
				<div class="error">
					Invalid page given!!
				</div>
			{/if}
		</main>

		<Footer />
	</div>
{:else}
	<Landing />
{/if}

<style>
	.content-wrapper {
		display: grid;
		grid-template-rows: 1fr auto;
		min-height: 100%;
	}
	main {
		text-align: center;
		padding: 1em;
		max-width: 240px;
		margin: 0 auto;
		color: var(--text2);
	}

	h1 {
		color: var(--text1);
		text-transform: uppercase;
		font-size: 4em;
		font-weight: 100;
	}

	@media (min-width: 640px) {
		main {
			max-width: none;
		}
	}
</style>
