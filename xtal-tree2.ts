import {XtalTreeProps, XtalTreeActions, ITreeNode} from './types';
import {XE} from 'xtal-element/src/XE.js';

export class XtalTree extends HTMLElement implements XtalTreeActions{
    #idToNodeLookup: {[id: string | number]: ITreeNode} = {};
    calculateViewableNodes({isOpenFn, testNodeFn, childrenFn, idFn, searchString}: this, nodesCopy: ITreeNode[], acc: ITreeNode[]) {
        if (!nodesCopy) return acc;
        nodesCopy.forEach(node => {
            if (searchString) {
                if (!isOpenFn(node) && !testNodeFn(node, this.searchString)) return;
            }
            this.#idToNodeLookup[idFn(node)] = node;
            acc.push(node);
            if (isOpenFn(node)) this.calculateViewableNodes(this, childrenFn(node), acc);
        });
        return acc;
    }

    defineIsOpenFn({isOpenPath}: this) {
        return {
            isOpenFn: (tn: ITreeNode) => (<any>tn)[isOpenPath]
        }
    }
    defineChildrenFn({childrenPath}: this){
        return {
            childrenFn: (tn: ITreeNode) => (<any>tn)[childrenPath]
        }
    }
    setHasChildren({childrenFn, hasChildrenPath}: this, tn: ITreeNode, recursive: boolean){
        const children = childrenFn(tn);
        const hasChildren = children !== undefined && children.length > 0;
        (<any>tn)[hasChildrenPath] = hasChildren;
        if(recursive){
            for(const child of children){
                this.setHasChildren(this, child, true);
            }
        }
    }
    defineTestNodeFn({testNodePath}: this) {
        return {
            testNodeFn: (tn: ITreeNode, searchString: string) => (<any>tn)[testNodePath].toLowerCase().includes(searchString.toLowerCase())
        }
    }
    defineIdFn({idPath}: this) {
        return {
            idFn: (tn: ITreeNode) => (<any>tn)[idPath],
        }
    }
    updateViewableNodes({nodesCopy}: this){
        return {
            viewableNodes: this.calculateViewableNodes(this, nodesCopy, [])
        };
    }
    toggleNode({toggledNode, childrenFn, toggleNodeFn}: this){
        if(!childrenFn(toggledNode)) return;
        toggleNodeFn(toggledNode);
        return this.updateViewableNodes(this);
    }
    openNode({openedNode, isOpenFn}: this){
        if(!isOpenFn(openedNode)){
            this.toggledNode = openedNode;
        }
    }
    closeNode({closedNode, isOpenFn}: this){
        if(isOpenFn(closedNode)){
            return {
                toggledNode: closedNode
            }
        }
    }
    onToggledNodeId({toggledNodeId}: this){
        const toggledNode = this.#idToNodeLookup[toggledNodeId];
        return {toggledNode};
    }
    defineToggledNodeFn({toggleNodePath}: this){
        return {
            toggleNodeFn: (tn: ITreeNode) => (<any>tn)[toggleNodePath] = !(<any>tn)[toggleNodePath]
        }
    }
    setLevels({nodesCopy, levelPath, marginStylePath, childrenFn}: this, passedInNodes?: ITreeNode[], level?: number): void {
        if(passedInNodes === undefined) passedInNodes = nodesCopy;
        if(level === undefined) level = 0;
        for(const node of passedInNodes){
            this.setHasChildren(this, node, false);
            (<any>node)[levelPath] = level;
            (<any>node)[marginStylePath] = "margin-left:" + level * 18 + "px";
            const children = childrenFn(node);
            if(children === undefined) continue;
            this.setLevels(this, children, level + 1);
        }
    }

    search({nodesCopy, testNodeFn, searchString, isOpenFn, toggleNodeFn, childrenFn}: this, passedInNodes?: ITreeNode[], passedInParent?: ITreeNode){
        const nodes = passedInNodes || nodesCopy;
        nodes.forEach(node => {
             
            if(testNodeFn(node, searchString)){
                if(!isOpenFn(node)){
                    toggleNodeFn(node);
                }
            }else{
                const children = childrenFn(node);
                if(children !== undefined){
                    this.search(this, children, node);
                    if(passedInParent && isOpenFn(node) && !isOpenFn(passedInParent)){
                        toggleNodeFn(passedInParent)
                    }
                }
            }
            
        });
        if(passedInNodes === undefined) return this.updateViewableNodes(this);
    }

    onCollapseAll({nodesCopy, isOpenFn, toggleNodeFn, childrenFn}: this, passedInNodes?: ITreeNode[]){
        const nodes = passedInNodes || nodesCopy;
        nodes.forEach(node => {
            if(isOpenFn(node)) toggleNodeFn(node);
            const children = childrenFn(node);
            if(children !== undefined) this.onCollapseAll(this, children);
        });
        if(passedInNodes === undefined) return this.updateViewableNodes(this);
    }
}

export interface XtalTree extends XtalTreeProps{}

const dispatch = {
    notify:{
        dispatch: true
    }
};

const xe = new XE<XtalTreeProps, XtalTreeActions>({
    config:{
        tagName: 'xtal-tree',
        propDefaults: {
            childrenPath: 'children',
            isOpenPath: 'open',
            testNodePath: 'name',
            idPath: 'id',
            toggleNodePath: 'open',
            marginStylePath: 'marginStyle',
            levelPath: 'level',
            hasChildrenPath: 'hasChildren',
            collapseAll: false,
        },
        propInfo: {
            toggledNode:{
                notify:{
                    dispatch: true
                },
                dry: false,
            },
            toggledNodeId:{
                dry: false,
            },
            viewableNodes:dispatch,
            nodes:{
                notify:{
                    cloneTo: 'nodesCopy',
                }
            },
            collapseAll:{
                dry: false,
            }
        },
        actions: {
            defineIsOpenFn: 'isOpenPath',
            defineIdFn: 'idPath',
            defineChildrenFn: 'childrenPath',
            defineTestNodeFn: 'testNodePath',
            defineToggledNodeFn: 'toggleNodePath',
            toggleNode: {
                ifAllOf: ['toggledNode', 'childrenFn', 'toggleNodeFn', 'idFn']
            },
            updateViewableNodes:{
                ifAllOf: ['nodesCopy', 'idFn']
            },
            onToggledNodeId: 'toggledNodeId',
            setLevels:{
                ifAllOf:['nodesCopy', 'levelPath', 'marginStylePath', 'childrenFn']
            },
            onCollapseAll: 'collapseAll',
            search:'searchString'
        },
        style:{
            display: 'none',
        }
    },
    superclass: XtalTree,
});