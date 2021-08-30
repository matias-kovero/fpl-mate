<script>
  export let players, home, away;
  $: console.log(players[0]);
</script>

<div class="list-wrap">
  <div class="player title">
    <div>%</div>
    <div class="info">Player</div>
    <div>Points</div>
  </div>
  {#each players as p, i}
    <div class="player">
      <div><small>{p.player.selected_by_percent}</small></div>
      <div class="info-wrap">
        <div class="info">
          <div class="name">{p.player.web_name}</div>
          <div class="team">
            <small>{p.player.team_code == home.code ? home.name : away.name}</small>
          </div>
        </div>
        <div class="cards" class:y={p.cards.yellow} class:r={p.cards.red}>
        </div>
      </div>
      <div class="points">
        {#if p.points.bonus}
          <div>{p.points.bonus + p.points.value}</div>
          <div><small>({p.points.value} + {p.points.bonus})</small></div>
        {:else}
          <div>{p.points.value}</div>
        {/if}
      </div>
    </div>
  {/each}
</div>

<style lang="scss">
  .list-wrap {
    display: grid;
    gap: .1em;
    background: var(--surface2);
    .player {
      display: grid;
      grid-template-columns: 50px 1fr 60px;
      align-items: center;
      font-size: small;
      border-bottom: 1px solid var(--surface1);
      padding-bottom: .1em;
      .info-wrap {
        display: grid;
        grid-template-columns: 1fr 15px;
      }
      .info {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        .team {
          font-size: small;
          font-weight: 700;
        }
      }
    }
    .title {
      font-weight: 700;
      color: #FFF;
      background: linear-gradient(45deg, var(--p-2) 0% 15%, var(--p-3) 15% 75%, var(--p-2) 75% 90%, var(--p-1) 90% 100%);
      border: none;
      padding: .25em 0;
    }
    .points {
      font-weight: 700;
      font-size: small;
      small {
        font-weight: normal;
      }
    }
  }
  .cards {
    display: grid;
    place-items: center;
    margin: .3em 0;
    border-radius: 2px;
    &.y {
      background: linear-gradient(135deg, #fff34d 0% 25%, #fff01a 25% 75%, #ffee00 85% 100%);
    }
    &.r {
      background: linear-gradient(135deg, #ff1a1a 0% 25%, #e60000 25% 75%, #b30000 85% 100%);
    }
  }
</style>