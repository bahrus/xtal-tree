import {ITreeNode, ITree} from './xtal-tree.js'
export interface IXtalCascadeProperties extends ITree{
    //childrenFn: (tn: ITreeNode) => ITreeNode[];
    keyFn: (tn: ITreeNode) => string;
    isSelectedFn: (tn: ITreeNode) => boolean;
    selectedNodeFn: (tn: ITreeNode) => void;
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

        _selectedNodeFn: (tn: ITreeNode) => boolean;
        get selectedNodeFn(){
            return this._selectedNodeFn;
        }
        set selectedNodeFn(nodeFn){
            this._selectedNodeFn = nodeFn;
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
            this.createChildToParentLookup();
        }

        _childToParentLookup: {[key: string]: ITreeNode};
        createChildToParentLookup(){
            this._childToParentLookup = {};
        }

    }
    customElements.define('xtal-cascade', XtalCascade)
})();