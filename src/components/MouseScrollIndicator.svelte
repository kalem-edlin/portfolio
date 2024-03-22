<script>
    export let showMouseScrollInitial;
    export let showMouseScrollSecond;
    export let style;
</script>

{#if showMouseScrollInitial || showMouseScrollSecond}
    <div
        {style}
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

<style lang="scss">
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
        bottom: 6%;
        left: 50%;
        transform: translate(-50%, 0);

        animation: bounce 4s infinite;
        transition: opacity 2s;
    }

    .mouse_hide {
        opacity: 0;
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
