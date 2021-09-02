<script>
  import { getStandings } from '../fantasy';
  import VirtualList from 'svelte-tiny-virtual-list';
  import InfiniteLoading from 'svelte-infinite-loading';
  export let league, id;

  const SHOW_COUNT = 7;
  /* let page = league.standings.page;
  let has_next = league.standings.has_next; */
  let { page, has_next } = league.standings;

  /** Reactive stuff */
  $: info = league.league;
  $: new_entries = league.new_entries;
  $: standings = league.standings;

  /** Sink - fetch more */
  function sinkHole({ detail: { complete, loaded, error}}) {
    if (!has_next) complete();

    try {
      // add code...
      getStandings(info.id, page + 1)
        .then((data) => {
          if (data.standings.results.length) {
            ({page, has_next} = data.standings);
            standings.results = [...standings.results, ...data.standings.results];
            loaded();
          } else complete();
        })
    } catch (e) {
      error();
    }
  }
</script>

<div class="leaderboard-wrap shadow">
  {#if standings.results.length >= SHOW_COUNT}
    <VirtualList width="100%" height={40 * SHOW_COUNT}
      itemCount={standings.results.length} itemSize={40}>
      <div slot="item" let:index let:style {style} class="list-item">
        <div class="standing" class:local={standings.results[index]?.entry == id}>
          <div class="position">{standings.results[index]?.rank}</div>
          <div class="info">
            <div class="team">{standings.results[index]?.entry_name}</div>
            <div class="name">{standings.results[index]?.player_name}</div>
          </div>
          <div class="event-points">{standings.results[index]?.event_total}</div>
          <div class="points">{standings.results[index]?.total}</div>
        </div>
        <!-- {console.log(standings.results[index])} -->
      </div>
      <div slot="footer">
        <InfiniteLoading on:infinite={sinkHole}>
          <div slot="noResults"></div>
          <div slot="noMore">the end</div>
        </InfiniteLoading>
      </div>
    </VirtualList>
  {:else}
    <div class="fallback-list">
      <small>What is this?</small>
    </div>
  {/if}
</div>

<style lang="scss">
  .leaderboard-wrap :global(.virtual-list-wrapper), .fallback-list, .current-user {
    overflow: visible;
    overflow-x: hidden;
    white-space: nowrap;
    background: var(--surface2);
    border-radius: 5px;
    :global(.loading-default) {
      border-color: var(--surface1);
      color: var(--surface1);
      &::before {
        background-color: var(--surface1);
      }
    }
  }
  .list-item {
    height: 40px;
  }
  .standing {
    display: grid;
    grid-template-columns: 40px 1fr 40px 60px;
    height: 40px;
    place-items: center;
    border-bottom: 1px solid var(--surface1);
    &.local {
      /* background: #c097ff94; */
      background: var(--surface3);
    }
    .info {
      width: 100%;
      text-align: left;
    }
    .name { 
      font-size: small;
    }
    .position {
      height: 34px;
      width: 34px;
      display: grid;
      place-items: center;
      border-radius: 2.5px;
    }
  }
</style>