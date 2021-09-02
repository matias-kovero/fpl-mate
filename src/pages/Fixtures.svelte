<script>
  import { fade } from 'svelte/transition';
  import { fantasy } from '../fantasy';
  import { gameDays } from '../utils';
  import IconLeft from 'carbon-icons-svelte/lib/ChevronLeft20';
  import IconRight from 'carbon-icons-svelte/lib/ChevronRight20';
  import Match from '../components/Match.svelte';
  import MatchV2 from 'components/MatchV2.svelte';
  import Highlight from '../components/MatchInfo.svelte';

  $: padding = 0;
  $: gw = fantasy.current_gameweek;
  // $: fixture = fantasy.fixture(gw.id);
  // $: console.log(fixture);

  // Testing live data fetching...
  $: live = fantasy._fixture._live(gw ? gw.id : 1);
  $: higlight_match = null;

  const showMatch = (m) => {
    console.log('Switch to match:', m);
    higlight_match = m;
  }
  const closeMatch = () => {
    higlight_match = null;
  }
  const changeGameweek = (str) => {
    switch (str) {
      case 'up':
        padding++;
        break;
      case 'down':
        padding--;
        break;
    }
  }
</script>

<div class="fixtures">
  {#if higlight_match}
    <div class="content" in:fade out:fade>
      <svelte:component this={Highlight} match={higlight_match} live={$live[gw.id]} on:click={() => closeMatch()} />
    </div>
  {:else}
  <div class="content" in:fade out:fade>
    <div class="buttons shadow">
      <div class="btn" on:click={() => { changeGameweek('down') }}><IconLeft /></div>
      <div>Gameweek {gw.id + padding}</div>
      <div class="btn" on:click={() => { changeGameweek('up') }}><IconRight /></div>
    </div>
    <div class="gameweek">
    <!-- <h2>Fixtures</h2> -->
    {#await fantasy.fixture(gw.id + padding)}
      {#each Array(10) as _, i}
      <div class="m-skeleton">
        <div class="team-info home">
          <div class="text skeleton"></div>
          <div class="logo skeleton"></div>
        </div>
        <div class="mid skeleton"></div>
        <div class="team-info away">
          <div class="logo skeleton"></div>
          <div class="text skeleton"></div>
        </div>
      </div>
      {/each}
    {:then fixture} 
      {#each gameDays(fixture) as gameday, i}
        {#each gameday.matches as match}
          <MatchV2 {match} {gameday} on:click={() => {showMatch(match)}} />
        {/each}
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
    /* box-shadow: 0px 2px 2px #00000038; */
    /* background: linear-gradient(-45deg, var(--lg-3) 0% 15%, var(--lg-1) 15% 75%, var(--lg-2) 75% 90%, var(--lg-3) 90% 100%); */
    .m-skeleton {
      display: grid;
      place-items: center;
      justify-content: center;
      grid-template-columns: 1fr 60px 1fr;
      background: var(--surface2);
      height: 45px;
      font-size: small;
      border-radius: 5px;
      .mid {
        font-size: x-small;
        color: var(--text1);
        display: grid;
        place-items: center;
        background: var(--surface3);
        border-radius: 5px;
        height: 70%;
        width: 80%;
      }
      .team-info {
        display: grid;
        width: 100%;
        grid-template-columns: 1fr 40px;
        align-items: center;
        justify-items: end;
        .text {
          width: 70%;
          height: 10px;
          background: var(--surface3);
          border-radius: 5px;
        }
        .logo {
          width: 30px;
          height: 30px;
          background-color: var(--surface3);
          border-radius: 50%;
        }
        &.away {
          grid-template-columns: 40px 1fr;
          justify-items: start;
        }
      }
    }
  }
  .buttons {
      display: flex;
      justify-content: space-between;
      height: 40px;
      align-items: center;
      background: var(--surface2);
      border-radius: 10px;
      font-weight: 700;
      margin-bottom: 1em;
      .btn {
        padding: 0 .5em;
        display: grid;
        place-items: center;
      }
    }
</style>