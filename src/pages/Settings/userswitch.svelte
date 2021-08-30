<script>
  import BackButton from 'components/BackButton.svelte';
  import UserSearch from 'components/SearchUser.svelte';
  import UserIcon from 'carbon-icons-svelte/lib/User20';
  import FavouriteIcon from 'carbon-icons-svelte/lib/UserFavorite20';
  import Button from 'components/Button.svelte';
  import Close from 'carbon-icons-svelte/lib/Close20';
  import session, { setFavourite, removeUser, switchUser } from 'src/store.js';
  export let close; // Why I can't call it directly here?
  $: users = $session.user.history.users();

  function selectUser(user) {
    //switchSubPage(null);
    switchUser(user);
    close();
  }
  function favouriteUser(id) {
    if ($session.user.favourite == id) return;
    setFavourite(id);
  }
</script>

<div class="userswitch-wrap">
  <p>Find an new user</p>
  <UserSearch />
  <p>&#8213; or &#8213;</p>
  <div class="search-history">
    {#each users as user, i}
    <Button>
      <div slot="icon">
        <svelte:component this={$session.user.favourite == user.id ? FavouriteIcon : UserIcon} class="shadow" on:click={() => favouriteUser(user.id)} />
      </div>
      <div slot="content">
        <div on:click={() => selectUser(user)} class="user">
          <div class="name">{user.name}</div>
          <div class="team">{user.team}</div>
        </div>
      </div>
      <div slot="btn">
        <Close class="shadow" on:click={() => { removeUser(user.id) }} />
      </div>
    </Button>
    {/each}
  </div>
</div>

<BackButton on:click />

<style lang="scss">
  .userswitch-wrap {
    display: grid;
    /* min-height: 350px; */
    padding-bottom: 5em;
  }
  .search-history {
    display: grid;
    gap: .5em;
  }
  .user {
    align-items: flex-start;
    .name {
      font-weight: 700;
    }
  }
</style>