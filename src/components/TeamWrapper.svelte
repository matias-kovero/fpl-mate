<script>
  import TeamElement from "./TeamElement.svelte";
  export let team;
  // $: console.log('Picks:', picks);
  // $: team.then(d => console.log('team', d));
</script>

<div class="wrapper">
  {#await team}
    <div>Loading...</div>
  {:then t}
    {#each t.picks as pick, i}
      <TeamElement {pick} />
    {/each}
  {/await}
</div>

<style lang="scss">
  .wrapper {
    padding-top: 1.5em;
    display: grid;
    gap: .5em;
  }
</style>