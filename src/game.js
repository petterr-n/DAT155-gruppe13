import {createScene} from "./scene.js";
import {createJungle} from "./jungle.js";

export function createGame() {
        let activeToolId = '';
        const scene = createScene();
        const jungle = createJungle(16);

        scene.initialize(jungle);
        scene.onObjectSelected = (selectedObject) => {

            let {x, y} = selectedObject.userData;
            const tile = jungle.data[x][y];

            if (activeToolId === 'bulldoze') {
                // remove building
                tile.buildingId = undefined;
                scene.update(jungle);
            } else if (!tile.buildingId) {
                // place building
                tile.buildingId = activeToolId;
                scene.update(jungle);
            }
        }

        window.scene = scene;
        document.addEventListener('mousedown', scene.onMouseDown.bind(scene), false);
        document.addEventListener('mouseup', scene.onMouseUp.bind(scene), false);
        document.addEventListener('mousemove', scene.onMouseMove.bind(scene), false);
        document.addEventListener('contextMenu', (event) => event.preventDefault(), false);

        const game = {
            update() {
                jungle.update();
                scene.update(jungle);
            },
            setActiveToolId(toolId) {
                activeToolId = toolId;
                console.log(activeToolId);
            },
        }

        setInterval(() => {
            game.update();
        }, 1000)

        scene.start();

        return game;
}