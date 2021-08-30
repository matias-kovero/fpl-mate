<script>
  import SearchUser from 'components/SearchUser.svelte';
</script>

<div class="landing-wrap">
  <div class="container">
    <div class="title">
      <div class="icon">
        <img src={'/favicon.png'} alt="page logo" />
      </div>
      <div class="head">
        <div>FPL Mate</div>
        <small>Fantasy companion</small>
      </div>
    </div>
    <div class="aid">Start by searching your team</div>
    <SearchUser />
  </div>
</div>

<style lang="scss">
  .landing-wrap {
    text-align: center;
		padding: 1em 1em;
		overflow: hidden;
		overflow-y: scroll;
		grid-column: 1/2;
    grid-row: 1/2;
		background-color: var(--surface1);
		/* background: linear-gradient(
			180deg,
			var(--surface1) 0%,
			var(--surface1) 10.45%,
			var(--surface1) 41.35%
		); */
    background: #34e89e;  /* fallback for old browsers */
    background: -webkit-linear-gradient(to top, #0f3443, #34e89e);  /* Chrome 10-25, Safari 5.1-6 */
    background: linear-gradient(to top, #0f3443, #34e89e); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */

    /* background: linear-gradient(-45deg, #0f3443 0% 5%, #34e89e 90% 100%); */
    /* background: linear-gradient(-45deg, #0f3443 0%, #34e89e 100%); */
		border-bottom-left-radius: 18px;
		border-bottom-right-radius: 18px;
  }
  .container {
    display: grid;
    gap: 1.5em;
    place-items: center;
  }
  .title {
    display: flex;
    place-items: center;
    align-content: center;
    justify-items: center;
    font-family: "Titan One", sans-serif;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    gap: .5em;
    color: #0a1f29;
    .icon {
      display: grid;
      align-items: center;
      align-content: center;
      justify-items: center;
      img {
        height: 50px;
      }
    }
    .head {
      display: grid;
      justify-items: start;
      align-items: baseline;
      text-align: left;
      div {
        font-size: 40px;
      }
    }
  }
  .aid {
    color: #0a1f29;
  }
</style>