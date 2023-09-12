<script lang="ts">
    import { onMount } from "svelte"
    import * as THREE from 'three'
    import * as PhotoburnHelpers from "./photoburnHelpers"
    import type { PhotoburnData } from "./types"

    let data: PhotoburnData; // All necessary data for shader and geometry manipulation
    let scrollY: number; // Observed by shader animations to execute logic as they run
    let startSpeedUp = false // Signals a speedup of normal "burn" to scroll animations
    let speedingUp = false; // Indicates a speedup is currently underway

    const mouse = new THREE.Vector2(Infinity, Infinity);

    // The main feature transition animation handler that will use "progress" to "burn" the foreground plane revealing the background plane, whilst taking in new mouse points to add to the burn
    const startAnimation = (initialAnimation: boolean) => {
        let startTime = undefined;
        let animationDuration = PhotoburnHelpers.DURATION
        function transitionAnimation(timestamp) {
            if (!startTime) startTime = timestamp;
            
            if (scrollY !== 0 && startSpeedUp) {
                speedingUp = true
                animationDuration = (PhotoburnHelpers.SPEED_UP_DURATION)
                startTime = timestamp - (data.progress * animationDuration)
                startSpeedUp = false
            }
            
            data.progress = (timestamp - startTime) / (animationDuration);

            // For most animations, accept mouse points into the "burn" tracking by encoding them as a buffer array for dynamic realtime manipulation
            if (!initialAnimation) {
                data.foregroundPlane.material.uniforms.u_mouse_data.value = PhotoburnHelpers.encodeMouseData(data.mouseTrail);
                data.foregroundPlane.material.uniforms.u_num_mouse_data.value = data.mouseTrail.length;
            }
            data.foregroundPlane.material.uniforms.u_time.value = data.progress;

            // TODO: If foreground completely invisible, end animation
            if (data.progress >= 1) {
                data = PhotoburnHelpers.end(initialAnimation, data);
                // If scrollY is 0, assume speedup complete and execute scroll animation
                if (scrollY !== 0) {
                    speedingUp = false
                    startScrollAnimationIfNeeded(Math.min(scrollY / data.sizes.height, 1))
                }
            } 
            else {
                requestAnimationFrame(transitionAnimation);
            }
            data.renderer.render(data.scene, data.camera);
        }
        requestAnimationFrame(transitionAnimation);
    }
    
    // Debounced to mitigate the amount of points that are added given the limits GLSL imposes
    const onMouseMove = PhotoburnHelpers.debounce((event) => {
        const target = event.target;
        mouse.x = (event.pageX / target.clientWidth);
        mouse.y = 1-(event.pageY / target.clientHeight);
        
        if (data.mouseTrail.length < PhotoburnHelpers.MAX_MOUSE_POINTS && scrollY === 0) { 
            data.mouseTrail.push(new THREE.Vector3(mouse.x, mouse.y, data.progress));
            // Progress is set to undefined to indicate no animation (normal + scroll) playing
            if (data.progress === undefined) {
                startAnimation(false)
            }
        }
    }, 5)

    // Another important feature that animates the shader noise "burn" to follow the scroll in order to reveal additional site content. Takes an optional targetProgress to tell the scroll animation where to try and gradually catch up to
    const startScrollAnimationIfNeeded = (targetProgress: number | undefined = undefined) => {
        if (startSpeedUp) return
        if (speedingUp) return
        if (data.progress !== undefined) {
            startSpeedUp = true
        } 
        else {
            data = PhotoburnHelpers.setupScroll(data);
            let startTime;
            function scrollAnimation(timestamp) {
                if (scrollY !== 0) {
                    if (!startTime) startTime = timestamp
                    // Catchup to scroll position after finishing the normal "burn" animation if targetProgress is set
                    if (data.progress < targetProgress) {
                        data.progress = (timestamp - startTime) / PhotoburnHelpers.SPEED_UP_DURATION
                    } 
                    else {
                        targetProgress = undefined
                        data.progress = Math.min(scrollY / data.sizes.height, 1)
                    }
                    data.foregroundPlane.material.uniforms.u_time.value = data.progress;
                    requestAnimationFrame(scrollAnimation); 
                }
                else {
                    data = PhotoburnHelpers.end(true, data);
                    startSpeedUp = false // TODO: This should be removed and bug fixed
                }
                data.renderer.render(data.scene, data.camera);
            }
            requestAnimationFrame(scrollAnimation);  
        }
    }

    const onScroll = () => {
        scrollY = window.scrollY
        if (scrollY !== 0) {
            startScrollAnimationIfNeeded()
        }
    }

    // Rerender on window resize to keep a consistent canvas visual
    const onResize = () => {
        console.log(window.innerWidth)
        let {renderer, camera, sizes} = PhotoburnHelpers.update(window.innerWidth, window.innerHeight, data.camera, data.renderer)
        renderer.render(data.scene, camera)
        data = {
            ...data,
            renderer,
            camera,
            sizes
        }
    }

    document.addEventListener("scroll", onScroll)
    window.addEventListener("resize", onResize)

    onMount(() => {
        data = PhotoburnHelpers.setup();
        scrollY = window.scrollY
        // If scrolled, set to scroll animation frame and skip the initial "burn" animation
        if (scrollY === 0) {
            startAnimation(true)
        } 
        else {
            data.foregroundPlane.material.uniforms.u_first.value = false
            startScrollAnimationIfNeeded()
        }
    })
</script>

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

<!-- svelte-ignore a11y-no-static-element-interactions -->
<div 
    class="container photoburn_container"
    style={`pointer-events: ${scrollY >= data?.sizes.height/2 ? "none" : "auto"}`}
>
    <div 
        on:mousemove={onMouseMove}
        id="photoburn-canvas" 
    />
</div>