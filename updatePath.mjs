import { getNodeFromPath } from './getNodeFromPath.mjs';
export async function updatePath(nodes, path, value) {
    const match = getNodeFromPath(nodes, path);
    switch (match.node.type) {
        case 'string':
            match.baseValue[match.prop] = value;
            break;
        case 'number':
            match.baseValue[match.prop] = Number(value);
            break;
        case 'boolean':
            match.baseValue[match.prop] = value === 'true';
            break;
        default:
            throw 'NI';
    }
}
