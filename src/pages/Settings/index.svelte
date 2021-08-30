<script>
  import IconTheme from 'carbon-icons-svelte/lib/ColorPalette20';
  import Button from 'components/Button.svelte';
  import Icon from 'carbon-icons-svelte/lib/ChevronRight24';
  import session, { switchSubPage } from '../../store';

  import Themse from './themes.svelte';

  const items = [
    { icon: IconTheme, content: 'Theme', path: 'themes'},
  ];

  function loadSub() {
    switch($session.page.sub) {
      case 'themes': return Themse;
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
          <div on:click={() => switchSubPage(item.path)}>{item.content}</div>
        </div>
        <div slot="btn">
          <Icon class="shadow" />
        </div>
      </Button>
    {/each}
  </div>
  {/if}
</div>