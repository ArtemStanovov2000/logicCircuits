import { source, arrRAM } from "../map/map"

export type SourceArr = {
    label: string,
    value: number
}

export const setSourseState = (sourceArr: SourceArr[]) => {
    sourceArr.forEach(updateItem => {
        const sourceItem = source.find(item => item.label === updateItem.label)

        if (sourceItem) {
            arrRAM.push({
                type: "source",
                value: updateItem.value,
                id: sourceItem.id,
                label: sourceItem.label
            })
            sourceItem.value = updateItem.value
        }
    })
}