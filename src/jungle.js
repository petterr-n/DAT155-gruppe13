import {createAssetInstance} from "./assets";

export function createJungle(size) {
    const data = [];

    initialize();

    function initialize() {
        for (let x = 0; x < size; x++) {
            const column = [];
            for (let y = 0; y < size; y++) {
                const tile = createTile(x, y);
                column.push(tile);
            }
            data.push(column);
        }
    }

    function update() {
        console.log(`Updating jungle`);
        for (let x = 0; x < size; x++) {
            for (let y = 0; y < size; y++) {
                data[x][y].update();
            }
        }
    }

    return {
        size,
        data,
        update,
    }
}

function createTile(x, y) {
    return {
        x,
        y,
        terrainId: 'grass',
        buildingId: undefined,
        update() {

        }
    };
}