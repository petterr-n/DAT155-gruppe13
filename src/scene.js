import * as THREE from 'three';
import {createCamera} from "./camera.js";
import {createAssetInstance} from "./assets";

export function createScene() {
    const gameWindow = document.getElementById('render-target');
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x777777);

    const camera = createCamera(gameWindow);
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(gameWindow.offsetWidth, gameWindow.offsetHeight);
    gameWindow.appendChild(renderer.domElement);

    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    let selectedObject = undefined;
    let onObjectSelected = undefined;

    let terrain = [];
    let buildings = [];

    function initialize(jungle) {
        scene.clear();
        terrain = [];
        buildings = [];
        for (let x = 0; x < jungle.size; x++) {
            const column = [];
            for (let y = 0; y < jungle.size; y++) {
                // Terrain
                const terrainId = jungle.data[x][y].terrainId;
                const mesh = createAssetInstance(terrainId, x, y);
                scene.add(mesh);
                column.push(mesh);
            }
            terrain.push(column);
            buildings.push([...Array(jungle.size)]);
        }
        setupLights();
    }

    function update(jungle) {
        for (let x = 0; x < jungle.size; x++) {
            for (let y = 0; y < jungle.size; y++) {
                const currentBuildingId = buildings[x][y]?.userData.id;
                const newBuildingId = jungle.data[x][y].buildingId;
                // If player removes a building
                if (!newBuildingId && currentBuildingId) {
                    scene.remove(buildings[x][y]);
                    buildings[x][y] = undefined;
                }
                // If data model has changed
                if (newBuildingId && newBuildingId !== currentBuildingId) {
                    scene.remove(buildings[x][y]);
                    buildings[x][y] = createAssetInstance(newBuildingId, x, y);
                    scene.add(buildings[x][y]);
                }
            }
        }
    }

    function setupLights() {
        const lights = [
            new THREE.AmbientLight(0xffffff, 0.2),
            new THREE.DirectionalLight(0xffffff, 0.3),
            new THREE.DirectionalLight(0xffffff, 0.3),
            new THREE.DirectionalLight(0xffffff, 0.3)
        ];

        lights[1].position.set(0, 1, 0);
        lights[2].position.set(1, 1, 0);
        lights[3].position.set(0, 1, 1);

        scene.add(...lights);

    }

    function draw() {
        // mesh.rotation.x += 0.01;
        // mesh.rotation.y += 0.01;
        renderer.render(scene, camera.camera);
    }

    function start() {
        renderer.setAnimationLoop(draw);
    }

    function stop() {
        renderer.setAnimationLoop(null);
    }

    function onMouseDown(event) {
        camera.onMouseDown(event);

        mouse.x = (event.clientX / renderer.domElement.clientWidth) * 2 - 1;
        mouse.y = -(event.clientY / renderer.domElement.clientHeight) * 2 + 1;

        raycaster.setFromCamera(mouse, camera.camera);

        let intersections = raycaster.intersectObjects(scene.children, false);

        if (intersections.length > 0) {
            console.log(intersections[0]);
            if (selectedObject) selectedObject.material.emissive.setHex(0);
            selectedObject = intersections[0].object;
            selectedObject.material.emissive.setHex(0x555555);
            console.log(selectedObject.userData);

            if (this.onObjectSelected) {
                this.onObjectSelected(selectedObject);
            }
        }
    }

    function onMouseUp(event) {
        camera.onMouseUp(event);
    }

    function onMouseMove(event) {
        camera.onMouseMove(event);
    }

    return {
        onObjectSelected,
        initialize,
        update,
        start,
        stop,
        onMouseDown,
        onMouseUp,
        onMouseMove,
    }

}