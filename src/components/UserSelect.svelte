<script>
  import IconUser from 'carbon-icons-svelte/lib/User24/User24.svelte';
  import IconSearch from 'carbon-icons-svelte/lib/Search20/Search20.svelte';
  import AutoComplete from "simple-svelte-autocomplete";
  import * as api from '../api'
  import session, { setUser } from '../store'

  let selected;

  async function getUsers(str) {
    // Are special chars sanitized here?
    const url = `search/${encodeURIComponent(str)}`;
    try {
      const response = await api.get(url);
      return response.map((i) => {
        let [ owner, team ] = i.label.split(',', 2);
        return ({
          id: i.value,
          label: i.label,
          team,
          name: team.replace(`(${i.value})`,'').trim(),
          owner,
        });
      });
    } catch (err) {
      console.log(err);
      return [];
    }
  }
  function selectUser(o) {
    if (!selected) return;

    setUser({id: selected.id, name: selected.owner, team: selected.name });
    console.log('Selected:', selected);
  }
</script>

<div class='user-search'>
  <div class='login-icon'><IconUser /></div>
  <div class='search-bar shadow'>
    <AutoComplete 
      searchFunction={getUsers} 
      delay=500
      localSearch=false 
      labelFieldName="label" 
      valueFieldName="value" 
      bind:selectedItem={selected}
      minCharactersToSearch={3}
      hideArrow={true}
      showClear={false}
      placeholder="Team ID/Name or owner"
      onChange={() => selectUser(selected)}
      className="search-element"
      inputClassName="search-input"
      dropdownClassName="search-dropdown"
      >
      <div slot="item" let:item>
        <div class="user-option">
          <div class="search-owner">
            {item.owner}
          </div>
          <div class="search-team">
            {item.team}
          </div>
        </div>
      </div>
      <div slot="no-results" let:noResultsText>{noResultsText}</div>
      <div slot="loading" let:loadingText>{loadingText}</div>
    </AutoComplete>
    <div class="search-icon"><IconSearch /></div>
  </div>
</div>

<style>
  .user-search {
    width: 100%;
    max-width: 400px;
    z-index: 10;
  }
  .login-icon {
    display: grid;
    place-items: center;
    padding-bottom: 1em;
    color: var(--brand);
  }
  .user-option {
    font-size: smaller;
    color: var(--text1);
  }
  .search-bar {
    background: var(--surface2);
    display: grid;
    border-radius: 5px;
    grid-template-columns: 1fr 40px;
  }
  .search-icon {
    background: var(--surface4);
    border-top-right-radius: inherit;
    border-bottom-right-radius: inherit;
    display: grid;
    place-items: center;
    color: var(--text2);
  }
  .search-owner {
    font-weight: 700;
  }
  .search-team {
    font-size: small;
  }
  :global(.search-element) {
    background: var(--surface2);
    /* padding: .25em; */
    border-radius: 5px;
	}
  :global(.search-input) {
    background-color: var(--surface2);
    border: 0px solid hsl(var(--brand-hue) 10% 50% / 15%);
    border-radius: 5px;
    border-style: none;
    outline: none;
	}
  :global(.search-dropdown) {
    background-color: var(--surface1) !important;
    color: var(--text1) !important;
    border-top: 0px !important;
	}
</style>