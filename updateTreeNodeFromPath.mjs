import { getTreeNodeFromPath } from './getTreeNodeFromPath.mjs';
export function updateTreeNodeFromPath(nodes, path, value) {
    const match = getTreeNodeFromPath(nodes, path);
    //console.log(match);
    switch (match.node.type) {
        case 'string':
            match.node.value = value;
            break;
        case 'number':
            match.node.value = Number(value);
            break;
        case 'boolean':
            match.node.value = value === 'true';
            break;
        default:
            throw 'NI';
    }
    switch (match.node.type) {
        case 'string':
        case 'number':
        case 'boolean':
            match.node.asString = value.toString();
            break;
    }
}
