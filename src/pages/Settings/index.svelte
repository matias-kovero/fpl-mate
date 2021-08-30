<script>
  import IconTheme from 'carbon-icons-svelte/lib/ColorPalette20';
  import IconLogout from 'carbon-icons-svelte/lib/Logout20';
  import IconSwitch from 'carbon-icons-svelte/lib/UserMultiple20';
  import Button from 'components/Button.svelte';
  import Icon from 'carbon-icons-svelte/lib/ChevronRight24';
  import session, { switchSubPage, logOut } from '../../store';

  import Themse from './themes.svelte';
  import Switch from './userswitch.svelte';

  const items = [
    { icon: IconTheme, content: 'Theme', path: 'themes', func: () => switchSubPage('themes') },
    { icon: IconSwitch, content: 'Switch user', func: () => switchSubPage('switch') },
    { icon: IconLogout, content: 'Logout', func: () => logOut() },
  ];

  function loadSub() {
    switch($session.page.sub) {
      case 'themes': return Themse;
      case 'switch': return Switch;
      default: return;
    }
  }
</script>

<svelte:head>
  <title>Settings | FPL Mate</title>
</svelte:head>

<div>
  {#if $session.page.sub}
  <h2>Settings</h2>
  <div class="content">
    <svelte:component this={loadSub()} />
  </div>
  {:else}
  <h2>Settings</h2>
  <div class="settings">
    {#each items as item}
      <Button>
        <div slot="icon">
          <svelte:component this={item.icon} class="shadow" />
        </div>
        <div slot="content">
          <div on:click={() => item.func()}>{item.content}</div>
        </div>
        <div slot="btn">
          <Icon class="shadow" />
        </div>
      </Button>
    {/each}
  </div>
  {/if}
</div>

<style lang="scss">
  .settings {
    display: grid;
    gap: .5em;
  }
</style>