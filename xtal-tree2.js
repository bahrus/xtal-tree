import { XE } from 'xtal-element/src/XE.js';
export class XtalTree extends HTMLElement {
    calculateViewableNodes({ isOpenFn, testNodeFn, childrenFn }, nodes, acc) {
        if (!nodes)
            return;
        nodes.forEach(node => {
            if (this.searchString) {
                if (!isOpenFn(node) && !testNodeFn(node, this.searchString))
                    return;
            }
            acc.push(node);
            if (isOpenFn(node))
                this.calculateViewableNodes(this, childrenFn(node), acc);
        });
        return acc;
    }
    defineIsOpenFn({ isOpenPath }) {
        return {
            isOpenFn: (tn) => tn[isOpenPath]
        };
    }
    defineTestNodeFn({ testNodePath }) {
        return {
            testNodeFn: (tn, searchString) => tn[testNodePath].toLowerCase().includes(searchString.toLowerCase())
        };
    }
    updateViewableNodes({}) {
        throw 'Not implemented';
    }
    toggleNode({ toggledNode, childrenFn, toggleNodeFn }) {
        if (!childrenFn(toggledNode))
            return;
        toggleNodeFn(toggledNode);
        this.updateViewableNodes(this);
    }
    openNode({ openedNode, isOpenFn }) {
        if (!isOpenFn(openedNode)) {
            this.toggledNode = openedNode;
        }
    }
    closeNode({ closedNode, isOpenFn }) {
        if (isOpenFn(closedNode)) {
            this.toggledNode = closedNode;
        }
    }
}
const xe = new XE({
    config: {
        tagName: 'xtal-tree',
        propDefaults: {
            childrenPath: 'children',
            isOpenPath: 'open',
            testNodePath: 'name',
        },
        propInfo: {
            toggledNode: {
                notify: {
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
        style: {
            display: 'none',
        }
    },
    superclass: XtalTree,
});
