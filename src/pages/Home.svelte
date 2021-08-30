<script>
  import { onMount } from 'svelte';
  //import fantasy from '../fantasy';
  import session, { fantasy } from '../store'
</script>

<div>
  <h2>Home</h2>
  <!-- {#await $fantasy}
    <p>Waiting for season data.</p>
  {:then season}
    {console.log(events)}
    <p>{$fantasy.store.events.length}</p>
    <p>Season Loaded</p>
  {/await}
  <p>{$fantasy.store.events.length}</p> -->
</div>