import { XE } from 'xtal-element/src/XE.js';
export class XtalTree extends HTMLElement {
    #idToNodeLookup = {};
    onNodes({ nodes, cloneNodes }) {
        const nodesCopy = cloneNodes ? structuredClone(nodes) : nodes;
        return {
            nodesCopy,
        };
    }
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
    defineCompareFn({ comparePath, sort }) {
        let multiplier = 1;
        switch (sort) {
            case 'none':
            case undefined:
                return {
                    compareFn: undefined,
                };
            case 'desc':
                multiplier = -1;
                break;
        }
        return {
            compareFn: (lhs, rhs) => {
                const lhsVal = lhs[comparePath];
                const rhsVal = rhs[comparePath];
                if (lhsVal === undefined && rhsVal === undefined)
                    return 0;
                if (lhsVal === undefined)
                    return -1 * multiplier;
                if (rhsVal === undefined)
                    return 1 * multiplier;
                return (lhsVal > rhsVal ? 1 : lhsVal < rhsVal ? -1 : 0) * multiplier;
            }
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
        //if(passedInNodes === undefined) this.onCollapseAll(this);
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
    onExpandAll({ nodesCopy, isOpenFn, toggleNodeFn, childrenFn }, passedInNodes) {
        const nodes = passedInNodes || nodesCopy;
        nodes.forEach(node => {
            if (!isOpenFn(node))
                toggleNodeFn(node);
            const children = childrenFn(node);
            if (children !== undefined)
                this.onExpandAll(this, children);
        });
        if (passedInNodes === undefined)
            return this.updateViewableNodes(this);
    }
    onSort({ nodesCopy, compareFn, childrenFn }, passedInNodes) {
        const nodes = passedInNodes || nodesCopy;
        nodes.sort(compareFn);
        nodes.forEach(node => {
            const children = childrenFn(node);
            if (children !== undefined)
                this.onSort(this, children);
        });
        if (passedInNodes === undefined)
            return this.updateViewableNodes(this);
    }
    async onObjectGraph({ objectGraph }) {
        const { og2tree } = await import('./og2tree.mjs');
        return {
            nodes: og2tree(objectGraph),
        };
    }
    async onEditedNode({ editedNode, nodes, objectGraph }) {
        //console.log(editedNode);
        const { updateTreeNodeFromPath: updatePath } = await import('./updateTreeNodeFromPath.mjs');
        const { name, value } = editedNode;
        updatePath(nodes, name, value);
        if (objectGraph !== undefined) {
            const { updateOGFromPath } = await import('./updateOGFromPath.mjs');
            updateOGFromPath(objectGraph, name, value);
        }
        this.updateCount++;
    }
    synchNodesCopyOrObjectGraph({ nodes, cloneNodes, objectGraph }) {
        // if(objectGraph === undefined) {
        const nodesCopy = [...nodes];
        return {
            nodesCopy,
        };
        // }
        // const objectGraphCopy = Array.isArray(objectGraph) ? [...objectGraph] : {...objectGraph};
        // return {
        //     objectGraph: objectGraphCopy,
        // };
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
            expandAll: false,
            sort: 'none',
            comparePath: 'name',
            updateCount: 0,
            updateCountEcho: 0,
            cloneNodes: false,
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
            collapseAll: {
                dry: false,
            },
            expandAll: {
                dry: false,
            },
            updateCount: {
                notify: {
                    echoDelay: 200,
                    echoTo: 'updateCountEcho',
                }
            }
        },
        actions: {
            defineIsOpenFn: 'isOpenPath',
            defineIdFn: 'idPath',
            defineChildrenFn: 'childrenPath',
            defineTestNodeFn: 'testNodePath',
            defineToggledNodeFn: 'toggleNodePath',
            defineCompareFn: {
                ifAllOf: ['sort', 'comparePath']
            },
            onSort: 'compareFn',
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
            onExpandAll: 'expandAll',
            search: 'searchString',
            onNodes: 'nodes',
            onObjectGraph: 'objectGraph',
            onEditedNode: 'editedNode',
            synchNodesCopyOrObjectGraph: {
                ifEquals: ['updateCount', 'updateCountEcho'],
                ifAllOf: ['updateCount', 'updateCountEcho']
            }
        },
    },
    superclass: XtalTree,
});
