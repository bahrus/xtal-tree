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
        actions: {
            defineIsOpenFn: 'isOpenPath',
        },
        style:{
            display: 'none',
        }
    }
});