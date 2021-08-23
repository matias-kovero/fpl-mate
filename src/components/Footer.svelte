<script>
  import Home from 'carbon-icons-svelte/lib/Home24';
  import Profile from 'carbon-icons-svelte/lib/UserAvatar24';
  import Calendar from 'carbon-icons-svelte/lib/Calendar24';
  import Leagues from 'carbon-icons-svelte/lib/Group24';
  import Settings from 'carbon-icons-svelte/lib/Settings24';
  import session, { switchPage } from '../store';
</script>

<footer>
  <div class:active={$session.page.active == 'Home'} on:click={() => switchPage('Home')}>
    <Home aria-labelledby="Home" />
  </div>
  <div class:active={$session.page.active == 'Profile'} on:click={() => switchPage('Profile')}>
    <Profile aria-labelledby="Profile" />
  </div>
  <div class:active={$session.page.active == 'Fixtures'} on:click={() => switchPage('Fixtures')}>
    <Calendar aria-labelledby="Fixtures" />
  </div>
  <div class:active={$session.page.active == 'Leagues'} on:click={() => switchPage('Leagues')}>
    <Leagues aria-labelledby="Leagues" />
  </div>
  <div class:active={$session.page.active == 'Settings'} on:click={() => switchPage('Settings')}>
    <Settings aria-labelledby="Settings" />
  </div>
</footer>

<style>
  footer {
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
  footer div {
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
  footer div.active {
    color: var(--lightpurple);
  }
  div.active::before {
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
  div:nth-child(1).active, div:nth-child(1).active::before {
    color: var(--indico);
    border-bottom-color: var(--indico) !important;
  }
  div:nth-child(2).active, div:nth-child(2).active::before {
    color: var(--cyan);
    border-bottom-color: var(--cyan) !important;
  }
  div:nth-child(3).active, div:nth-child(3).active::before {
    color: var(--neonyellow);
    border-bottom-color: var(--neonyellow) !important;
  }
  div:nth-child(4).active, div:nth-child(4).active::before {
    color: var(--darkgreen);
    border-bottom-color: var(--darkgreen) !important;
  }
</style>