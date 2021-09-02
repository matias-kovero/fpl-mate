<script>
  import session from '../store';
  import { rankLabel } from '../utils';
  import Leaderboards from '../components/Leaderboards.svelte';
  import LeagueInfo from '../components/LeagueInfo.svelte';
  $: data = $session.user.data;
  $: selected = 0;

  const selectLeague = (league, i) => {
    console.log('Wanting to select', league.name);
    selected = i;
  }
</script>

<div>
  <div class="top-bg shadow"></div>
  {#await $session.user.data}
    <p>Loading...</p>
  {:then data} 
    <div class="league-selector">
      {#each data?.leagues?.classic as league, i}
        <div class="league-pop shadow" on:click={() => selectLeague(league, i)}>
          <div class="name">{league?.name}</div>
          <div class="rank">{rankLabel(league?.entry_rank)}</div>
        </div>
      {/each}
    </div>
    <LeagueInfo league={data?.leagues?.classic[selected]} />
    <!-- <Leaderboards league={data?.leagues?.classic[0]} id={$session.user.id} /> -->
    <p>User has {data?.leagues?.classic.length} classic leagues.</p>
    <small>Of {data?.leagues?.classic.filter(l => !!l.admin_entry).length} are private</small>
  {/await}
</div>

<style lang="scss">
  .top-bg {
    position: absolute;
    top: 0;
    left: 0;
    height: 75px;
    width: 100%;
    background: var(--surface2);
    border-bottom-left-radius: 25px;
    border-bottom-right-radius: 25px;
  }
  .league-selector {
    /* display: grid;
    grid-auto-flow: column;
    gap: .5em;
    overflow-x: scroll; */
    display: flex;
    flex-wrap: nowrap;
    overflow-x: auto;
    gap: .5em;
    padding-bottom: 19px;
    -webkit-overflow-scrolling: touch;
    .league-pop {
      flex: 0 0 auto;
      background: var(--surface1);
      border-radius: 5px;
      display: grid;
      place-items: center;
      width: 100px;
      height: 40px;
      .name {
        font-size: small;
      }
    }
  }
</style>