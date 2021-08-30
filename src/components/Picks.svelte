<script>
  import IconDefence from 'carbon-icons-svelte/lib/ManageProtection20';
  export let picks;
  //$: console.log('Picks:', picks);
</script>

<div>
  <h5>Selected Team</h5>
  <div class="wrapper">
    <div class="goalkeeper shadow">
      <div class="header">
        <div></div>
        <div class="title">Goalkeeper</div>
      </div>
    </div>
    <div class="defenders shadow">
      <div class="header">
        <IconDefence />
        <div class="title">Defenders</div>
      </div>
    </div>
    <div class="midfielders shadow">
      <div class="header">
        <div></div>
        <div class="title">Midfielders</div>
      </div>
    </div>
    <div class="forwards shadow">
      <div class="header">
        <div></div>
        <div class="title">Forwards</div>
      </div>
    </div>
  </div>
</div>

<style lang="scss">
  .wrapper {
    display: grid;
    gap: .5em;

    > div {
      height: 100px;
      width: 100%;
      background: var(--surface3);
      > .header {
        display: grid;
        grid-template-columns: 60px 1fr;
        place-items: center;
        place-content: center;
        align-content: center;
        height: 40px;
        .title {
          width: 100%;
          text-align: left;
          font-size: small;
          font-weight: 700;
        }
      }
    }
  }
  .goalkeeper > .header {
    background-color: var(--neonyellow);
  }
  .defenders > .header {
    background-color: var(--lightgreen);
  }
  .midfielders > .header {
    background-color: var(--cyan);
  }
  .forwards > .header {
    background-color: var(--indico);
  }
</style>