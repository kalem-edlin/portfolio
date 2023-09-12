import * as THREE from 'three'
import mainFragmentShader from './shaders/main.glsl'
import shared from './shaders/shared.glsl'
import supportFragmentShader from './shaders/support.glsl'
import vertexShader from './shaders/vertex.glsl'
import type { CustomPlane, LayoutChanges, PhotoburnData, Sizes } from './types'

export const DURATION = 5000 // The duration of the "burn" transition
export const SPEED_UP_DURATION = 500 // To Speed up the "burn" for scroll animations
export const IMAGES = ['1.png', '2.png', '3.png', '4.png', '5.png'] // Images to "burn"
export const MAX_MOUSE_POINTS = 333 // Max mouse inputs for realtime shader manipulation
export const DEFAULT = new THREE.Vector3(0.5, 0.5, 0.0) // Center position vector
export const BLOOM_THRESHOLD = 0.8 // TODO: Implement bloom on "burn" effect
export const BLOOM_STRENGTH = 0.5 // TODO: Implement bloom on "burn" effect
export const IMAGE_ASPECT_RATIO = 1.797 // The image aspect ratio for all "burn" images

let geometry

// Setup the THREE js canvas and initialize all geometries with their respective textures
export const setup = (): PhotoburnData => {
    const container = document.getElementById('photoburn-canvas')
    const width = container.clientWidth
    const height = container.clientHeight

    let camera = new THREE.OrthographicCamera()
    camera.position.z = 100
    let renderer = new THREE.WebGLRenderer({ alpha: true })
    renderer.setPixelRatio(window.devicePixelRatio)
    container.appendChild(renderer.domElement)
    let sizes: Sizes
    ;({ renderer, camera, sizes } = update(width, height, camera, renderer))

    const scene = new THREE.Scene()
    scene.background = null

    let textureLoader = new THREE.TextureLoader()

    let imageTextures = []
    IMAGES.forEach((url) => {
        const imageTexture = textureLoader.load(url)
        imageTextures.push(imageTexture)
    })

    geometry = new THREE.PlaneGeometry(width, height, 1, 1)

    THREE.ShaderChunk['shared'] = shared

    // The foreground plane uses the main fragment shader which reacts to various user inputs in order to transition from itself to the background plane using noise, radial gradients, and transparency
    const material = new THREE.ShaderMaterial({
        uniforms: {
            u_time: { value: 0.0 },
            u_aspect: { value: width / height },
            u_image_aspect: { value: IMAGE_ASPECT_RATIO },
            u_texture: { value: imageTextures[0] },
            u_mouse_data: { value: encodeMouseData([DEFAULT]) },
            u_num_mouse_data: { value: 1 },
            u_first: { value: true },
            u_random: { value: Math.random() },
        },
        vertexShader: vertexShader,
        fragmentShader: mainFragmentShader,
        transparent: true,
    })

    const foregroundPlane = new THREE.Mesh(geometry, material)
    foregroundPlane.position.z = 0
    scene.add(foregroundPlane)
    const backgroundPlane = getMeshFor(imageTextures[1], -1, sizes)
    const characterPlane = getMeshFor('base.png', 1, sizes)

    return {
        renderer,
        scene,
        camera,
        foregroundPlane,
        backgroundPlane,
        characterPlane,
        imageTextures,
        sizes,
        mouseTrail: [],
        progress: undefined,
    }
}

// Will use the support fragment shader to load a texture, ensuring a consistent letterbox with the foreground plane for seamless transitions
const getMeshFor = (
    imageUrl: string,
    zPosition: number,
    sizes: Sizes
): CustomPlane => {
    const foregroundMaterial = new THREE.ShaderMaterial({
        transparent: true,
        uniforms: {
            u_texture: { value: new THREE.TextureLoader().load(imageUrl) },
            u_aspect: { value: sizes.width / sizes.height },
            u_image_aspect: { value: IMAGE_ASPECT_RATIO },
        },
        vertexShader: vertexShader,
        fragmentShader: supportFragmentShader,
    })

    const foregroundPlane = new THREE.Mesh(geometry, foregroundMaterial)
    foregroundPlane.position.z = zPosition
    return foregroundPlane
}

// A function to initialize and update the camera and renderer on width or height change
export const update = (
    width: number,
    height: number,
    camera: THREE.OrthographicCamera,
    renderer: THREE.WebGLRenderer
): LayoutChanges => {
    camera.left = -width / 2
    camera.right = width / 2
    camera.top = height / 2
    camera.bottom = -height / 2
    camera.updateProjectionMatrix()
    let sizes = { width, height }
    renderer.setSize(width, height)
    renderer.setPixelRatio(window.devicePixelRatio)
    return { renderer, camera, sizes }
}

// Scrap animation persistency and reset shader uniforms while either adding objects or shifting them depending on the state that is ending
export const end = (
    addObjects: boolean,
    data: PhotoburnData
): PhotoburnData => {
    let {
        foregroundPlane,
        backgroundPlane,
        characterPlane,
        scene,
        imageTextures,
    } = data
    if (addObjects) {
        scene.add(characterPlane)
        scene.add(backgroundPlane)
        foregroundPlane.material.uniforms.u_first.value = false
    } 
    else {
        const old_foreground = imageTextures.shift()
        imageTextures.push(old_foreground)
    }
    foregroundPlane.material.uniforms.u_texture.value = imageTextures[0]
    backgroundPlane.material.uniforms.u_texture.value = imageTextures[1]
    foregroundPlane.material.uniforms.u_time.value = 0.0
    foregroundPlane.material.uniforms.u_num_mouse_data.value = 0
    foregroundPlane.material.uniforms.u_random.value = Math.random()

    return {
        ...data,
        foregroundPlane,
        backgroundPlane,
        characterPlane,
        scene,
        imageTextures,
        progress: undefined,
        mouseTrail: [],
    }
}

// Prepares the geometry and material shaders for scroll animations
export const setupScroll = (data: PhotoburnData): PhotoburnData => {
    let { foregroundPlane, backgroundPlane, characterPlane, scene } = data
    foregroundPlane.material.uniforms.u_mouse_data.value = encodeMouseData([
        new THREE.Vector3(0.5, -0.08),
    ])
    foregroundPlane.material.uniforms.u_num_mouse_data.value = 1
    scene.remove(backgroundPlane)
    scene.remove(characterPlane)
    return {
        ...data,
        foregroundPlane,
        backgroundPlane,
        characterPlane,
        scene,
        progress: 0,
    }
}

// TODO: This function will return a boolean signalling if foreground is still in view
export const foregroundInView = (
    foregroundPlane: THREE.Mesh<THREE.PlaneGeometry, THREE.ShaderMaterial>,
    camera: THREE.OrthographicCamera
) => {
    return
}

// A trick I am using to send large amounts of mouse data dynamically to the shaders for real time mouse inputs as the shader animation plays out. Tightly coupled with the main fragment shader due to the encoded data array schemantics.
export const encodeMouseData = (mouseData) => {
    const encodedData = new Float32Array(MAX_MOUSE_POINTS * 3).fill(0.0)
    for (let i = 0; i < mouseData.length; i++) {
        encodedData[i * 3] = mouseData[i].x
        encodedData[i * 3 + 1] = mouseData[i].y
        encodedData[i * 3 + 2] = mouseData[i].z
    }
    return encodedData
}

// A necessary and generic debounce function to prevent realtime functions from being called back-to-back when not needed
export const debounce = (func, delay) => {
    let timerId
    return function () {
        clearTimeout(timerId)
        timerId = setTimeout(() => {
            func.apply(this, arguments)
        }, delay)
    }
}
