<script lang="ts">
    import { onMount } from 'svelte';
    import Floatcons from './lib/floatcons/Floatcons.svelte';
    import Photoburn from './lib/photoburn/Photoburn.svelte';

    let loading = true;
    let readyToScroll = false;
    let startAnimation = false;

    let floatConsTop: undefined | number;

    let showMouseScrollInitial = false;
    let showMouseWaveInitial = false;
    let showMouseScrollSecond = false;
    let showMouseWaveSecond = false;
    let secondWaveShown = false;
    let waved = false;
    let disableOverlays = false;

    let y = 0;

    $: floatConsTop =
        y > window.innerHeight * 1.5 ? window.innerHeight * 1.5 : undefined;

    $: {
        if (y != 0) {
            showMouseScrollInitial = false;
            showMouseWaveInitial = false;
        }
    }

    $: {
        if (y > window.innerHeight && y < window.innerHeight * 1.5) {
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
            if (y > window.innerHeight * 1.5) {
                disableOverlays = true;
            }
        }
    }

    window.addEventListener('scroll', () => {
        if (readyToScroll) {
            y = window.scrollY;
        } else {
            window.scrollTo(0, 0);
        }
    });

    const onLoaded = async () => {
        await new Promise<void>((resolve) => {
            setTimeout(() => {
                resolve();
            }, 1000);
        });
        loading = false;
    };

    const onReadyToScroll = async () => {
        readyToScroll = true;
        setTimeout(() => {
            showMouseWaveInitial = y == 0 && !waved;
        }, 3000);
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
</script>

<main>
    {#if !disableOverlays}
        <button
            class={`logo_container ${!loading && 'logo_hidden'}`}
            style="flex-direction: column; background-color: transparent;"
            on:click={() => (startAnimation = true)}
        >
            <img
                class="logo logo_header"
                src="logo.gif"
                alt="kalem edlin logo"
            />
            <!-- {#if !loading}
            <span style="position: absolute; bottom: 5%; font-size: x-large;">
                Click to continue...
            </span>
        {/if} -->
        </button>
    {/if}

    <div
        class={`mouse_wave_container ${
            showMouseWaveInitial || showMouseWaveSecond
                ? `mouse_wave_container_show`
                : `mouse_hide`
        }`}
    >
        <svg
            width="197"
            height="296"
            viewBox="0 0 197 296"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                d="M196.56 196.704V98.352C196.56 44.2584 152.334 0 98.28 0C44.226 0 0 44.2584 0 98.352V196.704C0 250.798 44.226 295.056 98.28 295.056C152.334 295.056 196.56 250.798 196.56 196.704ZM98.28 273.2C56.238 273.2 21.84 238.777 21.84 196.704V98.352C21.84 56.2792 56.238 21.856 98.28 21.856C140.322 21.856 174.72 56.2792 174.72 98.352V196.704C174.72 238.777 140.322 273.2 98.28 273.2Z"
                fill="currentColor"
            />
            <path
                d="M98.2803 60.104C92.2743 60.104 87.3604 65.0216 87.3604 71.032V103.816C87.3604 109.826 92.2743 114.744 98.2803 114.744C104.286 114.744 109.2 109.826 109.2 103.816V71.032C109.2 65.0216 104.286 60.104 98.2803 60.104Z"
                fill="currentColor"
            />
        </svg>
    </div>

    {#if showMouseScrollInitial || showMouseScrollSecond}
        <div
            class={`mouse_hint_container ${
                showMouseScrollInitial || showMouseScrollSecond
                    ? `mouse_wave_container_show`
                    : `mouse_hide`
            }`}
        >
            <svg
                width="197"
                height="449"
                color="#ffffff"
                viewBox="0 0 197 449"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path
                    d="M134.317 385.759L98.2807 421.821L62.2447 385.759C57.8767 381.388 51.3247 381.388 46.9567 385.759C42.5887 390.13 42.5887 396.687 46.9567 401.058L90.6367 444.77C92.8207 446.956 95.5507 448.048 98.2807 448.048C101.011 448.048 103.741 446.956 105.925 444.77L149.605 401.058C153.973 396.687 153.973 390.13 149.605 385.759C145.237 381.388 138.685 381.388 134.317 385.759Z"
                    fill="currentColor"
                />
                <path
                    d="M149.605 325.654C145.237 321.283 138.685 321.283 134.317 325.654L98.2807 361.717L62.2447 325.654C57.8767 321.283 51.3247 321.283 46.9567 325.654C42.5887 330.026 42.5887 336.582 46.9567 340.954L90.6367 384.666C92.8207 386.851 95.5507 387.944 98.2807 387.944C101.011 387.944 103.741 386.851 105.925 384.666L149.605 340.954C153.973 336.582 153.973 330.026 149.605 325.654Z"
                    fill="currentColor"
                />
                <path
                    d="M196.56 196.704V98.352C196.56 44.2584 152.334 0 98.28 0C44.226 0 0 44.2584 0 98.352V196.704C0 250.798 44.226 295.056 98.28 295.056C152.334 295.056 196.56 250.798 196.56 196.704ZM98.28 273.2C56.238 273.2 21.84 238.777 21.84 196.704V98.352C21.84 56.2792 56.238 21.856 98.28 21.856C140.322 21.856 174.72 56.2792 174.72 98.352V196.704C174.72 238.777 140.322 273.2 98.28 273.2Z"
                    fill="currentColor"
                />
                <path
                    d="M98.2804 60.104C92.2744 60.104 87.3604 65.0216 87.3604 71.032V103.816C87.3604 109.826 92.2744 114.744 98.2804 114.744C104.286 114.744 109.2 109.826 109.2 103.816V71.032C109.2 65.0216 104.286 60.104 98.2804 60.104Z"
                    fill="currentColor"
                />
            </svg>
        </div>
    {/if}
    <div
        style={`position: absolute; z-index: 20; pointer-events: none; width: 100%; height: 100%;`}
    >
        <Photoburn {onLoaded} {onReadyToScroll} {onWaved} scrollY={y} />
    </div>

    <div style={`z-index: 0;`} class="container main_container">
        {#if readyToScroll}
            <div
                style={`${
                    floatConsTop
                        ? `position: absolute; top: ${floatConsTop}px;`
                        : `position: fixed; top: ;`
                } z-index: 10; width: 100vw; height: 100vh;`}
            >
                <Floatcons {floatConsTop} scrollY={y} />
            </div>
        {/if}
        <div />
        <div />
        <div style="height: 50vh;" />
        <div class="information_container">
            <img class="logo" src="logo.gif" alt="kalem edlin logo" />
            <p>
                My brain is hard-wired to solve problems. I have yet to find one
                that cannot be solved with a plan of attack and a passion to
                learn. I honestly cannot get enough. Let's connect!
            </p>
            <div class="links_container">
                <button
                    ><a href="https://github.com/kalem-edlin">Github</a></button
                >
                <button
                    ><a href="https://www.linkedin.com/in/kalemedlin/"
                        >Linkedin</a
                    ></button
                >
                <button
                    ><a href="mailto:kalemedlin@gmail.com">Contact</a></button
                >
            </div>
        </div>
    </div>
</main>

<style lang="scss">
    @use './styles' as b;
    .main_container {
        z-index: 0;
        height: 100vh;
        div {
            height: 100vh;
            width: 100vw;
        }

        .information_container {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;

            .links_container {
                height: 5rem;
                display: flex;
                flex-direction: row;
                align-items: center;
                justify-content: center;
                gap: 0.5rem;
            }

            p {
                width: 30%;
                @include b.s-screen {
                    width: 80%;
                }
                text-align: center;
            }

            h1 {
                font-size: 3.5rem;
                @include b.xs-screen {
                    font-size: 2.5rem;
                }
                margin-bottom: 1rem;
            }
        }
    }
    .logo_container {
        position: fixed;
        width: 100vw;
        height: 100vh;
        display: flex;
        justify-content: center;
        align-items: center;
        opacity: 0;
        animation: fade-in 1s ease-in forwards;
    }

    .logo_hidden {
        animation: fade-out 1s ease-in forwards;
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

    .mouse_hint_container {
        width: 50px;
        height: 80px;
        position: fixed;
        display: flex;
        justify-content: center;
        align-items: center;
        filter: drop-shadow(0 0 0.75rem #646cff);
        opacity: 0.7;
        z-index: 99;
        bottom: 4%;
        left: 50%;
        transform: translate(-50%, 0);

        animation: bounce 4s infinite;
        transition: opacity 2s;
    }
    .mouse_wave_container {
        width: 70px;
        height: 100px;
        position: fixed;
        filter: drop-shadow(0 0 0.75rem #646cff);
        transition: opacity 2s;
        opacity: 0;
        z-index: 99;
        display: flex;
        justify-content: center;
        align-items: center;
        color: #fff;
        margin-top: 40vh;
        z-index: 99;
        left: 50%;
        transform: translate(-50%, 0);
        animation: wave 8s ease-in-out infinite;
    }

    .mouse_wave_container_show {
        opacity: 0.7;
    }

    .mouse_hide {
        opacity: 0;
    }

    @keyframes wave {
        0% {
            transform: translateX(-20vw) rotate(-10deg);
        }
        50% {
            transform: translateX(20vw) rotate(10deg);
        }
        100% {
            transform: translateX(-20vw) rotate(-10deg);
        }
    }

    @keyframes bounce {
        0% {
            opacity: 0;
        }
        15% {
            opacity: 1;
        }
        30% {
            opacity: 0;
        }
        100% {
            opacity: 0;
        }
    }
</style>
