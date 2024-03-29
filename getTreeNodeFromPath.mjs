export function getTreeNodeFromPath(nodes, path) {
    const split = path.split('.');
    return getTreeNodeFromSplit(nodes, split);
}
export function getTreeNodeFromSplit(nodes, split) {
    let first = split[0];
    let rest = split.slice(1);
    if (first[0] === '[') {
        const idx = parseInt(first.substr(1, first.length - 2));
        const node = nodes[idx];
        if (rest.length === 0) {
            return { idx, node };
        }
        else {
            return getTreeNodeFromSplit(node.children, rest);
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
        const node = nodes[idx];
        if (rest.length === 0) {
            return { prop: first, node };
        }
        else {
            return getTreeNodeFromSplit(node.children, rest);
        }
    }
}
