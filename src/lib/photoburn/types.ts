
export type CustomPlane = THREE.Mesh<THREE.PlaneGeometry, THREE.ShaderMaterial>;


export interface LayoutDependants {
    renderer: THREE.WebGLRenderer;
    camera: THREE.OrthographicCamera;
}

export interface PhotoburnData extends LayoutDependants {
    scene: THREE.Scene;
    imageTextures: THREE.Texture[];
    foregroundPlane: CustomPlane;
    backgroundPlane: CustomPlane;
    characterPlane: CustomPlane;
    mouseTrail: THREE.Vector3[];
    progress: number | undefined;
}

