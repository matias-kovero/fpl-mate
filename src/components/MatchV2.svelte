<script>
  import { getTeam, teamBadge } from '../fantasy';
  export let match, gameday;

  $: team_h = getTeam(match.team_h);
  $: team_a = getTeam(match.team_a);
  $: badge_h = teamBadge($team_h.code);
  $: badge_a = teamBadge($team_a.code);

  $: live = !match.finished && !match.finished_provisional;
  $: kickoff_label = new Date(match.kickoff_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  $: [weekday, month, day, year] = gameday.labelArr;
</script>

<div class="match shadow" on:click>
  <div class="team-info">
    <div class="name">{$team_h.name}</div>
    <div class="logo"><img src={badge_h.small} alt="team logo" /></div>
  </div>
  <div class="middle">
    {#if match.started}
      <div class="score shadow">
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
  </div>
  <div class="team-info away">
    <div class="logo"><img src={badge_a.small} alt="team logo" /></div>
    <div class="name">{$team_a.name}</div>
  </div>
</div>

<style lang="scss">
  .match {
    display: grid;
    place-items: center;
    justify-content: center;
    grid-template-columns: 1fr 60px 1fr;
    background: var(--surface2);
    height: 45px;
    font-size: small;
    border-radius: 5px;
  }
  .team-info {
    width: 100%;
    display: grid;
    text-align: right;
    grid-template-columns: 1fr 40px;
    align-items: center;
    img {
      height: 30px;
    }
    .name {
      font-weight: 700;
    }
  }
  .away {
    text-align: left !important;
    grid-template-columns: 40px 1fr !important;
  }
  .middle {
    .score {
      display: grid;
      place-items: center;
      grid-template-columns: auto 1px auto;
      padding: .2em;
      background: var(--darkpurple);
      position: relative;
      border-radius: 5px;
      font-size: small;
      .score-end {
        padding: .3em .4em;
        font-weight: 700;
        display: grid;
        place-items: center;
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
    }
    .kickoff-time {
      font-size: x-small;
      color: var(--text1);
      display: grid;
      place-items: center;
      background: var(--surface3);
      border-radius: 5px;
      padding: 10px;
    }
  }
</style>