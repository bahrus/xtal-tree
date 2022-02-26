import { XE } from 'xtal-element/src/XE.js';
export class XtalTree extends HTMLElement {
    #idToNodeLookup = {};
    calculateViewableNodes({ isOpenFn, testNodeFn, childrenFn, idFn, searchString }, nodes, acc) {
        if (!nodes)
            return acc;
        nodes.forEach(node => {
            if (searchString) {
                if (!isOpenFn(node) && !testNodeFn(node, this.searchString))
                    return;
            }
            this.#idToNodeLookup[idFn(node)] = node;
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
    defineChildrenFn({ childrenPath }) {
        return {
            childrenFn: (tn) => tn[childrenPath]
        };
    }
    defineTestNodeFn({ testNodePath }) {
        return {
            testNodeFn: (tn, searchString) => tn[testNodePath].toLowerCase().includes(searchString.toLowerCase())
        };
    }
    defineIdFn({ idPath }) {
        return {
            idFn: (tn) => tn[idPath],
        };
    }
    updateViewableNodes({ nodes }) {
        return {
            viewableNodes: this.calculateViewableNodes(this, nodes, [])
        };
    }
    toggleNode({ toggledNode, childrenFn, toggleNodeFn }) {
        if (!childrenFn(toggledNode))
            return;
        toggleNodeFn(toggledNode);
        return this.updateViewableNodes(this);
    }
    openNode({ openedNode, isOpenFn }) {
        if (!isOpenFn(openedNode)) {
            this.toggledNode = openedNode;
        }
    }
    closeNode({ closedNode, isOpenFn }) {
        if (isOpenFn(closedNode)) {
            return {
                toggledNode: closedNode
            };
        }
    }
    onToggledNodeId({ toggledNodeId }) {
        const toggledNode = this.#idToNodeLookup[toggledNodeId];
        return { toggledNode };
    }
    defineToggledNodeFn({ toggleNodePath }) {
        return {
            toggleNodeFn: (tn) => tn[toggleNodePath] = !tn[toggleNodePath]
        };
    }
}
const dispatch = {
    notify: {
        dispatch: true
    }
};
const xe = new XE({
    config: {
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
            toggledNode: dispatch,
            viewableNodes: dispatch,
        },
        actions: {
            defineIsOpenFn: 'isOpenPath',
            defineIdFn: 'idPath',
            defineChildrenFn: 'childrenPath',
            defineToggledNodeFn: 'toggleNodePath',
            toggleNode: {
                ifAllOf: ['toggledNode', 'childrenFn', 'toggleNodeFn', 'idFn']
            },
            updateViewableNodes: {
                ifAllOf: ['nodes', 'idFn']
            },
            onToggledNodeId: 'toggledNodeId',
        },
        style: {
            display: 'none',
        }
    },
    superclass: XtalTree,
});
