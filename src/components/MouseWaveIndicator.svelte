<script>
    export let showMouseWaveInitial;
    export let showMouseWaveSecond;
    export let style;
</script>

<div
    {style}
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

<style lang="scss">
    .mouse_wave_container {
        width: 50px;
        height: 80px;
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
</style>
