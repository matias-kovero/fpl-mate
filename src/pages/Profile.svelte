<script>
  import { getNewCount, getFantasyData, isFetching, fantasy } from '../fantasy';
  import { rankLabel } from '../utils';
  import session from '../store';
  import ProfileInfo from 'components/ProfileInfo.svelte';
  import Team from 'components/TeamWrapper.svelte';
  import Picks from 'components/Picks.svelte';

  $: totPlayers = fantasy.total_players;
  $: user = $session.user.data;
  $: gw = fantasy.current_gameweek;
  $: picks = $session.user.picks(gw.id);
</script>

<div>
  <!-- <button on:click="{getFantasyData}">
    Click to Load Data {#if $isFetching}🌀{/if}
  </button> -->
  <ProfileInfo {user} {gw} />
  <Team team={picks} />
  <Picks {picks} />
  <pre>Live Players: {rankLabel($totPlayers)}</pre>
  {#await user}
    <p>Waiting...</p>
  {:then d} 
    <pre>{gw.id} | {d.joined_time}</pre>
  {/await}
</div>