import * as THREE from 'three';
import fragmentShader from './fragment.glsl';
import jsonIcons from './icons.json';
import type { Icon, RawIconData, Sizes } from './types';
import vertexShader from './vertex.glsl';

// Constants for the project
export const VELOCITY_SIZE = 2.5;
export const MAX_VELOCITY_MAGNITUDE = 4;
export const EDGE_PUSH_MULTIPLIER = 0.35;
export const CENTER_PUSH_MULTIPLIER = 0.4;
export const MOUSE_PUSH_MULTIPLIER = 0.2;
export const MOUSE_PUSH_THRESHOLD = 230;
export const ICON_SCALE = 8;
export const MAX_ICON_SIZE = 140;
export const WORLD_SPACE_SCALE = 2.4;
export const AVOIDANCE_RADIUS = 2;
export const AVOIDANCE_STRENGTH = 1;

export const POST_PROCESSING = {
    threshold: 0.9,
    strength: 0.4,
    radius: 1,
    exposure: 1
};

export const setup = (
    theme: string
): {
    renderer: THREE.WebGLRenderer;
    camera: THREE.OrthographicCamera;
    scene: THREE.Scene;
    sizes: Sizes;
} => {
    // Scene and camera set up
    const container = document.getElementById('floatcons-container');
    const width = container.clientWidth;
    const height = container.clientHeight;
    let scene = new THREE.Scene();
    scene.background = new THREE.Color(theme == 'light' ? 0xffffff : 0x111111);
    let camera = new THREE.OrthographicCamera();
    camera.position.z = 5;
    let renderer = new THREE.WebGLRenderer();
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);
    let sizes: Sizes;
    ({ renderer, camera, sizes } = update(width, height, camera, renderer));

    return { renderer, camera, scene, sizes };
};

export const update = (
    width: number,
    height: number,
    camera: THREE.OrthographicCamera,
    renderer: THREE.WebGLRenderer
) => {
    camera.left = -width / 2;
    camera.right = width / 2;
    camera.top = height / 2;
    camera.bottom = -height / 2;
    camera.updateProjectionMatrix();
    let sizes = {
        width,
        height,
        icon: Math.min(
            height > width ? height : width / ICON_SCALE,
            MAX_ICON_SIZE
        )
    };
    renderer.setSize(width, height);
    return { renderer, camera, sizes };
};

const applyEdgePush = (
    velocity: THREE.Vector3,
    mesh: THREE.Object3D<THREE.Event>,
    sizes: Sizes
): THREE.Vector3 => {
    // const perimeterX = sizes.width*WORLD_SPACE_SCALE/2 - sizes.icon/2
    // const perimeterY = sizes.height*WORLD_SPACE_SCALE/2 - sizes.icon/2

    const getRandomVelocity = () =>
        Math.random() * VELOCITY_SIZE - VELOCITY_SIZE / 2;

    // if (mesh.position.x > perimeterX) velocity.add(new THREE.Vector3(-VELOCITY_SIZE, getRandomVelocity(), 0).multiplyScalar(EDGE_PUSH_MULTIPLIER))
    // if (mesh.position.x < -perimeterX) velocity.add(new THREE.Vector3(VELOCITY_SIZE, getRandomVelocity(), 0).multiplyScalar(EDGE_PUSH_MULTIPLIER))
    // if (mesh.position.y > perimeterY) velocity.add(new THREE.Vector3(getRandomVelocity(), -VELOCITY_SIZE, 0).multiplyScalar(EDGE_PUSH_MULTIPLIER))
    // if (mesh.position.y < -perimeterY) velocity.add(new THREE.Vector3(getRandomVelocity(), VELOCITY_SIZE, 0).multiplyScalar(EDGE_PUSH_MULTIPLIER))

    let elipseDistance =
        mesh.position.x ** 2 / ((sizes.width * WORLD_SPACE_SCALE) / 2) ** 2 +
        mesh.position.y ** 2 / ((sizes.height * WORLD_SPACE_SCALE) / 2) ** 2;

    if (elipseDistance >= 1) {
        const avoidanceDirection = new THREE.Vector3(
            -mesh.position.x,
            -mesh.position.y,
            0
        )
            .normalize()
            .addScalar((Math.random() > 0.5 ? -1 : 1) * getRandomVelocity());
        velocity.add(avoidanceDirection.multiplyScalar(EDGE_PUSH_MULTIPLIER));
    }

    return velocity;
};

const applyCenterPush = (
    velocity: THREE.Vector3,
    mesh: THREE.Object3D<THREE.Event>,
    sizes: Sizes,
    scrollY?: number
): THREE.Vector3 => {
    const maxRadiusX = sizes.width / 3;
    const minRadiusY = sizes.height / 2.5;

    let elipseDistance =
        mesh.position.x ** 2 / maxRadiusX ** 2 +
        mesh.position.y ** 2 / minRadiusY ** 2;
    if (elipseDistance <= 1) {
        const avoidanceDirection = new THREE.Vector3(
            mesh.position.x,
            mesh.position.y,
            0
        ).normalize();
        velocity.add(avoidanceDirection.multiplyScalar(CENTER_PUSH_MULTIPLIER));
    }

    return velocity;
};

const limitVelocity = (velocity: THREE.Vector3, skillWeight: number) => {
    // Add velocity and impose a max velocity magnitude
    const weightedMagnitude =
        MAX_VELOCITY_MAGNITUDE * getInverseSkillWeight(skillWeight);
    if (velocity.length() > weightedMagnitude) {
        velocity.normalize().multiplyScalar(weightedMagnitude);
    }
    return velocity;
};

