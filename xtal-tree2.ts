import {XtalTreeProps, XtalTreeActions, ITreeNode} from './types';
import {XE} from 'xtal-element/src/XE.js';

export class XtalTree extends HTMLElement implements XtalTreeActions{

    calculateViewableNodes({isOpenFn, testNodeFn, childrenFn}: this, nodes: ITreeNode[], acc: ITreeNode[]) {
        if (!nodes) return acc;
        nodes.forEach(node => {
            if (this.searchString) {
                if (!isOpenFn(node) && !testNodeFn(node, this.searchString)) return;
            }
            acc.push(node);
            if (isOpenFn(node)) this.calculateViewableNodes(this, childrenFn(node), acc);
        })
        return acc;
    }

    defineIsOpenFn({isOpenPath}: this) {
        return {
            isOpenFn: (tn: ITreeNode) => (<any>tn)[isOpenPath]
        }
    }

    defineTestNodeFn({testNodePath}: this) {
        return {
            testNodeFn: (tn: ITreeNode, searchString: string) => (<any>tn)[testNodePath].toLowerCase().includes(searchString.toLowerCase())
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
        this.updateViewableNodes(this);
    }
    openNode({openedNode, isOpenFn}: this){
        if(!isOpenFn(openedNode)){
            this.toggledNode = openedNode;
        }
    }
    closeNode({closedNode, isOpenFn}: this){
        if(isOpenFn(closedNode)){
            this.toggledNode = closedNode;
        }
    }
}

export interface XtalTree extends XtalTreeProps{}

const xe = new XE<XtalTreeProps, XtalTreeActions>({
    config:{
        tagName: 'xtal-tree',
        propDefaults: {
            childrenPath: 'children',
            isOpenPath: 'open',
            testNodePath: 'name',

        },
        propInfo: {
            toggledNode:{
                notify:{
                    dispatch: true,
                }
            }
        },
        actions: {
            defineIsOpenFn: 'isOpenPath',
            toggleNode: {
                ifAllOf: ['toggledNode', 'childrenFn', 'toggleNodeFn']
            },
            updateViewableNodes:{
                ifAllOf: ['nodes']
            }
        },
        style:{
            display: 'none',
        }
    },
    superclass: XtalTree,
});