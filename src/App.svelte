<script lang="ts">
    import Photoburn from './lib/photoburn/Photoburn.svelte';
</script>

<main>
    <Photoburn />
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
</style>
