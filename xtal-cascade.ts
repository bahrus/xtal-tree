import {ITreeNode, ITree} from './xtal-tree.js'
export interface IXtalCascadeProperties extends ITree{
    //childrenFn: (tn: ITreeNode) => ITreeNode[];
    keyFn: (tn: ITreeNode) => string;
    isSelectedFn: (tn: ITreeNode) => boolean;
    isIndeterminateFn: (tn: ITreeNode) => boolean;
    //isIndeterminateFn: (tn: ITreeNode) => boolean;
    toggleNodeSelectionFn: (tn: ITreeNode) => void;
    toggleIndeterminateFn: (tn: ITreeNode) => void;

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

        _isIndeterminateFn: (tn:ITreeNode) => boolean;
        get isIndeterminateFn(){
            return this._isIndeterminateFn;
        }
        set isIndeterminateFn(nodeFn){
            this._isIndeterminateFn = nodeFn;
        }

        _toggleNodeSelectionFn: (tn: ITreeNode) => boolean;
        get toggleNodeSelectionFn(){
            return this._toggleNodeSelectionFn;
        }
        set toggleNodeSelectionFn(nodeFn){
            this._toggleNodeSelectionFn = nodeFn;
        }

        _toggleInterminateFn : (tn: ITreeNode) => void;
        get toggleIndeterminateFn(){
            return this._toggleInterminateFn;
        }
        set toggleIndeterminateFn(nodeFn){
            this._toggleInterminateFn = nodeFn;
        }

        set toggledNodeSelection(tn: ITreeNode){
            if(!this._isSelectedFn(tn)){
                this.selectNodeAndCascade(tn);
            }else{
                this.unselectNodeAndCascade(tn);
            }
            //this._toggleNodeSelectionFn(tn);

        }

        selectNodeShallow(tn: ITreeNode){
            if(!this._isSelectedFn(tn)) this._toggleNodeSelectionFn(tn);
            if(this._isIndeterminateFn(tn)) this._toggleInterminateFn(tn);
        }

        unselectNodeShallow(tn: ITreeNode){
            if(this._isSelectedFn(tn)) this._toggleNodeSelectionFn(tn);
            if(this._isIndeterminateFn(tn)) this._toggleInterminateFn(tn);
        }

        selectNodeAndCascade(tn: ITreeNode){
            this.selectNodeRecursive(tn);
            let currentNode = tn;
            do{
                //debugger;
                const thisID = this._keyFn(currentNode);
                const parentNd = this._childToParentLookup[thisID];
                if(parentNd) {
                    const parentId = this._keyFn(parentNd);
                    this._selectedChildScore[parentId]++;
                    const children = this._childrenFn(parentNd);
                    if(this._selectedChildScore[parentId] === children.length){
                        this.selectNodeShallow(parentNd);
                    }else{
                        this._toggleInterminateFn(parentNd);
                    }
                }
                currentNode = parentNd;
            }while(currentNode);
        }

        unselectNodeAndCascade(tn: ITreeNode){
            //debugger;
            this.unselectNodeRecursive(tn);
            let currentNode = tn;
            do{
                const thisID = this._keyFn(currentNode);
                const parentNd = this._childToParentLookup[thisID];
                if(parentNd) {
                    const parentId = this._keyFn(parentNd);
                    this._selectedChildScore[parentId]--;
                    //const children = this._childrenFn(parentNd);
                    if(this._selectedChildScore[parentId] === 0){
                        this.unselectNodeShallow(parentNd);
                    }else{
                        this._toggleInterminateFn(parentNd);
                    }
                }
                currentNode = parentNd;
            }while(currentNode);
        }

        set newSelectedNodeToggle(tn: ITreeNode){
            if(this._isSelectedFn(tn)){
                this.unselectNodeAndCascade(tn);
            }else{
                this.selectNodeAndCascade(tn);
            }
            
        }

        selectNodeRecursive(tn: ITreeNode){
            this.selectNodeShallow(tn);
            const children = this._childrenFn(tn);
            if(children) {
                this._selectedChildScore[this._keyFn(tn)] = children.length;
                children.forEach(child => this.selectNodeRecursive(child));
            }
        }

        unselectNodeRecursive(tn: ITreeNode){
            this.unselectNodeShallow(tn);
            const children = this._childrenFn(tn);
            if(children){
                this._selectedChildScore[this._keyFn(tn)] = 0;
                children.forEach(child => this.unselectNodeRecursive(child));
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
            if(!this._keyFn || !this._childrenFn || !this._nodes || 
                !this._isSelectedFn || !this._toggleNodeSelectionFn || !this._toggleInterminateFn) return;
            this.startCreatingChildToParentLookup();
        }
        _selectedChildScore : {[key: string] : number};
        _childToParentLookup: {[key: string]: ITreeNode};
        startCreatingChildToParentLookup(){
            this._childToParentLookup = {};
            this._selectedChildScore = {};
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
                    if(scs[nodeKey] === children.length){
                        this.selectNodeShallow(node);
                    }else if(scs[nodeKey] > 0){
                        this._toggleInterminateFn(node);
                    }
                    this.createChildToParentLookup(children, lookup);
                }
            })
            
        }

    }
    customElements.define('xtal-cascade', XtalCascade)
})();