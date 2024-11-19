// 3D-models used in the simulation
import * as THREE from "three";

export const assets = {
};

export const startingAssets = {
    bonfire: {
        path: 'assets/models/bonfire.glb',
        scale: 2.0,
        type: 'animated',
        position: {x: 40, y: 2.5, z: -17}
    },
    log1: {
        path: 'assets/models/log.glb',
        scale: 0.08,
        type: 'static',
        position: {x: 38, y: 2.2, z: -16},
        target: new THREE.Vector3(40, 2.5, -17),
    },
    log2: {
        path: 'assets/models/log.glb',
        scale: 0.08,
        type: 'static',
        position: {x: 40, y: 2.2, z: -14}
    },
    log3: {
        path: 'assets/models/log.glb',
        scale: 0.08,
        type: 'static',
        position: {x: 42, y: 2.2, z: -16},
        target: new THREE.Vector3(40, 2.5, -17),
    },
    plane: {
        path: 'assets/models/plane.glb',
        scale: 1.0,
        type: 'static',
        position: {x: -15, y: -1.8, z: -40},
    },
    tent: {
        path: 'assets/models/tent.glb',
        scale: 4.0,
        type: 'static',
        position: {x: 40, y: -3, z: -15},
    },
    palm_trees: {
        path: 'assets/models/palm_trees.glb',
        scale: 2.0,
        type: 'static',
        positions: [  // Multiple positions for palm trees, all with y = 2.0
            { x: 20, y: 2.0, z: 40 },
            { x: 25, y: 2.0, z: 45 },
            { x: 15, y: 2.0, z: 55 },
            { x: 30, y: 2.0, z: 60 },
            { x: 10, y: 2.0, z: 35 },
            { x: 22, y: 2.0, z: 50 },
            { x: 18, y: 2.0, z: 30 },
            { x: 24, y: 2.0, z: 70 },
            { x: 15, y: 2.0, z: 25 },
            { x: 32, y: 2.0, z: 80 },
            { x: 40, y: 2.0, z: 45 },
            { x: 28, y: 2.0, z: 55 },
            { x: 38, y: 2.0, z: 65 },
            { x: 20, y: 2.0, z: 75 },
            { x: 26, y: 2.0, z: 90 },
            { x: 35, y: 2.0, z: 40 },
            { x: 33, y: 2.0, z: 50 },
            { x: 37, y: 2.0, z: 60 },
            { x: 29, y: 2.0, z: 30 },
            { x: 42, y: 2.0, z: 55 },
            { x: -14.0, y: 2.0, z: 55.0 },
            { x: -13.0, y: 2.0, z: 33.0 },
            { x: -15.0, y: 2.0, z: 47.0 },
            { x: -16.0, y: 2.0, z: 36.0 },
            { x: -12.0, y: 2.0, z: 98.0 },
            { x: -17.0, y: 2.0, z: 34.0 },
            { x: -13.5, y: 2.0, z: 96.5 },
            { x: -18.0, y: 2.0, z: 38.5 },
            { x: -16.5, y: 2.0, z: 89.0 },
            { x: -14.5, y: 2.0, z: 40.0 },
            { x: -15.5, y: 2.0, z: 54.5 },
            { x: -18.5, y: 2.0, z: 10.5 },
            { x: -17.5, y: 2.0, z: 41.0 },
            { x: -19.0, y: 2.0, z: 41.5 },
            { x: -14.0, y: 2.0, z: 32.0 },
            { x: -16.0, y: 2.0, z: 43.0 },
            { x: -19.5, y: 2.0, z: 53.5 },
            { x: -12.5, y: 2.0, z: 62.5 },
            { x: -17.0, y: 2.0, z: 24.0 },
            { x: -13.5, y: 2.0, z: 75.0 },
            { x: -16.5, y: 2.0, z: 65.5 },
            { x: -19.0, y: 2.0, z: 56.0 }
        ],
        rotation: {
            y: () => THREE.MathUtils.randFloat(0, Math.PI * 2) // Random rotation around Y-axis
        }
    },


};
