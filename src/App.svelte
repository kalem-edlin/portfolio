<script lang="ts">
    import Photoburn from './lib/photoburn/Photoburn.svelte';
    let loading = true;
    let mouseHintShown = false;
    let y = 0;

    $: !loading &&
        setTimeout(() => {
            mouseHintShown = true;
        }, 6000);

    console.log(loading);
</script>

<main>
    <div class={`logo_container ${!loading && 'logo_hidden'}`}>
        <img class="logo" src="logo.gif" alt="kalem edlin logo" />
    </div>

    {#if mouseHintShown}
        <div class={`mouse_hint_container ${y > 0 && 'mouse_hint_hide'}`}>
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
    <Photoburn
        onLoad={() => {
            loading = false;
        }}
        onOuterScroll={(newY) => {
            y = newY;
        }}
    />

    <div class="container main_container">
        <div />
        <div class="information_container">
            <h1>Kalem Edlin</h1>
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
        scroll-behavior: smooth;
        scroll-snap-type: mandatory;
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
        position: absolute;
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

    @keyframes fade-in {
        from {
            opacity: 0;
        }
        to {
            opacity: 1;
        }
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
    }

    .mouse_hint_container {
        width: 30px;
        height: 50px;
        position: absolute;
        display: flex;
        justify-content: center;
        align-items: center;
        filter: drop-shadow(0 0 0.75rem #646cff);
        opacity: 0;
        z-index: 99;
        bottom: 4%;
        left: 50%;
        animation: bounce 6s infinite;
    }

    @keyframes mouse-out {
        from {
            opacity: 0.5;
        }
        to {
            opacity: 0;
        }
    }
    .mouse_hint_hide {
        animation: mouse-out 2s forwards;
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
