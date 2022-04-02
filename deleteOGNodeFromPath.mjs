import { getOGFromPath } from './getOGFromPath.mjs';
export function deleteOGNodeFromPath(og, path) {
    const match = getOGFromPath(og, path);
    const { baseValue, prop, idx } = match;
    const isArray = Array.isArray(baseValue);
    if (isArray) {
        debugger;
    }
    else {
        delete baseValue[prop];
    }
}