const getInverseSkillWeight = (weight: number) => {
    return 1.4 - 0.2 * weight;
};

export const preFilter = (icons: Icon[], filter: string) => {
    icons = icons.map((icon) => {
        if (icon.skillTypes.includes(filter)) {
            const counterClockwise = new THREE.Vector3(
                -icon.mesh.position.y,
                icon.mesh.position.x
            );
            const clockwise = new THREE.Vector3(
                icon.mesh.position.y,
                -icon.mesh.position.x
            );
            icon.velocity
                .add(Math.random() > 1 ? clockwise : counterClockwise)
                .multiplyScalar(
                    CENTER_PUSH_MULTIPLIER *
                        getInverseSkillWeight(icon.skillWeight)
                );
        }
        icon.velocity.multiplyScalar(Math.random() * (2 - 1) + 1);
        return icon;
    });
    return icons;
};

export const filter = (icons: Icon[], type: string, sizes: Sizes): Icon[] => {
    for (let i = 0; i < icons.length; i++) {
        const icon = icons[i];
        const mesh = icon.mesh;
        let velocity = icon.velocity;

        if (icon.skillTypes.includes(type)) {
            velocity.add(
                new THREE.Vector3(-mesh.position.x, -mesh.position.y, 0)
                    .normalize()
                    .multiplyScalar(CENTER_PUSH_MULTIPLIER * 0.3)
            );
            velocity = applyCenterPush(velocity, mesh, sizes);
        } else {
            velocity.add(
                new THREE.Vector3(mesh.position.x, mesh.position.y, 0)
                    .normalize()
                    .multiplyScalar(EDGE_PUSH_MULTIPLIER * 0.9)
            );
            velocity = applyEdgePush(velocity, mesh, sizes);
        }

        velocity = limitVelocity(velocity, icon.skillWeight);
        mesh.position.add(velocity);
    }
    return icons;
};

export const step = (
    icons: Icon[],
    mouse: THREE.Vector2,
    sizes: Sizes
): Icon[] => {
    for (let i = 0; i < icons.length; i++) {
        let icon = icons[i];
        let mesh = icon.mesh;
        let velocity = icon.velocity;

        velocity = applyEdgePush(velocity, mesh, sizes);
        velocity = applyCenterPush(velocity, mesh, sizes, scrollY);

        // Push away from mouse position
        const dx = mesh.position.x - mouse.x;
        const dy = mesh.position.y - mouse.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < MOUSE_PUSH_THRESHOLD) {
            const avoidanceDirection = new THREE.Vector3(dx, dy, 0).normalize();
            velocity.add(
                avoidanceDirection.multiplyScalar(MOUSE_PUSH_MULTIPLIER)
            );
        }

        velocity = limitVelocity(velocity, icon.skillWeight);
        mesh.position.add(new THREE.Vector3(velocity.x, velocity.y, 0));
    }
    return icons;
};

export const changeTheme = (
    theme: string,
    scene: THREE.Scene,
    icons: Icon[]
) => {
    if (theme === 'light') {
        scene.background = new THREE.Color(0xffffff);
    } else {
        scene.background = new THREE.Color(0x111111);
    }

    const textureLoader = new THREE.TextureLoader();
    for (let i = 0; i < icons.length; i++) {
        let icon = icons[i];
        icon.mesh.material.uniforms.u_texture.value = textureLoader.load(
            theme === 'dark' && icon.srcDark ? icon.srcDark : icon.src
        );
    }
    return { scene, icons };
};

// Create all instances of icon textures into meshes with textures, shaders, velocities, scales and random initial positions some according to the proficiency I have in that skill
export const create = (
    sizes: Sizes,
    theme: string
): { group: THREE.Group; icons: Icon[] } => {
    const geometry = new THREE.PlaneGeometry(sizes.icon, sizes.icon);
    const group = new THREE.Group();
    const textureLoader = new THREE.TextureLoader();

    let icons: Icon[] = [];
    const rawIconsData: RawIconData[] = jsonIcons;

    for (let i = 0; i < rawIconsData.length; i++) {
        let icon = rawIconsData[i];
        let src = icon.src;
        let srcDark = undefined;
        if (src.includes('Dark')) {
            srcDark = src;
            i++;
            icon = rawIconsData[i];
            src = icon.src;
        }

        const material = new THREE.ShaderMaterial({
            uniforms: {
                u_texture: {
                    value: textureLoader.load(
                        theme === 'dark' && srcDark ? srcDark : src
                    )
                }
            },
            vertexShader: vertexShader,
            fragmentShader: fragmentShader,
            transparent: true
        });

        const mesh = new THREE.Mesh(geometry, material);

        let proficiency = icon.proficiency;
        let skillTypes = ['education', 'work', 'passion'].filter(
            (type) => icon[type]
        );
        const skillWeight = 0.67 * proficiency + 1.3;

        mesh.scale.set(skillWeight / 4, skillWeight / 4, 1);

        // the z dimension represents the maximum velocity magnitude for that icon
        const velocity = new THREE.Vector3(
            Math.random() * VELOCITY_SIZE - VELOCITY_SIZE / 2,
            Math.random() * VELOCITY_SIZE - VELOCITY_SIZE / 2,
            0
        );

        // the z dimension uses importance to dictate overlapping
        const position = new THREE.Vector3(
            Math.random() * sizes.width - sizes.width / 2,
            Math.random() * sizes.height - sizes.height / 2,
            skillWeight
        );
        mesh.position.copy(position);

        icons.push({
            mesh,
            velocity,
            skillWeight,
            skillTypes,
            src: icon.src,
            srcDark
        });
        group.add(mesh);
    }
    return { group, icons };
};
