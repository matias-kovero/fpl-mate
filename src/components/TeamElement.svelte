<script>
  import { getElement, getPhoto } from '../fantasy';
  export let pick;
  $: element = getElement(pick.element);
  // $: console.log(pick, element);
  $: photo_url = getPhoto(element.code);
</script>

<div class={`wrapper type-${element.element_type}`} class:dream={element.in_dreamteam} class:bench={pick.multiplier == 0}>
  <div class="icon">
    <img src={photo_url} alt="mugshot" srcSet={`${photo_url} 220w`} sizes="55px" />
  </div>
  <div class="cont">
    <div class="info">
      <div>{element.web_name}</div>
    </div>
    <div class="price">{element.now_cost/10}</div>
    <div class="points">{element.event_points}</div>
  </div>
</div>

<style lang="scss">
  .wrapper {
    display: grid;
    box-shadow: 0px 2px 2px #00000038;
    grid-template-columns: 45px 1fr;
    border-radius: 5px;
    height: 45px;
    align-content: space-evenly;
    justify-content: space-evenly;
    justify-items: center;
    align-items: center;
    > .icon {
      border-radius: 2px;
      height: 35px;
      width: 35px;
      background-color: rgba(0, 0, 0, 0.116);
      overflow: hidden;
      position: relative;
      img {
        position: absolute;
        right: -11px;
        top: 2px;
      }
    }
  }
  .cont {
    display: grid;
    width: 100%;
    grid-template-columns: 1fr 40px 40px;
    > .info {
      text-align: left;
      font-size: small;
    }
    > .price {
      font-size: small;
    }
    > .points {
      font-weight: 700;
      /* color: var(--text1); */
    }
  }
  .type-1 {
    background-color: var(--neonyellow);
    background: linear-gradient(-45deg, #f7e998 0% 15%, #f8e47f 15% 75%, #f7e998 75% 90%, #faf0bd 90% 100%);
  }
  .type-2 {
    background-color: var(--lightgreen);
    background: linear-gradient(-45deg, var(--lg-3) 0% 15%, var(--lg-1) 15% 75%, var(--lg-2) 75% 90%, var(--lg-3) 90% 100%);
  }
  .type-3 {
    background-color: var(--cyan);
    background: linear-gradient(-45deg, var(--c-3) 0% 15%, var(--c-1) 15% 75%, var(--c-2) 75% 90%, var(--c-3) 90% 100%);
  }
  .type-4 {
    background-color: var(--indico);
    background: linear-gradient(-45deg, var(--i-3) 0% 15%, var(--i-1) 15% 75%, var(--i-2) 75% 90%, var(--i-3) 90% 100%);
  }
  .dream {
    color: #FFF;
    background: linear-gradient(-45deg, var(--b-3) 0% 15%, var(--b-1) 15% 75%, var(--b-2) 75% 90%, var(--b-3) 90% 100%) !important;
    /* box-shadow: 0 0 var(--b-4) !important; */
    box-shadow: 0 2px 2px 0px var(--b-4);
  }
  .bench {
    filter: grayscale(0.7);
  }
</style>