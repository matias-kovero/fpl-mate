<script>
  import { getTeam, teamBadge } from '../fantasy';
  import { playersFromMatch } from '../calculations';
  import Podium from './MatchPodium.svelte';
  import List from './MatchPlayerList.svelte';
  import BackButton from './BackButton.svelte';
  export let match, live;
  $: console.log(match);

  $: team_h = getTeam(match.team_h);
  $: team_a = getTeam(match.team_a);
  $: badge_h = teamBadge($team_h.code);
  $: badge_a = teamBadge($team_a.code);
  //let players = playersFromMatch(match, live);
  $: players = playersFromMatch(match, live);
</script>

<div class="match">
  <div class="score">
    <div>{$team_h.name}</div>
    <div>{match.team_h_score} | {match.team_a_score}</div>
    <div>{$team_a.name}</div>
  </div>

  <Podium {players} />
  <List {players} home={$team_h} away={$team_a} />
</div>

<!-- <div class="back" on:click><Close /></div> -->
<BackButton on:click />

<style lang="scss">
  .match {
    padding-top: .5em;
    color: var(--text1);
    display: grid;
    grid-template-rows: auto;
    position: relative;
    gap: .5em;
    .score {
      display: flex;
      align-content: center;
      justify-content: space-evenly;
    }
  }
</style>