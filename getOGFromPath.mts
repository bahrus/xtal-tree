import {IStandardTreeNode, IOGRef} from './types';

export function getOGFromPath(og: any, path: string): IOGRef{
    const split = path.split('.');
    return getNodeFromSplit(og, split);
}

export function getNodeFromSplit(og: any, split: string[]): IOGRef{
    let first = split[0];
    let rest = split.slice(1);
    if(first[0] === '['){
        const idx = parseInt(first.substr(1, first.length - 2));
        const baseValue = og;
        if(rest.length === 0){
            return {idx, baseValue};
        }else{
            return getNodeFromSplit(baseValue[idx], rest);
        }
    }else{
        const bracketSplit = first.split('[');
        if(bracketSplit.length > 1){
            const arrayPath = '[' + bracketSplit[1].substring(0, bracketSplit[1].length - 1) + ']';
            rest = [arrayPath, ...rest];
            first = bracketSplit[0];
        }
        const baseValue = og;
        if(rest.length === 0){
            return {prop: first, baseValue};
        }else{
            return getNodeFromSplit(baseValue[first], rest);
        }

    }
}