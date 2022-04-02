import { getOGFromPath } from './getOGFromPath.mjs';
export async function deleteOGNodeFromPath(og, path) {
    const match = getOGFromPath(og, path);
    const { baseValue, prop, idx } = match;
    const isArray = Array.isArray(baseValue);
    if (isArray) {
        // debugger;
        // const {substrBefore} = await import('trans-render/lib/substrBefore.js');
        // const parentPath = substrBefore(path, '.', true);
        // const parentMatch = getOGFromPath(og, parentPath);
        // const idxOrKey = parentMatch.prop || parentMatch.idx!
        // const arr = parentMatch.baseValue[idxOrKey];
        // // remove index idx from arr
        const newArr = baseValue.splice(idx, 1);
    }
    else {
        delete baseValue[prop];
    }
}
