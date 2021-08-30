<script>
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
    switchUser({id: selected.id, name: selected.name, team: selected.team });
  }
</script>

<div class="user-search">
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

<style lang="scss">
  .user-search {
    width: 100%;
    max-width: 400px;
    z-index: 10;
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
    color: var(--text1);
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