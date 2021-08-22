<script>
  import Home from 'carbon-icons-svelte/lib/Home24/Home24.svelte';
  import Profile from 'carbon-icons-svelte/lib/UserAvatar24/UserAvatar24.svelte';
  import Calendar from 'carbon-icons-svelte/lib/Calendar24/Calendar24.svelte';
  import Leagues from 'carbon-icons-svelte/lib/Group24/Group24.svelte';
  import Settings from 'carbon-icons-svelte/lib/Settings24/Settings24.svelte';
  // import { page } from '$app/stores';
</script>

<footer>
  <div class="buttons">
    <a sveltekit:prefetch href="/" class:active={true}>
			<Home aria-labelledby="Home" />
		</a>
    <a sveltekit:prefetch href="/" class:active={true}>
			<Profile aria-labelledby="Profile" />
		</a>
    <a sveltekit:prefetch href="/" class:active={true}>
			<Calendar aria-labelledby="Fixtures" />
		</a>
    <a sveltekit:prefetch href="/" class:active={true}>
			<Leagues aria-labelledby="Leagues" />
		</a>
    <a sveltekit:prefetch href="/" class:active={true}>
			<Settings aria-labelledby="Settings" />
		</a>
  </div>
</footer>

<style>
  .buttons {
    font-size: 60%;
    font-weight: 800;
    /*background: var(--pure-white);*/
    letter-spacing: 0.5px;
    text-transform: uppercase;
    font-family: var(--font-header);
    border-top: 1px solid rgba(34,40,49,0.3);
    color: rgba(255, 255, 255, 0.65);
    justify-content: center;
    position: sticky;
    bottom: 0;
    align-items: center;
    height: 48px;
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    place-items: center;
    z-index: 1;
    /* Mobile like corners - should we check if on mobile? */
    border-bottom-left-radius: 1em;
    border-bottom-right-radius: 1em;
    background: #000;
  }
  .buttons a {
    width: 100%;
		height: 100%;
		display: grid;
		place-items: center;
		color: var(--pure-white);
		text-decoration: none;
		position: relative;
		padding: auto;
		-webkit-tap-highlight-color: transparent;
  }
  .buttons a.active {
    color: var(--lightpurple);
  }
  a.active::before {
    --size: 6px;
    content: '';
    width: 0;
    height: 0;
    position: absolute;
    bottom: 0;
    left: calc(50% - var(--size));
    border: var(--size) solid transparent;
    border-bottom: var(--size) solid var(--lightpurple);
  }
  .buttons a:nth-child(1).active, .buttons a:nth-child(1).active::before {
    color: var(--indico);
    border-bottom-color: var(--indico) !important;
  }
  .buttons a:nth-child(2).active, .buttons a:nth-child(2).active::before {
    color: var(--cyan);
    border-bottom-color: var(--cyan) !important;
  }
  .buttons a:nth-child(3).active, .buttons a:nth-child(3).active::before {
    color: var(--neonyellow);
    border-bottom-color: var(--neonyellow) !important;
  }
  .buttons a:nth-child(4).active, .buttons a:nth-child(4).active::before {
    color: var(--darkgreen);
    border-bottom-color: var(--darkgreen) !important;
  }
</style>