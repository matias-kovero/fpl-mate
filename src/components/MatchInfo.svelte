<script>
  import Close from 'carbon-icons-svelte/lib/Close20';
  import { getTeam, teamBadge } from '../fantasy';
  import { playersFromMatch } from '../calculations';
  import Podium from './MatchPodium.svelte';
  import List from './MatchPlayerList.svelte';
  export let match, live;
  $: console.log(match);

  $: team_h = getTeam(match.team_h);
  $: team_a = getTeam(match.team_a);
  $: badge_h = teamBadge($team_h.code);
  $: badge_a = teamBadge($team_a.code);
  let players = playersFromMatch(match, live);
  //$: players = playersFromMatch(match, null);
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

<div class="back" on:click><Close /></div>

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
  .back {
    height: 40px;
    width: 40px;
    border-radius: 50%;
    position: absolute;
    background: var(--heading-color);
    color: var(--surface2);
    display: grid;
    place-items: center;
    left: calc(50% - 20px);
    bottom: 53px;
    box-shadow: 0px 2px 2px #00000038;
  }
</style>