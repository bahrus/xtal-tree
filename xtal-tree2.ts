import {XtalTreeProps, XtalTreeActions, ITreeNode} from './types';
import {XE} from 'xtal-element/src/XE.js';

export class XtalTree extends HTMLElement implements XtalTreeActions{

    calculateViewableNodes({isOpenFn, testNodeFn, childrenFn}, nodes: ITreeNode[], acc: ITreeNode[]) {
        if (!nodes) return;
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
            isOpenFn: (tn: ITreeNode) => tn[isOpenPath]
        }
    }

    defineTestNodeFn({testNodePath}: this) {
        return {
            testNodeFn: (tn: ITreeNode, searchString: string) => tn[testNodePath].toLowerCase().includes(searchString.toLowerCase())
        }
    }
    updateViewableNodes({}: this): void {
        throw 'Not implemented';
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
        },
        style:{
            display: 'none',
        }
    },
    superclass: XtalTree,
});