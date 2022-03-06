import { XE } from 'xtal-element/src/XE.js';
export class XtalTree extends HTMLElement {
    #idToNodeLookup = {};
    calculateViewableNodes({ isOpenFn, testNodeFn, childrenFn, idFn, searchString }, nodesCopy, acc) {
        if (!nodesCopy)
            return acc;
        nodesCopy.forEach(node => {
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
    setHasChildren({ childrenFn, hasChildrenPath }, tn, recursive) {
        const children = childrenFn(tn);
        const hasChildren = children !== undefined && children.length > 0;
        tn[hasChildrenPath] = hasChildren;
        if (recursive) {
            for (const child of children) {
                this.setHasChildren(this, child, true);
            }
        }
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
    updateViewableNodes({ nodesCopy }) {
        return {
            viewableNodes: this.calculateViewableNodes(this, nodesCopy, [])
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
    setLevels({ nodesCopy, levelPath, marginStylePath, childrenFn }, passedInNodes, level) {
        if (passedInNodes === undefined)
            passedInNodes = nodesCopy;
        if (level === undefined)
            level = 0;
        for (const node of passedInNodes) {
            this.setHasChildren(this, node, false);
            node[levelPath] = level;
            node[marginStylePath] = "margin-left:" + level * 18 + "px";
            const children = childrenFn(node);
            if (children === undefined)
                continue;
            this.setLevels(this, children, level + 1);
        }
    }
    search({ nodesCopy, testNodeFn, searchString, isOpenFn, toggleNodeFn, childrenFn }, passedInNodes, passedInParent) {
        const nodes = passedInNodes || nodesCopy;
        nodes.forEach(node => {
            if (testNodeFn(node, searchString)) {
                if (!isOpenFn(node)) {
                    toggleNodeFn(node);
                }
            }
            else {
                const children = childrenFn(node);
                if (children !== undefined) {
                    this.search(this, children, node);
                    if (passedInParent && isOpenFn(node) && !isOpenFn(passedInParent)) {
                        toggleNodeFn(passedInParent);
                    }
                }
            }
        });
        if (passedInNodes === undefined)
            return this.updateViewableNodes(this);
    }
    onCollapseAll({ nodesCopy, isOpenFn, toggleNodeFn, childrenFn }, passedInNodes) {
        const nodes = passedInNodes || nodesCopy;
        nodes.forEach(node => {
            if (isOpenFn(node))
                toggleNodeFn(node);
            const children = childrenFn(node);
            if (children !== undefined)
                this.onCollapseAll(this, children);
        });
        if (passedInNodes === undefined)
            return this.updateViewableNodes(this);
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
            marginStylePath: 'marginStyle',
            levelPath: 'level',
            hasChildrenPath: 'hasChildren',
            collapseAll: false,
        },
        propInfo: {
            toggledNode: {
                notify: {
                    dispatch: true
                },
                dry: false,
            },
            toggledNodeId: {
                dry: false,
            },
            viewableNodes: dispatch,
            nodes: {
                notify: {
                    cloneTo: 'nodesCopy',
                }
            },
            collapseAll: {
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
            updateViewableNodes: {
                ifAllOf: ['nodesCopy', 'idFn']
            },
            onToggledNodeId: 'toggledNodeId',
            setLevels: {
                ifAllOf: ['nodesCopy', 'levelPath', 'marginStylePath', 'childrenFn']
            },
            onCollapseAll: 'collapseAll',
        },
        style: {
            display: 'none',
        }
    },
    superclass: XtalTree,
});
