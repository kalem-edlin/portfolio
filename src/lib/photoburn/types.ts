export type Sizes = { width: number; height: number };

export type LayoutChanges = {
    renderer: THREE.WebGLRenderer;
    camera: THREE.OrthographicCamera;
    sizes: Sizes;
};

export type CustomPlane = THREE.Mesh<THREE.PlaneGeometry, THREE.ShaderMaterial>;

export interface PhotoburnData {
    renderer: THREE.WebGLRenderer;
    scene: THREE.Scene;
    camera: THREE.OrthographicCamera;
    foregroundPlane: CustomPlane;
    backgroundPlane: CustomPlane;
    characterPlane: CustomPlane;
    imageTextures: THREE.Texture[];
    sizes: Sizes;
    mouseTrail: THREE.Vector3[];
    progress: number | undefined;
}
