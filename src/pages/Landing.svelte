<script>
  import "@fontsource/titan-one";
  import IconUser from 'carbon-icons-svelte/lib/User20';
  import IconSearch from 'carbon-icons-svelte/lib/Search20';
  import IconClose from 'carbon-icons-svelte/lib/Close20';
  import AutoComplete from 'simple-svelte-autocomplete';
  import { findUsers } from '../utils';
  import { switchUser } from '../store';
  let selected, error, count;

  async function find(str) {
    let res = await findUsers(str);
    count = res.length;
    return res;
  }

  function selectUser() {
    if (!selected) return;
    console.log('Selected:', selected.name, selected.team, selected.id);
    switchUser({id: selected.id, name: selected.name, team: selected.team });
  }
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
    <div class="user-search">
      <p class="aid">Start by searching your team</p>
      {#if error}<p>{error}</p>{/if}
      <div class="search-bar shadow" class:open={count > 0}>
        <AutoComplete 
          searchFunction={find} 
          delay=500
          localSearch=false 
          labelFieldName="label" 
          valueFieldName="value" 
          bind:selectedItem={selected}
          minCharactersToSearch={3}
          hideArrow={true}
          showClear={false}
          placeholder="Team ID/Name or owner"
          onChange={() => selectUser()}
          className="search-element"
          inputClassName="search-input"
          dropdownClassName="search-dropdown"
          >
          <div slot="item" let:item>
            <div class="user-icon"><IconUser /></div>
            <div class="user-option">
              <div class="search-owner">
                {item.name}
              </div>
              <div class="search-team">
                {item.team}
              </div>
            </div>
          </div>
          <div slot="no-results" let:noResultsText>{noResultsText}</div>
          <div slot="loading" let:loadingText>{loadingText}</div>
        </AutoComplete>
        <div class="icon-search"><IconSearch /></div>
        <div class="search-icon"><IconClose /></div>
      </div>
    </div>
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
  }
  .user-search {
    width: 100%;
    max-width: 400px;
    z-index: 10;
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
  .icon-search {
    display: grid;
    place-items: center;
    position: absolute;
    height: 2.25em;
    width: 2.25em;
  }
  .user-icon {
    position: absolute;
    left: 7px;
    top: 7px;
  }
  .user-option {
    font-size: smaller;
    color: var(--text1);
    display: grid;
    justify-items: start;
  }
  .search-bar {
    background: var(--surface2);
    display: grid;
    border-radius: 15px;
    grid-template-columns: 1fr 40px;
  }
  .open {
    border-radius: 5px !important;
    border-bottom-left-radius: 0px !important;
  }
  .search-icon {
    /* background: #963CFF; */
    border-top-right-radius: inherit;
    border-bottom-right-radius: inherit;
    display: grid;
    place-items: center;
    /* color: #37003C; */
  }
  .search-owner {
    font-weight: 700;
  }
  .search-team {
    font-size: small;
  }
  :global(.search-element) {
    background: var(--surface2);
    border-radius: 15px;
  }
  :global(.search-input) {
    background-color: var(--surface2);
    border: 0px solid hsl(var(--brand-hue) 10% 50% / 15%);
    border-radius: 15px;
    border-style: none;
    outline: none;
    display: inline-block;
    padding: 0 2.25em !important;
  }
  :global(.search-dropdown) {
    background-color: var(--surface2) !important;
    color: var(--text1) !important;
    border: none !important;
    border-bottom-left-radius: 5px;
    border-bottom-right-radius: 5px;
    padding: 0 !important;
    padding-bottom: 10px !important;
  }
  :global(.search-dropdown .selected) {
    background-color: var(--surface3) !important;
  }
  :global(.input-container) {
    height: 100%;
  }
  :global(.autocomplete-list-item) {
    position: relative;
    padding-left: 2.25em !important;
  }
</style>