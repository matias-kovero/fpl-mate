<script>
  import { onMount } from 'svelte';
  import BackButton from 'components/BackButton.svelte';
  const colors = { 'light': '#fcfdfd', 'dark': '#22282a', 'dim': '#394246' };
  let doc;

  onMount(() => {
    doc = document.firstElementChild;
  });

  let themes = [
    { value: 'light', color: '#fcfdfd' },
    { value: 'dark', color: '#22282a' },
    { value: 'dim', color: '#394246' },
  ]
  function changeTheme(theme) {
    if (!doc) return;
    doc.setAttribute('color-scheme', theme.value);
    // Save this to localStorage as well - for percistent
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('theme', theme.value);
      // Should find a way to use css values here...
      document.querySelector('meta[name="theme-color"]').setAttribute('content', `${theme.color}`);
    }
  }
</script>

<div>Themes</div>

<div class="theme-selector">
  <p>Select your theme</p>
  <div class="selectors">
    {#each themes as theme}
    <div class="theme-container">
      <div class="theme-selector shadow-1"
        on:click={() => changeTheme(theme)}
        style={`background-color: var(--surface1-${theme.value});` + 
        `color: var(--text1-${theme.value}); border: 1px solid var(--surface1-${theme.value});`}
      ></div>
      <span class="theme-text">{theme.value}</span>
    </div>
    {/each}
  </div>
  <BackButton on:click />
</div>

<style>
  .selectors {
    display: grid;
    gap: 2em;
    grid-template-columns: repeat(3, 1fr);
  }
  .theme-selector {
    display: grid;
    place-items: center;
    border-radius: 10%;
    padding: .75em 1.75em;
  }
  .theme-container {
    display: grid;
    gap: 5px;
  }
  .theme-text {
    display:grid;
    place-content: center;
    color: var(--text1);
    font-size: 80%;
    text-transform: capitalize;
  }
</style>