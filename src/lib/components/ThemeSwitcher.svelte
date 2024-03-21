<script lang="ts">
    import { onMount } from 'svelte';
    import { themeStore } from '../../store/Theme';

    let light = 'light';
    let dark = 'dark';

    let currentTheme = $themeStore;

    const setTheme = (theme: string) => {
        if (theme === dark) {
            localStorage.setItem('theme-preference', dark);
            document.body.classList.add(dark);
            document.body.classList.remove(light);
        } else {
            localStorage.setItem('theme-preference', light);
            document.body.classList.add(light);
            document.body.classList.remove(dark);
        }
    };

    onMount(() => {
        setTheme($themeStore);
    });

    function toggleColorScheme() {
        themeStore.set($themeStore === dark ? light : dark);
        setTheme($themeStore);
    }
</script>

<button on:click={toggleColorScheme}>
    {#if $themeStore === dark}
        <img src="sun.svg" alt="Enable Dark Mode" class="icon-sun" />
    {:else}
        <img src="moon.svg" alt="Enable Light Mode" class="icon-moon" />
    {/if}
</button>
