export function getNodeFromPath(nodes, path) {
    const split = path.split('.');
    return getNodeFromSplit(nodes, split);
}
export function getNodeFromSplit(nodes, split) {
    let first = split[0];
    let rest = split.slice(1);
    if (first[0] === '[') {
        const idx = parseInt(first.substr(1, first.length - 2));
        if (rest.length === 0) {
            return { baseValue: nodes, idx };
        }
        else {
            const node = nodes[idx];
            return getNodeFromSplit(node.children, rest);
        }
    }
    else {
        const bracketSplit = first.split('[');
        if (bracketSplit.length > 1) {
            const arrayPath = '[' + bracketSplit[1].substring(0, bracketSplit[1].length - 1) + ']';
            rest = [arrayPath, ...rest];
            first = bracketSplit[0];
        }
        const idx = nodes.findIndex(node => node.name === first);
        if (idx === -1) {
            throw new Error(`No node found with name ${first}`);
        }
        if (rest.length === 0) {
            return { baseValue: nodes, prop: first };
        }
        else {
            const node = nodes[idx];
            return getNodeFromSplit(node.children, rest);
        }
    }
}
