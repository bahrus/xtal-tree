import {ITreeNode, IStandardTreeNode} from './types';
import {getNodeFromPath} from './getNodeFromPath.mjs';

export async function updatePath(nodes: IStandardTreeNode[], path: string, value: string){
    const match = getNodeFromPath(nodes, path);
    console.log(match);
    switch(match.node!.type){
        case 'string':
            match.node!.value = value;
            break;
        case 'number':
            match.node!.value = Number(value);
            break;
        case 'boolean':
            match.node!.value = value === 'true';
            break;
        default:
            throw 'NI';
    }
}