<script>
  import Close from 'carbon-icons-svelte/lib/Close20';
</script>

<div class="back shadow" on:click>
  <Close />
</div>

<style>
  .back {
    height: 40px;
    width: 40px;
    border-radius: 50%;
    position: absolute;
    background: var(--surface2);
    color: var(--text1);
    display: grid;
    place-items: center;
    left: calc(50% - 20px);
    bottom: 55px;
    /* box-shadow: 0px 2px 2px #00000038; */
    border: 1px solid var(--surface4);
  }
</style>