<script lang="ts">
    import { onMount } from 'svelte';
    import InfoSection from './components/InfoSection.svelte';
    import LandingSection from './components/LandingSection.svelte';
    import MouseScrollIndicator from './components/MouseScrollIndicator.svelte';
    import MouseWaveIndicator from './components/MouseWaveIndicator.svelte';
    import content from './data/content';
    import Floatcons from './lib/floatcons/Floatcons.svelte';
    import Photoburn from './lib/photoburn/Photoburn.svelte';

    // const urlParams = new URLSearchParams(window.location.search);
    // const isBeta = urlParams.has('beta');
    // const url = 'https://jsonplaceholder.typicode.com/posts/1';
    // const promise = fetch(url).then(response => response.json());

    // let data: Content = {

    // };

    let loading = true;
    let readyToScroll = false;
    let resolveStartAnimationPromise;

    let floatConsTop: undefined | number;

    let showMouseScrollInitial = false;
    let showMouseWaveInitial = false;
    let showMouseScrollSecond = false;
    let showMouseWaveSecond = false;
    let secondWaveShown = false;
    let waved = false;
    let disableOverlays = false;

    const SCROLL_SPEED_MULTIPLIER = 2;
    const MAIN_HEIGHT = window.innerHeight * 5;
    const FLOATCONS_TOP_POS =
        (MAIN_HEIGHT - window.innerHeight * 2) / SCROLL_SPEED_MULTIPLIER;

    console.log(window.innerHeight);
    console.log(FLOATCONS_TOP_POS);
    console.log(MAIN_HEIGHT);

    let y = 0;

    $: floatConsTop = y > FLOATCONS_TOP_POS ? FLOATCONS_TOP_POS : undefined;

    $: {
        if (y != 0) {
            showMouseScrollInitial = false;
            showMouseWaveInitial = false;
        }
    }

    $: {
        if (y > window.innerHeight && y < FLOATCONS_TOP_POS) {
            disableOverlays = false;
            if (secondWaveShown && !showMouseWaveSecond) {
                showMouseScrollSecond = true;
            } else {
                showMouseWaveSecond = true;
                secondWaveShown = true;
                setTimeout(() => {
                    showMouseWaveSecond = false;
                    setTimeout(() => {
                        showMouseScrollSecond = true;
                    }, 4000);
                }, 6000);
            }
        } else {
            showMouseScrollSecond = false;
            showMouseWaveSecond = false;
            if (y >= FLOATCONS_TOP_POS) {
                disableOverlays = true;
            }
        }
    }

    const onLoaded = async () => {
        await new Promise<void>((resolve) => {
            resolveStartAnimationPromise = resolve;
            setTimeout(() => {
                loading = false;
            }, 2000);
        });
    };

    const onReadyToScroll = async () => {
        resolveStartAnimationPromise = undefined;
        readyToScroll = true;
        setTimeout(() => {
            showMouseWaveInitial = y == 0 && !waved;
        }, 3000);
    };

    const onStartAnimating = async () => {
        resolveStartAnimationPromise();
        resolveStartAnimationPromise = undefined;
    };

    const onWaved = async () => {
        waved = true;
        showMouseWaveInitial = false;

        setTimeout(() => {
            showMouseScrollInitial = y == 0;
        }, 2000);
    };

    onMount(() => {
        console.log('mounted');
        loading = true;
        // y = window.screenY;
    });

    window.addEventListener('scroll', (e) => {
        if (readyToScroll) {
            y = window.scrollY / SCROLL_SPEED_MULTIPLIER;
        } else {
            window.scrollTo(0, 0);
        }
    });

    $: y && console.log(y);
</script>

<LandingSection
    style=""
    {disableOverlays}
    {loading}
    {resolveStartAnimationPromise}
    {onStartAnimating}
    landingCopy={content.landingCopy}
/>
<MouseWaveIndicator
    style="z-index: 3;"
    {showMouseWaveInitial}
    {showMouseWaveSecond}
/>
<MouseScrollIndicator
    style="z-index: 3;"
    {showMouseScrollInitial}
    {showMouseScrollSecond}
/>
<div style={`z-index: 2; position: absolute; width: 100%; height: 100%;`}>
    <Photoburn
        backgroundImages={content.backgroundImages}
        {onLoaded}
        {onReadyToScroll}
        {onWaved}
        scrollY={y}
    />
</div>
{#if readyToScroll}
    <div
        style={`${
            floatConsTop
                ? `position: absolute; top: ${
                      floatConsTop * SCROLL_SPEED_MULTIPLIER
                  }px;`
                : `position: fixed; top: 0px;`
        } z-index: 1; width: 100vw; height: 100vh;`}
    >
        <Floatcons content={content.floatcons} />
    </div>
{/if}
<main
    style={`height: ${MAIN_HEIGHT}px; position: relative;`}
    class="container main_container"
>
    <InfoSection
        content={content.footer}
        style="height: 100vh; width: 100vw; position: absolute; bottom: 0px;"
    />
</main>

<style lang="scss">
    @use './styles' as b;
    .main_container {
        z-index: 0;
        height: 100vh;
    }
</style>
