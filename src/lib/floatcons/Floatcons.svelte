<script lang="ts">
    import { onMount } from 'svelte';
    import * as THREE from 'three';
    import * as Floatcons from './floatconsHelpers';
    import type { Icon, Sizes } from './types';

    let sizes: Sizes;
    let icons: Icon[];
    let renderer: THREE.WebGLRenderer;
    let camera: THREE.OrthographicCamera;
    let scene: THREE.Scene;
    let wrangling: boolean = false;
    export let content;

    const mouse = new THREE.Vector2(Infinity, Infinity);

    const onFilter = () => {
        if (!wrangling) {
            icons = Floatcons.preFilter(icons);
            wrangling = true;
        } else {
            wrangling = false;
        }
    };

    const onMouseMove = (event) => {
        const target = event.currentTarget;
        const left = target.getBoundingClientRect().left;
        const top = target.getBoundingClientRect().top;
        mouse.x = event.clientX - left - target.clientWidth / 2;
        mouse.y = -(event.clientY - top - target.clientHeight / 2);
    };

    const onMouseLeave = () => {
        mouse.x = Infinity;
        mouse.y = Infinity;
    };

    const onResize = (event) => {
        ({ renderer, camera, sizes } = Floatcons.update(
            event.clientWidth,
            event.clientHeight,
            camera,
            renderer
        ));
    };

    // function to loop change icon svgs and background on $themeStore change
    // $: {
    //     scene.background =
    // }

    onMount(() => {
        ({ renderer, camera, scene, sizes } = Floatcons.setup());

        let created = Floatcons.create(sizes, content.customIcons);
        icons = created.icons;
        scene.add(created.group);

        const animate = () => {
            if (wrangling) {
                icons = Floatcons.filter(icons, sizes);
            } else {
                icons = Floatcons.step(icons, mouse, sizes);
            }
            renderer.render(scene, camera);
            requestAnimationFrame(animate);
        };
        animate();
    });
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<div
    on:mousemove={onMouseMove}
    on:mouseleave={onMouseLeave}
    on:resize={onResize}
    id="floatcons-container"
>
    <!-- style={`left: ${ 
    (scrollY / window.innerHeight / 2) * window.innerWidth
}px; margin-left: 0%;`} -->
    <div class="container skills-container">
        {#if !wrangling}
            <h1>{content.header}</h1>
            <p>
                {content.bodyFirst}<span style="font-style: italic;"
                    >{content.bodyItalic}</span
                >{content.bodyLast}
            </p>
        {/if}
        <button
            class="primary-text"
            on:click={() => {
                onFilter();
            }}>{wrangling ? content.release : content.wrangle}</button
        >
    </div>
</div>

<style lang="scss">
    @use './../../styles' as b;
    .skills-container {
        position: absolute;
        z-index: 1;
        width: 100%;
        height: 100%;
        border-radius: 50%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;

        p {
            width: 30%;
            @include b.s-screen {
                width: 80%;
            }
            text-align: center;
            color: var(--text-color-2);
        }

        h1 {
            text-align: center;
            font-size: 3.5rem;
            @include b.xs-screen {
                font-size: 2.5rem;
            }
            margin-bottom: 1rem;
        }

        button {
            margin-top: 1rem;
        }
    }

    .primary-text {
        color: var(--toggle-bg);
    }

    #floatcons-container {
        width: 100%;
        height: 100vh;
    }
</style>
