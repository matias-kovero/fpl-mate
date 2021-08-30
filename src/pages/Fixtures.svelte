<script>
  import { fade } from 'svelte/transition';
  import { fantasy } from '../fantasy';
  import { gameDays } from '../utils';
  import Match from '../components/Match.svelte';
  import Highlight from '../components/MatchInfo.svelte';

  $: gw = fantasy.current_gameweek;
  // $: fixture = fantasy.fixture(gw.id);
  // $: console.log(fixture);

  // Testing live data fetching...
  $: live = fantasy._fixture._live(gw.id);
  $: higlight_match = null;

  const showMatch = (m) => {
    console.log('Switch to match:', m);
    higlight_match = m;
  }
  const closeMatch = () => {
    higlight_match = null;
  }
</script>

<div class="fixtures">
  {#if higlight_match}
    <div class="content" in:fade out:fade>
      <svelte:component this={Highlight} match={higlight_match} live={$live[gw.id]} on:click={() => closeMatch()} />
    </div>
  {:else}
  <div class="content" in:fade out:fade>
    <div class="gameweek">
    <!-- <h2>Fixtures</h2> -->
    {#await fantasy.fixture(gw.id)}
      <p>Loading...</p>
    {:then fixture} 
      {#each gameDays(fixture) as gameday, i}
      <div class="gameday">
        <p>{gameday.labelArr[0]} {gameday.labelArr[2]}</p>
        {#each gameday.matches as match}
          <Match {match} on:click={() => {showMatch(match)}} />
        {/each}
      </div>
      {/each}
    {/await}
    </div>
  </div>
  {/if}
</div>


<style lang="scss">
  .fixtures {
    display: grid;
		/* min-height: 100%;
		max-height: 100%; */
    height: 100%;
		grid-column: 1/2;
		grid-row: 1/2;
  }
  .content {
    display: grid;
    grid-column: 1/2;
		grid-row: 1/2;
  }
  .gameweek {
    display: grid;
    gap: .5em;
    border-radius: 3px;
    box-shadow: 0px 2px 2px #00000038;
    /* background: linear-gradient(-45deg, var(--lg-3) 0% 15%, var(--lg-1) 15% 75%, var(--lg-2) 75% 90%, var(--lg-3) 90% 100%); */
    > .gameday {
      filter: hue-rotate(270deg);
      filter: sepia(0.6);
      background: linear-gradient(45deg, var(--lg-3) 0% 15%, var(--lg-1) 15% 75%, var(--lg-2) 75% 90%, var(--lg-3) 90% 100%);
    }
  }
</style>