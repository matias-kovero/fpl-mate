<script>
  import { rankLabel, rankPercent } from '../utils';
  import { total_players, getElement } from '../fantasy';
  export let user, gw; // Promise<any>
  //$: user.then(d => console.log('user', d));
  //$: console.log('gw', gw);
</script>

<div class="basic-info shadow">
  <div class="left">
    {#await user}
      {0}
    {:then user}
      <div class="points">{user.summary_event_points}</div>
      <div class="position">
        <div>
          <small>{rankPercent(user.summary_event_rank, $total_players)}</small>
        </div>
      </div>
    {/await}
  </div>
  <div class="right">
    {#await user}
      {0}
    {:then user}
      <div class="top-1">#1: {gw.highest_score}</div>
      <div class="avg">Avg: {gw.average_entry_score}</div>
      <div class="most-c">Most C: {getElement(gw.most_captained).web_name}</div>
      <div class="position">
      </div>
    {/await}
  </div>
</div>

<style lang="scss">
  .basic-info {
    background: var(--surface3);
    height: 150px;
    width: 100%;
    display: grid;
    grid-template-columns: 1fr 1fr;
    place-content: center;
  }
  .points {
    font-size: 44px;
    font-weight: 700;
  }
  .position {
    font-size: smaller;
    border-radius: 3px;
    justify-content: center;
    display: flex;

    div {
      background: var(--surface4);
      border-radius: 3px;
      padding: 0 .5em;
    }
  }
</style>