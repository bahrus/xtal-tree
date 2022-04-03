import {getOGFromPath} from './getOGFromPath.mjs';

export function copyOGNodeToClipboard(og: any, path: string){
    const match = getOGFromPath(og, path);
    const {baseValue, prop, idx} = match;
    const val = baseValue[prop || idx!];
    const json = JSON.stringify(val, null, 2);
    navigator.clipboard.writeText(json);
}