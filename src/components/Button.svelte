<script>

</script>

<div class="element shadow">
  <div class="icon">
    <slot name="icon"></slot>
  </div>
  <div class="content">
    <slot name="content"></slot>
  </div>
  <div class="btn shadow">
    <slot name="btn"></slot>
  </div>
</div>

<style>
  .element {
    background: var(--surface2);
    padding: .25em;
    border-radius: 5px;
    height: 40px;
    display: grid;
    grid-template-columns: 45px 1fr 40px;
    place-items: center;
  }
  .icon, .icon :global(div) {
    font-weight: 700;
    background: var(--surface4);
    display: grid;
    place-items: center;
    height: 100%;
    width: 100%;
    border-radius: 3px;
    color: var(--text2);
  }
  .content {
    display: grid;
    width: 100%;
    height: 100%;
    color: var(--text1);
    font-size: small;
  }
  .btn, .btn :global(div) {
    display: grid;
    margin: auto;
    color: var(--text2);
  }
  .content :global(div) { 
    padding-left: .5em;
    display: flex;
    flex-direction: column;
    align-content: flex-start;
    justify-content: center;
  }
  .content :global(a) {
    color: var(--text1);
    text-decoration: none;
    display: flex;
    flex-direction: column;
    align-content: flex-start;
    justify-content: center;
    padding-left: 1em;
  }
</style>