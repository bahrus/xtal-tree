import {IStandardTreeNode} from  './types';

export function tree2og(nodes: IStandardTreeNode[]) : any {
    if(nodes.length === 0) return undefined;
    if(nodes[0].name === '[0]'){
        return treeArray2og(nodes);
    }else{
        return treeObj2og(nodes);
    }
}

function treeArray2og(nodes: IStandardTreeNode[]) : any[] {
    const arr: any[] = [];
    let count = 0;
    for(const node of nodes){
        arr[count] = node.value;
        count++;
    }
    return arr;
}

function treeObj2og(nodes: IStandardTreeNode[]) : any {
    
}