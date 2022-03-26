export function getOGFromPath(og, path) {
    const split = path.split('.');
    return getNodeFromSplit(og, split);
}
export function getNodeFromSplit(og, split) {
    let first = split[0];
    let rest = split.slice(1);
    if (first[0] === '[') {
        const idx = parseInt(first.substr(1, first.length - 2));
        const baseValue = og;
        if (rest.length === 0) {
            return { idx, baseValue };
        }
        else {
            return getNodeFromSplit(baseValue[idx], rest);
        }
    }
    else {
        const bracketSplit = first.split('[');
        if (bracketSplit.length > 1) {
            const arrayPath = '[' + bracketSplit[1].substring(0, bracketSplit[1].length - 1) + ']';
            rest = [arrayPath, ...rest];
            first = bracketSplit[0];
        }
        // const idx = nodes.findIndex(node => node.name === first);
        // if(idx === -1){
        //     throw new Error(`No node found with name ${first}`);
        // }
        // const node = nodes[idx];
        const baseValue = og[first];
        if (rest.length === 0) {
            return { prop: first, baseValue };
        }
        else {
            return getNodeFromSplit(baseValue, rest);
        }
    }
}
