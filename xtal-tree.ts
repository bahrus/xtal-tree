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
    toggleNodeFn : (tn: ITreeNode) => void;
    nodes: ITreeNode[];
    viewableNodes?: ITreeNode[];
    toggledNode?: ITreeNode;
}

(function () {
    /**
     * `xtal-tree`
     *  Web component wrapper around billboard.js charting library
     *
     * @customElement
     * @polymer
     * @demo demo/index.html
     */
    class XtalTree extends HTMLElement implements IXtalTreeProperties{
        _childrenFn : (tn: ITreeNode) => ITreeNode[];
        get childrenFn (){
            return this._childrenFn;
        }
        set childrenFn(nodeFn){
            this._childrenFn = nodeFn;
            this.onPropsChange();
        }

        _keyFn: (tn: ITreeNode) => string;
        get keyFn(){
            return this._keyFn;
        }
        set keyFn(nodeFn){
            this._keyFn = nodeFn;
            this.onPropsChange();
        }

        _isOpenFn: (tn: ITreeNode) => boolean;
        get isOpenFn(){
            return this._isOpenFn;
        }
        set isOpenFn(nodeFn){
            this._isOpenFn = nodeFn;
            this.onPropsChange();
        }

        _nodes: ITreeNode[];
        get nodes(){
            return this._nodes;
        }

        set nodes(nodes){
            this._nodes = nodes;
            this.onPropsChange();
        }
        notifyViewNodesChanged(){
            const newEvent = new CustomEvent('viewable-nodes-changed', {
                detail: {
                    value: this.viewableNodes
                },
                bubbles: true,
                composed: true
            } as CustomEventInit);
            this.dispatchEvent(newEvent);
        }
        onPropsChange(){
            if(!this._isOpenFn || !this._childrenFn || !this._nodes) return;
            this.viewableNodes = this._calculateViewableNodes(this._nodes, []);
            this.notifyViewNodesChanged();
            
        }

        _calculateViewableNodes(nodes: ITreeNode[], acc: ITreeNode[]){
            // console.log({
            //     isOpenFn: this._isOpenFn,

            // });
            

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
            if(!this._viewableNodes) return;
            this._viewableNodeKeys = {};
            this._viewableNodes.forEach((node, idx) =>{
                this._viewableNodeKeys[this.keyFn(node)] = {
                    node:node,
                    position: idx
                }
            })
        }

        _toggleNodeFn: (tn: ITreeNode) => void;
        get toggleNodeFn(){
            return this._toggleNodeFn;
        }

        set toggleNodeFn(nodeFn){
            this._toggleNodeFn = nodeFn;
        }

        set toggledNode(node: ITreeNode){
            this._toggleNodeFn(node);
            //for now, recalculate all nodes
            this._viewableNodes = this._calculateViewableNodes(this._nodes, []);
            this.notifyViewNodesChanged();
        }
    }

    customElements.define('xtal-tree', XtalTree)
})();