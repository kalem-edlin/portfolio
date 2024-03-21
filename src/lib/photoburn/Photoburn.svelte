<script lang="ts">
    import { onMount } from 'svelte';
    import * as THREE from 'three';
    import * as PhotoburnHelpers from './photoburnHelpers';
    import type { PhotoburnData } from './types';

    export let scrollY;
    export let onLoaded;
    export let onReadyToScroll;
    export let onWaved;

    const DRAWABLE_HEIGHT = 0;

    let data: PhotoburnData; // All necessary data for shader and geometry manipulation
    let startSpeedUp = false; // Signals a speedup of normal "burn" to scroll animations
    let speedingUp = false; // Indicates a speedup is currently underway
    let isInitialAnimation = false;

    let animateStateFunction: () => void | undefined;
    $: animateStateFunction && console.log(animateStateFunction());

    const mouse = new THREE.Vector2(Infinity, Infinity);

    // The main feature transition animation handler that will use "progress" to "burn" the foreground plane revealing the background plane, whilst taking in new mouse points to add to the burn
    const startAnimation = (initialAnimation: boolean) => {
        let startTime = undefined;
        let animationDuration = PhotoburnHelpers.DURATION;
        !isInitialAnimation && onWaved();
        const transitionAnimation = PhotoburnHelpers.debounce((timestamp) => {
            if (!startTime) startTime = timestamp;

            if (scrollY > DRAWABLE_HEIGHT && startSpeedUp) {
                speedingUp = true;
                animationDuration = PhotoburnHelpers.SPEED_UP_DURATION;
                startTime = timestamp - data.progress * animationDuration;
                startSpeedUp = false;
            }
            data.progress = (timestamp - startTime) / animationDuration;

            // For most animations, accept mouse points into the "burn" tracking by encoding them as a buffer array for dynamic realtime manipulation
            if (!initialAnimation) {
                data.foregroundPlane.material.uniforms.u_mouse_data.value =
                    PhotoburnHelpers.encodeMouseData(data.mouseTrail);
                data.foregroundPlane.material.uniforms.u_num_mouse_data.value =
                    data.mouseTrail.length;
            }
            data.foregroundPlane.material.uniforms.u_time.value = data.progress;

            // TODO: If foreground completely invisible, end animation
            if (data.progress >= 1) {
                speedingUp = false;
                isInitialAnimation && onReadyToScroll();
                isInitialAnimation = false;
                data = PhotoburnHelpers.end(initialAnimation, data);
                animateStateFunction = () =>
                    startScrollAnimationIfNeeded(
                        Math.min(scrollY / data.renderer.domElement.height, 1)
                    );
            } else {
                requestAnimationFrame(transitionAnimation);
            }
            data.renderer.render(data.scene, data.camera);
        }, 20);
        requestAnimationFrame(transitionAnimation);
    };

    // Debounced to mitigate the amount of points that are added given the limits GLSL imposes
    const onMouseMove = PhotoburnHelpers.debounce((event) => {
        if (isInitialAnimation) return;

        const target = event.target;
        mouse.x = event.pageX / target.clientWidth;
        mouse.y = 1 - event.pageY / target.clientHeight;

        if (
            data.mouseTrail.length < PhotoburnHelpers.MAX_MOUSE_POINTS &&
            scrollY <= DRAWABLE_HEIGHT
        ) {
            data.mouseTrail.push(
                new THREE.Vector3(mouse.x, mouse.y, data.progress)
            );
            // Progress is set to undefined to indicate no animation (normal + scroll) playing
            if (!animateStateFunction) {
                // Suspicious that svelte's component state cannot keep up with mouse updates. Employing a state function that only runs on state change (hypothetically just as fast as svelte can manage it)
                animateStateFunction = () => startAnimation(false);
            }
        }
    }, 5);

    // Another important feature that animates the shader noise "burn" to follow the scroll in order to reveal additional site content. Takes an optional targetProgress to tell the scroll animation where to try and gradually catch up to
    const startScrollAnimationIfNeeded = async (
        targetProgress: number | undefined = undefined
    ) => {
        data = PhotoburnHelpers.setupScroll(data);
        let startTime;
        const scrollAnimation = PhotoburnHelpers.debounce((timestamp) => {
            if (scrollY > DRAWABLE_HEIGHT) {
                if (!startTime) startTime = timestamp;
                // Catchup to scroll position after finishing the normal "burn" animation if targetProgress is set
                console.log(targetProgress);
                const posRatio = scrollY / data.renderer.domElement.height;
                if (data.progress < targetProgress) {
                    data.progress = Math.min(
                        (timestamp - startTime) /
                            (PhotoburnHelpers.SPEED_UP_DURATION /
                                targetProgress),
                        1
                    );
                } else {
                    targetProgress = undefined;
                    if (posRatio > 1) {
                        animateStateFunction = undefined;
                        return;
                    }

                    data.progress = Math.min(posRatio, 1);
                }
                data.foregroundPlane.material.uniforms.u_time.value =
                    data.progress;
                requestAnimationFrame(scrollAnimation);
            } else {
                data = PhotoburnHelpers.end(true, data);
                startSpeedUp = false; // TODO: This should be removed and bug fixed
                animateStateFunction = undefined;
            }
            data.renderer.render(data.scene, data.camera);
        }, 20);
        requestAnimationFrame(scrollAnimation);
    };

    $: if (
        scrollY > DRAWABLE_HEIGHT &&
        scrollY < data.renderer.domElement.height
    ) {
        if (animateStateFunction) {
            startSpeedUp = true;
        } else {
            if (!speedingUp)
                animateStateFunction = () => startScrollAnimationIfNeeded();
        }
    } else {
        if (isInitialAnimation)
            animateStateFunction = () => startAnimation(true);
    }

    // TODO: Statically use current image over screen and reload all textures in background
    // Rerender on window resize to keep a consistent canvas visual
    const onResize = PhotoburnHelpers.debounce(() => {
        let aspect = window.innerWidth / data.renderer.domElement.height;
        console.log('aspect ' + aspect);
        let { renderer, camera } = PhotoburnHelpers.update(
            { ...data },
            window.innerWidth
        );
        let { foregroundPlane, backgroundPlane, characterPlane } = data;
        foregroundPlane = PhotoburnHelpers.updatePlane(
            foregroundPlane,
            window.innerWidth,
            aspect
        );
        backgroundPlane = PhotoburnHelpers.updatePlane(
            backgroundPlane,
            window.innerWidth,
            aspect
        );
        characterPlane = PhotoburnHelpers.updatePlane(
            characterPlane,
            window.innerWidth,
            aspect
        );
        renderer.render(data.scene, camera);
    }, 50);

    window.addEventListener('resize', onResize);

    onMount(async () => {
        isInitialAnimation = true;
        if (!data) {
            data = await PhotoburnHelpers.setup();
        }
        await onLoaded();
        scrollY = window.scrollY;
        // If scrolled, set to scroll animation frame and skip the initial "burn" animation
        if (scrollY <= DRAWABLE_HEIGHT) {
            animateStateFunction = () => startAnimation(true);
        } else {
            onReadyToScroll();
        }
    });
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<div
    class="container photoburn_container"
    style={`pointer-events: ${
        scrollY >= data?.renderer.domElement.height / 2 ? 'none' : 'auto'
    }`}
>
    <div on:mousemove={onMouseMove} id="photoburn-canvas" />
</div>

<style>
    #photoburn-canvas {
        width: 100%;
        height: 100%;
    }

    .photoburn_container {
        width: 100vw;
        height: 100vh;
        position: fixed;
        top: 0;
        left: 0;
        z-index: 1;
    }
</style>
