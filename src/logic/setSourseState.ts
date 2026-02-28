import { source, arrRAM } from "../map/map"

export type SourceArr = {
    label: string,
    value: boolean
}

export const setSourseState = (sourceArr: SourceArr[]) => {
    sourceArr.forEach(updateItem => {
        const sourceItem = source.find(item => item.label === updateItem.label)

        if (sourceItem) {
            arrRAM.push({
                type: "source",
                flag: sourceItem.flag,
                id: sourceItem.id
            })
            sourceItem.flag = updateItem.value
        }
    })
}