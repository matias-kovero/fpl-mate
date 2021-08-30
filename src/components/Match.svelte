<script>
  import { getTeam, teamBadge } from '../fantasy';
  import { fade } from 'svelte/transition';
  import session, { switchSubPage } from '../store';
  export let match;
  // $: console.log(match);
  $: team_h = getTeam(match.team_h);
  $: team_a = getTeam(match.team_a);
  $: badge_h = teamBadge($team_h.code);
  $: badge_a = teamBadge($team_a.code);

  $: live = !match.finished && !match.finished_provisional;
  $: kickoff_label = new Date(match.kickoff_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  function loadMatchPage() {
    switch($session.page.sub) {
      case 'themes': return Themse;
      default: return;
    }
  }
</script>

<div class="match" on:click>
  <div class="team-h" transition:fade>
    <div class="name">{$team_h.name}</div>
    <div class="logo">
      <img 
        alt={$team_h.short_name} 
        src={badge_h.small}
        sizes="(min-width: 1024px) 40px, 30px"
        srcset={`${badge_h.small} 40w, ${badge_h.big} 80w,`}
      />
    </div>
  </div>
  {#if match.started}
  <div class="score shadow" transition:fade>
    <div class="score-end">{match.team_h_score || 0}</div>
    <div class="divider"></div>
    <div class="score-end">{match.team_a_score || 0}</div>
    {#if live}
      <div class="live-notif">LIVE</div>
    {/if}
  </div>
  {:else}
    <div class="kickoff-time shadow">{kickoff_label}</div>
  {/if}
  <div class="team-a" transition:fade>
    <div class="logo">
      <img 
        alt={$team_a.short_name} 
        src={badge_a.small}
        sizes="(min-width: 1024px) 40px, 30px"
        srcset={`${badge_a.small} 40w, ${badge_a.big} 80w,`}
      />
    </div>
    <div class="name">{$team_a.name}</div>
  </div>
</div>

<style lang="scss">
  .match {
    display: grid;
    place-items: center;
    display: grid;
    grid-template-columns: minmax(100px, 45%) minmax(80px, 10%) minmax(100px, 45%);
    padding: .3em;
    place-items: center;
    border-bottom: 1px solid var(--surface1);
    max-height: 40px;
    overflow: hidden;
    .score {
      display: grid;
      height: 100%;
      width: 60%;
      place-items: center;
      grid-template-columns: auto 1px auto;
      /* padding: .4em; */
      background: var(--darkpurple);
      position: relative;
      border-radius: 5px;
      font-size: small;
    }
    .score-end {
      padding: .3em .4em;
      font-weight: 700;
      display: grid;
      place-items: center;
      background: var(--darkpurple);
      color: #fff;
    }
    .divider {
      content: "";
      background: hsla(0, 0%, 100%, .5);
      width: 1px;
      height: 70%;
    }
    .live-notif {
      position: absolute;
      top: 0;
      left: 0;
      background: var(--lightgreen);
      color: #000; /* var(--text1); */
      font-size: 7px;
      font-weight: 700;
      padding: 0 .1em;
    }
    .kickoff-time {
      font-size: x-small;
      color: var(--text1);
      height: 100%;
      width: 60%;
      margin: auto;
      display: grid;
      place-items: center;
      background: var(--surface3);
      border-radius: 5px;
    }
  }
  .team-h, .team-a {
    display: grid;
    width: 100%;
    place-items: center;
    word-break: break-all;
    .logo {
    max-height: 30px;
    }
    .name {
      font-size: x-small;
      font-weight: 700;
    }
  }
  .team-h {
    text-align: right;
    grid-template-columns: 1fr auto;
  }
  .team-a {
    text-align: left;
    grid-template-columns: auto 1fr;
  }
</style>