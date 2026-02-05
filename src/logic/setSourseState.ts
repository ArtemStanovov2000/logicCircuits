import { source } from "../map/map"

export type SourceArr = {
    label: string, 
    value: boolean
}

export const setSourseState = (sourceArr: SourceArr[]) => {
    sourceArr.forEach(updateItem => {
        const sourceItem = source.find(item => item.label === updateItem.label)
        
        if (sourceItem) {
            sourceItem.flag = updateItem.value
        }
    })
}