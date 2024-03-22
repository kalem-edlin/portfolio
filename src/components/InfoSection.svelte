<script>
    export let style;
    export let content;
</script>

<div {style} class="information_container">
    <img class="logo" src="logo.gif" alt="kalem edlin logo" />
    <p>
        {content.body}
    </p>
    <div class="links_container">
        {#each content.buttons as { name, url }, i}
            <button><a href={url}>{name}</a></button>
        {/each}
    </div>
</div>

<style lang="scss">
    @use '../styles' as b;
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
</style>
