import { getOGFromPath } from './getOGFromPath.mjs';
export function updateOGFromPath(og, path, value) {
    const match = getOGFromPath(og, path);
    const { baseValue, prop, idx } = match;
    const isArray = Array.isArray(baseValue);
    const key = isArray ? idx : prop;
    const currVal = baseValue[key];
    baseValue[key] = value;
}
