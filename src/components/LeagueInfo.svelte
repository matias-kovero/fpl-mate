<script>
  import { getStandings } from '../fantasy';
  import session from '../store';
  import Leaderboards from './Leaderboards.svelte';
  export let league;


</script>

<div class="league-wrap">
  <div class="name">{league?.name}</div>
  {#await getStandings(league.id, 1)}
  <div class="lb-skeleton shadow">
    {#each Array(7) as _, i}
      <div class="element">
        <div class="icon skeleton"></div>
          <div class="info">
            <div class="text skeleton"></div>
            <div class="text-alt skeleton"></div>
          </div>
        <div class="icon skeleton"></div>
        <div class="icon skeleton"></div>
      </div>
    {/each}
  </div>
  {:then standings}
    <Leaderboards league={standings} id={$session.user.id} /> 
  {/await}
</div>

<style lang="scss">
  .league-wrap {
    display: grid;
    gap: .5em;
    padding-top: .5em;
    .name {
      font-weight: 700;
    }
  }
  .lb-skeleton {
    background: var(--surface2);
    border-radius: 5px;
    height: 280px;
    width: 100%;
    .element {
      display: grid;
      grid-template-columns: 40px 1fr 40px 60px;
      height: 40px;
      place-items: center;
      border-bottom: 1px solid var(--surface1);
      .icon {
        font-size: x-small;
        color: var(--text1);
        display: grid;
        place-items: center;
        background: var(--surface3);
        border-radius: 5px;
        height: 70%;
        width: 80%;
      }
      .info { 
        width: 100%;
        display: grid;
        gap: .2em;
      }
      .text, .text-alt {
        width: 80%;
        height: 10px;
        background: var(--surface3);
        border-radius: 5px;
      }
      .text-alt { width: 55%; }
    }
  }
</style>