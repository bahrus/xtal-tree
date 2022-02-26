import {XtalTreeProps, XtalTreeActions, ITreeNode} from './types';
import {XE} from 'xtal-element/src/XE.js';

export class XtalTree extends HTMLElement implements XtalTreeActions{
    #idToNodeLookup: {[id: string | number]: ITreeNode} = {};
    calculateViewableNodes({isOpenFn, testNodeFn, childrenFn, idFn, searchString}: this, nodes: ITreeNode[], acc: ITreeNode[]) {
        if (!nodes) return acc;
        nodes.forEach(node => {
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
    updateViewableNodes({nodes}: this){
        return {
            viewableNodes: this.calculateViewableNodes(this, nodes, [])
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
            //toggledNodeId: '',
        },
        propInfo: {
            toggledNode:dispatch,
            viewableNodes:dispatch,
        },
        actions: {
            defineIsOpenFn: 'isOpenPath',
            defineIdFn: 'idPath',
            defineChildrenFn: 'childrenPath',
            defineToggledNodeFn: 'toggleNodePath',
            toggleNode: {
                ifAllOf: ['toggledNode', 'childrenFn', 'toggleNodeFn', 'idFn']
            },
            updateViewableNodes:{
                ifAllOf: ['nodes', 'idFn']
            },
            onToggledNodeId: 'toggledNodeId',
        },
        style:{
            display: 'none',
        }
    },
    superclass: XtalTree,
});