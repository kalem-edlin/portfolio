<script>
    export let disableOverlays;
    export let loading;
    export let resolveStartAnimationPromise;
    export let style;
    export let onStartAnimating;
    export let landingCopy;

    $: hidden = !loading && !resolveStartAnimationPromise;
</script>

{#if !disableOverlays}
    <button
        class={`logo_container ${hidden && 'logo_hidden'}`}
        style={'flex-direction: column; background-color: transparent; ' +
            style}
        on:click={onStartAnimating}
    >
        <img class="logo logo_header" src="logo.gif" alt="kalem edlin logo" />
        <span
            class={`continue_text_container ${
                !loading && `show_continue_text`
            }`}
        >
            {landingCopy}
        </span>
    </button>
{/if}

<style lang="scss">
    @use './../styles' as b;
    .logo_container {
        position: fixed;
        width: 100vw;
        height: 100vh;
        display: flex;
        justify-content: center;
        align-items: center;
        opacity: 0;
        animation: fade-in 1s ease-in forwards;
        z-index: 99;
    }

    .logo_container:hover {
        border-color: transparent;
    }
    .logo_container:focus,
    .logo_container:focus-visible {
        outline: 0px;
    }

    .logo_hidden {
        animation: fade-out 1s ease-in forwards;
        z-index: -1;
    }

    @keyframes fade-out {
        from {
            opacity: 1;
        }
        to {
            opacity: 0;
            display: 'none';
        }
    }

    .continue_text_container {
        position: absolute;
        bottom: 5%;
        font-size: x-large;
        opacity: 0;
    }

    .show_continue_text {
        animation: fade-in 2s forwards;
    }

    .logo {
        width: 40%;
        @include b.s-screen {
            width: 90%;
        }
    }

    .logo_header {
        @include b.s-screen {
            transform: rotate(90deg);
        }
    }
</style>
