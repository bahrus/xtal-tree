import {ITreeNode, ITree} from './xtal-tree.js'
export interface IXtalCascadeProperties extends ITree{
    //childrenFn: (tn: ITreeNode) => ITreeNode[];
    keyFn: (tn: ITreeNode) => string;
    isSelectedFn: (tn: ITreeNode) => boolean;
    isIndeterminateFn: (tn: ITreeNode) => boolean;
    toggleNodeSelectionFn: (tn: ITreeNode) => void;

}

(function () {
    /**
     * `xtal-cascade`
     *  Cascade node selection up and down a tree collection 
     *
     * @customElement
     * @polymer
     * @demo demo/index.html
     */
    class XtalCascade extends HTMLElement implements IXtalCascadeProperties{
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

        _isSelectedFn:  (tn: ITreeNode) => boolean;
        get isSelectedFn(){
            return this._isSelectedFn;
        }
        set isSelectedFn(nodeFn){
            this._isSelectedFn = nodeFn;
        }

        _toggleNodeSelectionFn: (tn: ITreeNode) => boolean;
        get toggleNodeSelectionFn(){
            return this._toggleNodeSelectionFn;
        }
        set toggleNodeSelectionFn(nodeFn){
            this._toggleNodeSelectionFn = nodeFn;
        }

        set toggledNodeSelection(tn: ITreeNode){
            this._toggleNodeSelectionFn(tn);

        }

        selectNodeShallow(tn: ITreeNode){
            if(!this._isSelectedFn(tn)) this._toggleNodeSelectionFn(tn);
        }

        unselectNodeShallow(tn: ITreeNode){
            if(this._isSelectedFn(tn)) this._toggleNodeSelectionFn(tn);
        }

        selectNodeAndCascade(tn: ITreeNode){
            this.selectNodeRecursive(tn);
            
        }

        selectNodeRecursive(tn: ITreeNode){
            this.selectNodeShallow(tn);
            const children = this._childrenFn(tn);
            if(children) {
                this._selectedChildScore[this._keyFn(tn)] = children.length;
                children.forEach(child => this.selectNodeRecursive(child));
            }
        }

        _nodes: ITreeNode[];
        get nodes(){
            return this._nodes;
        }

        set nodes(nodes){
            this._nodes = nodes;
            this.onPropsChange();
        }

        onPropsChange(){
            if(!this._keyFn || !this._childrenFn || !this._nodes) return;
            this.startCreatingChildToParentLookup();
        }
        _selectedChildScore : {[key: string] : number};
        _childToParentLookup: {[key: string]: ITreeNode};
        startCreatingChildToParentLookup(){
            this._childToParentLookup = {};
            this.createChildToParentLookup(this._nodes, this._childToParentLookup);
        }

        createChildToParentLookup(nodes: ITreeNode[], lookup: {[key: string]: ITreeNode}){
            nodes.forEach(node =>{
                const nodeKey = this._keyFn(node);
                const scs = this._selectedChildScore;
                scs[nodeKey] = 0;
                const children = this._childrenFn(node);
                if(children){
                    children.forEach(child =>{
                        if(this._isSelectedFn(child)) scs[nodeKey]++;
                        const childId = this._keyFn(child);
                        lookup[childId] = node;
                    });
                    this.createChildToParentLookup(children, lookup);
                }
            })
            
        }

    }
    customElements.define('xtal-cascade', XtalCascade)
})();