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
    testNodeFn?: (tn: ITreeNode, search: string) => boolean;
    toggleNodeFn : (tn: ITreeNode) => void;
    nodes: ITreeNode[];
    viewableNodes?: ITreeNode[];
    toggledNode?: ITreeNode;
    searchString?: string;
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

        _searchString: string;
        get searchString(){
            return this._searchString;
        }
        set searchString(val){
            this._searchString = val;
        }

        _testNodeFn?: (tn: ITreeNode, search: string) => boolean;
        get testNodeFn(){
            return this._testNodeFn;
        }
        set testNodeFn(fn){
            this._testNodeFn = fn;
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
            //console.log(this.viewableNodes);
        }
        onPropsChange(){
            if(!this._isOpenFn || !this._childrenFn || !this._nodes) return;
            if(this._levelSetterFn){
                this._levelSetterFn(this._nodes, 0);
            }
            this.viewableNodes = this._calculateViewableNodes(this._nodes, []);
            this.notifyViewNodesChanged();
            
        }

        _calculateViewableNodes(nodes: ITreeNode[], acc: ITreeNode[]){
            if(!nodes) return;
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

        // testNode(node: ITreeNode){
        //     if(!this.)
        // }

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
            //this._nodes = this._nodes.slice();
            this._viewableNodes = this._calculateViewableNodes(this._nodes, []);
            this.notifyViewNodesChanged();
        }

        set allExpandedNodes(nodes: ITreeNode[]){
            this.expandAll(nodes);
            this._viewableNodes = this._calculateViewableNodes(this._nodes, []);
            this.notifyViewNodesChanged();
        }

        expandAll(nodes: ITreeNode[]){
            nodes.forEach(node =>{
                if(!this._isOpenFn(node)) this._toggleNodeFn(node);
                const children = this._childrenFn(node);
                if(children) this.expandAll(children);
            })
        }

        _levelSetterFn: (nodes:ITreeNode[], level:number) => void
        set levelSetterFn(setter){
            this._levelSetterFn = setter;
        }
        get levelSetterFn(){
            return this._levelSetterFn;
        }
    }

    customElements.define('xtal-tree', XtalTree)
})();