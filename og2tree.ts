import {IStandardTreeNode} from  './types';

export function og2tree(obj: any, ancestors: string[] = []): IStandardTreeNode[]{
    const nodes: IStandardTreeNode[] = [];
    if(Array.isArray(obj)){
        let count = 0;
        for(const val of obj){
            let type: string = typeof val;
            if(Array.isArray(val)) type = 'array';
            const name = '[' + count.toString() + ']';
            const node: IStandardTreeNode = {
                name, 
                path: ancestors.join('.') + name,
                type,
                val,
            };
            ancestors.push(name);
            node.children = og2tree(val, ancestors);
            ancestors.pop();
            nodes.push(node);
            count++;
        }
    }else{
        for(const name in obj){
            const val = obj[name];
            let type: string = typeof val;
            if(Array.isArray(val)) type = 'array';
            const node: IStandardTreeNode = {
                name,
                type,
                val,
                path: ancestors.join('.') + name,
            };
    
            switch(typeof val){
                case 'object':
                    ancestors.push(name);
                    node.children = og2tree(val, ancestors);
                    ancestors.pop();
                    break;
            }
            nodes.push(node);
        }
    }

    
    return nodes;

}