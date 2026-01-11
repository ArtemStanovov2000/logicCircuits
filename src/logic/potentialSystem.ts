import { substrateLayer, sources, temporaryArray } from "../map/map";

export const updatePotentials = () => {
    console.log(temporaryArray);

    for (let i = temporaryArray.length - 1; i >= 0; i--) {
        if (temporaryArray[i].type === "source") {
            for (let j = 0; j < sources.length; j++) {
                if (temporaryArray[i].id.row === sources[j].id.row && temporaryArray[i].id.column === sources[j].id.column) {
                    sources[j].value = temporaryArray[i].value;
                    temporaryArray.splice(i, 1);
                    break;
                }
            }
        } else {
            temporaryArray.splice(i, 1);
        }
    }
};