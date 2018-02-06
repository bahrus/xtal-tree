interface INodeState{
    
}

interface INodePosition{
    node: ITreeNode,
    position: number
}

export interface ITreeNode{
    //children?: ITreeNode[];
    __memo?: INodeState;
}

export interface IXtalTreeProperties{
    childrenFn: (tn: ITreeNode) => ITreeNode[];
    keyFn: (tn: ITreeNode) => string;
    isOpenFn: (tn: ITreeNode) => boolean;
    nodes: ITreeNode[];
    viewableNodes: ITreeNode[];
    toggledNode: ITreeNode;
}

(function () {
    class XtalTree extends HTMLElement implements IXtalTreeProperties{

        _childrenFn : (tn: ITreeNode) => ITreeNode[];
        get childrenFn (){
            return this._childrenFn;
        }
        set childrenFn(node){
            this._childrenFn = node;
        }

        _keyFn: (tn: ITreeNode) => string;
        get keyFn(){
            return this._keyFn;
        }
        set keyFn(node){
            this._keyFn = node;
        }

        _isOpenFn: (tn: ITreeNode) => boolean;
        get isOpenFn(){
            return this._isOpenFn;
        }
        set isOpenFn(node){
            this._isOpenFn = node;
        }

        _nodes: ITreeNode[];
        get nodes(){
            return this._nodes;
        }

        set nodes(nodes){
            this._nodes = nodes;
            this.viewableNodes = this._calculateViewableNodes(this._nodes, []);
        }

        _calculateViewableNodes(nodes: ITreeNode[], acc: ITreeNode[]){
            nodes.forEach(node =>{
                acc.push(node);
                if(this._isOpenFn(node)) this._calculateViewableNodes(this._childrenFn(node), acc);
            })
            return acc;
        }

        _viewableNodes: ITreeNode[];
        get viewableNodes(){
            return this._viewableNodes;
        }



        set viewableNodes(nodes){
            this._viewableNodes = nodes;
            this._indexViewableNodes();
        }

        _viewableNodeKeys : {[key: string]: INodePosition};


        _indexViewableNodes(){
            this._viewableNodeKeys = {};
            this._viewableNodes.forEach((node, idx) =>{
                this._viewableNodeKeys[this.keyFn(node)] = {
                    node:node,
                    position: idx
                }
            })
        }

        set toggledNode(node: ITreeNode){

        }
    }

    customElements.define('xtal-tree', XtalTree)
})();