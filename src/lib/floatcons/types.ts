export interface Icon {
    mesh: THREE.Mesh;
    velocity: THREE.Vector3;
    skillWeight: number;
    src: string;
}

export type Sizes = { width: number; height: number; icon: number };
