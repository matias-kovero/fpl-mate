<script>
  // Array of all players
  import { getElement, getPhoto } from '../fantasy';
  export let players;

  $: first = players[0] ? getElement(players[0].player.id) : null;
  $: second = players[1] ? getElement(players[1].player.id) : null;
  $: third = players[2] ? getElement(players[2].player.id) : null;
  let [img_1, img_2, img_3] = ['', '', ''];

  $: if (players[0]) {
    [img_1, img_2, img_3] = [getPhoto(players[0].player.code), getPhoto(players[1].player.code), getPhoto(players[2].player.code)];
  }
</script>

<div class="podium-wrap">
  <div class="podium nd">
    <div class="name">{second?.web_name}</div>
    <div class="img"><img src={img_2} alt="mugshot" srcSet={`${img_2} 220w`} sizes="85px" /></div>
    <div class="points">{players[1]?.sort}</div>
  </div>
  <div class="podium st">
    <div class="name">{first?.web_name}</div>
    <div class="img"><img src={img_1} alt="mugshot" srcSet={`${img_1} 220w`} sizes="85px" /></div>
    <div class="points">{players[0]?.sort}</div>
  </div>
  <div class="podium rd">
    <div class="name">{third?.web_name}</div>
    <div class="img"><img src={img_3} alt="mugshot" srcSet={`${img_3} 220w`} sizes="85px" /></div>
    <div class="points">{players[2]?.sort}</div>
  </div>
</div>

<style lang="scss">
  .podium-wrap {
    display: grid;
    grid-template-columns: 1fr 35% 1fr;
    gap: .5em;
    padding: .5em;
  }
  .podium {
    border-radius: 5px;
    background: var(--surface2);
    border: 3px solid #000;
    box-shadow: 0px 2px 2px #00000038;
    .img {
      height: 55px;
      /* width: 35px; */
      display: grid;
      place-items: center;
      position: relative;
      overflow: hidden;
      img {
        position: absolute;
        top: 6px;
        filter: drop-shadow(0px 6px 6px rgba(0, 0, 0, 0.6));
      }
    }
    .name {
      font-size: small;
    }
    .points {
      padding-top: .1em;
      font-weight: 700;
    }
  }
  .st {
    border-color: rgb(255, 217, 110);
    /* background: rgb(255, 211, 90); */
    background: rgba(252, 207, 82, 1.0);
    background: -webkit-linear-gradient(top left, rgba(252, 207, 82, 1.0), rgba(186, 155, 69, 1.0));
    background: -moz-linear-gradient(top left, rgba(252, 207, 82, 1.0), rgba(186, 155, 69, 1.0));
    background: linear-gradient(to bottom right, rgba(252, 207, 82, 1.0), rgba(186, 155, 69, 1.0));
    .name {
      background: rgb(255, 217, 110)
    }
    .points {
      background: rgb(255, 222, 135);
    }
  }
  .nd {
    border-color: rgb(160, 160, 160);
    background: rgb(140, 140, 140);
    .name {
      background: rgb(160, 160, 160);
    }
    .points {
      background: rgb(170, 170, 170);
    }
  }
  .rd {
    border-color: rgb(161, 100, 76);
    background: rgb(150, 93, 71);
    .name {
      background: rgb(161, 100, 76);
    }
    .points {
      background: rgb(171, 106, 80);
    }
  }
</style>