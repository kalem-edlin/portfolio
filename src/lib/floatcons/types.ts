export interface RawIconData {
    src: string;
    proficiency: number;
    education: number;
    work: number;
    passion: number;
}

export interface Icon {
    mesh: THREE.Mesh;
    velocity: THREE.Vector3;
    skillWeight: number;
    skillTypes: string[];
    src: string;
    srcDark: string | undefined;
}

export type Sizes = { width: number; height: number; icon: number };
