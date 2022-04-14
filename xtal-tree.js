import { XE } from 'xtal-element/src/XE.js';
export class XtalTree extends HTMLElement {
    #idToNodeLookup = {};
    #openNode = {};
    onNodes({ nodes, cloneNodes }) {
        const nodesCopy = cloneNodes ? structuredClone(nodes) : nodes;
        return {
            nodesCopy,
        };
    }
    calculateViewableNodes({ isOpenFn, testNodeFn, idFn, searchString, parentPath, isOpenPath }, nodesCopy, acc) {
        if (!nodesCopy)
            return acc;
        nodesCopy.forEach(node => {
            //TODO:  less hardcoding
            if (this.#openNode[node.path]) {
                node.open = true;
            }
            if (searchString) {
                if (!isOpenFn(node) && !testNodeFn(node, this.searchString))
                    return;
            }
            this.#idToNodeLookup[idFn(node)] = node;
            acc.push(node);
            if (isOpenFn(node)) {
                const children = node.children;
                if (children) {
                    for (const child of children) {
                        child[parentPath] = node;
                    }
                    this.calculateViewableNodes(this, children, acc);
                }
            }
        });
        return acc;
    }
    defineIsOpenFn({ isOpenPath }) {
        return {
            isOpenFn: (tn) => {
                const stn = tn;
                if (stn.path && this.#openNode[stn.path])
                    return true;
                //TODO:  resolve redundancy
                return tn[isOpenPath];
            }
        };
    }
    // defineChildrenFn({childrenPath}: this){
    //     return {
    //         childrenFn: (tn: ITreeNode) => (<any>tn)[childrenPath]
    //     }
    // }
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
    setHasChildren({}, tn, recursive) {
        const { children } = tn;
        const hasChildren = children !== undefined && children.length > 0;
        tn.hasChildren = hasChildren;
        if (recursive && hasChildren) {
            for (const child of children) {
                this.setHasChildren(this, child, true);
            }
        }
    }
    defineTestNodeFn({ testNodePaths }) {
        return {
            testNodeFn: (tn, searchString) => {
                for (const path of testNodePaths) {
                    const val = tn[path];
                    if (typeof val != 'string')
                        continue;
                    if (val.toLowerCase().includes(searchString.toLowerCase()))
                        return true;
                }
                return false;
            }
        };
    }
    defineParentFn({ parentPath }) {
        return {
            parentFn: (tn) => tn[parentPath]
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
    toggleNode({ toggledNode, toggleNodeFn, isOpenFn }) {
        if (!toggledNode.children)
            return;
        toggleNodeFn(toggledNode);
        const path = toggledNode.path;
        this.#openNode[path] = !this.#openNode[path];
        return this.updateViewableNodes(this);
    }
    openNode({ openedNode, isOpenFn }) {
        if (!isOpenFn(openedNode)) {
            this.toggledNode = openedNode;
            this.#openNode[openedNode.path] = true;
        }
        else {
            this.#openNode[openedNode.path] = false;
        }
    }
    closeNode({ closedNode, isOpenFn }) {
        if (isOpenFn(closedNode)) {
            return {
                toggledNode: closedNode
            };
        }
    }
    onToggledNodePath({ toggledNodePath }) {
        const toggledNode = this.#idToNodeLookup[toggledNodePath];
        return { toggledNode };
    }
    defineToggledNodeFn({ toggleNodePath }) {
        return {
            toggleNodeFn: (tn) => tn[toggleNodePath] = !tn[toggleNodePath]
        };
    }
    setLevels({ nodesCopy, levelPath, marginStylePath, indentFactor }, passedInNodes, level) {
        if (passedInNodes === undefined)
            passedInNodes = nodesCopy;
        if (level === undefined)
            level = 0;
        for (const node of passedInNodes) {
            this.setHasChildren(this, node, false);
            node[levelPath] = level;
            node[marginStylePath] = "margin-left:" + level * indentFactor + "px";
            const children = node.children;
            if (children === undefined)
                continue;
            this.setLevels(this, children, level + 1);
        }
    }
    search({ nodesCopy, testNodeFn, searchString, isOpenFn, toggleNodeFn }, passedInNodes, passedInParent) {
        if (passedInNodes === undefined)
            this.onCollapseAll(this);
        let foundMatch = false;
        const nodes = passedInNodes || nodesCopy;
        for (const node of nodes) {
            if (testNodeFn(node, searchString)) {
                foundMatch = true;
                if (!isOpenFn(node)) {
                    toggleNodeFn(node);
                }
            }
            else {
                const children = node.children;
                if (children !== undefined) {
                    const foundChildMatch = this.search(this, children, node);
                    if (foundChildMatch)
                        foundMatch = true;
                    if (passedInParent && isOpenFn(node) && !isOpenFn(passedInParent)) {
                        toggleNodeFn(passedInParent);
                    }
                }
            }
        }
        ;
        if (foundMatch && passedInParent && !isOpenFn(passedInParent)) {
            toggleNodeFn(passedInParent);
        }
        if (passedInNodes === undefined) {
            this.viewableNodes = this.updateViewableNodes(this).viewableNodes;
        }
        return foundMatch;
    }
    onCollapseAll({ nodesCopy, isOpenFn, toggleNodeFn }, passedInNodes) {
        const nodes = passedInNodes || nodesCopy;
        nodes.forEach(node => {
            if (isOpenFn(node))
                toggleNodeFn(node);
            this.#openNode[node.path] = false;
            const children = node.children;
            if (children !== undefined)
                this.onCollapseAll(this, children);
        });
        if (passedInNodes === undefined)
            return this.updateViewableNodes(this);
    }
    onExpandAll({ nodesCopy, isOpenFn, toggleNodeFn }, passedInNodes) {
        const nodes = passedInNodes || nodesCopy;
        nodes.forEach(node => {
            if (!isOpenFn(node))
                toggleNodeFn(node);
            this.#openNode[node.path] = true;
            const children = node.children;
            if (children !== undefined)
                this.onExpandAll(this, children);
        });
        if (passedInNodes === undefined)
            return this.updateViewableNodes(this);
    }
    onSort({ nodesCopy, compareFn }, passedInNodes) {
        const nodes = passedInNodes || nodesCopy;
        nodes.sort(compareFn);
        nodes.forEach(node => {
            const children = node.children;
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
        if (objectGraph === undefined)
            return;
        const { name, value } = editedNode;
        const { updateOGFromPath } = await import('./updateOGFromPath.mjs');
        updateOGFromPath(objectGraph, name, value);
        this.updateCount++;
    }
    synchNodesCopyOrObjectGraph({ nodes, cloneNodes, objectGraph }) {
        if (objectGraph === undefined)
            return;
        const objectGraphCopy = Array.isArray(objectGraph) ? [...objectGraph] : { ...objectGraph };
        return {
            objectGraph: objectGraphCopy,
        };
    }
    #addedName = '';
    async onNewNode({ newNode, objectGraph, isOpenPath }) {
        const { addPropToOG } = await import('./addPropToOG.mjs');
        this.#addedName = newNode.name;
        addPropToOG(objectGraph, this.#addedName, newNode.value, this, async (og) => {
            const name = this.#addedName;
            console.log(this.#addedName);
            this.#openNode[name] = true;
            if (name !== '') {
                const { getTreeNodeFromPath } = await import('./getTreeNodeFromPath.mjs');
                const ref = getTreeNodeFromPath(this.nodesCopy, name);
                ref.node[isOpenPath] = true;
            }
            this.updateCount++;
        });
    }
    async onDeleteNode({ deleteNode, objectGraph }) {
        const { deleteOGNodeFromPath } = await import('./deleteOGNodeFromPath.mjs');
        await deleteOGNodeFromPath(objectGraph, deleteNode.name);
        //delete this.#openNode[deleteNode.name];
        this.updateCount++;
    }
    async onCopyNodeToClipboard({ copyNodeToClipboard, objectGraph }) {
        const { copyOGNodeToClipboard } = await import('./copyOGNodeToClipboard.mjs');
        copyOGNodeToClipboard(objectGraph, copyNodeToClipboard.name);
    }
    async onExpandAllNode({ expandAllNode, nodesCopy }) {
        const { getTreeNodeFromPath } = await import('./getTreeNodeFromPath.mjs');
        const node = getTreeNodeFromPath(nodesCopy, expandAllNode.name);
        this.onExpandAll(this, [node.node]);
        return this.updateViewableNodes(this);
    }
    async onCollapseAllNode({ collapseAllNode, nodesCopy }) {
        const { getTreeNodeFromPath } = await import('./getTreeNodeFromPath.mjs');
        const node = getTreeNodeFromPath(nodesCopy, collapseAllNode.name);
        this.onCollapseAll(this, [node.node]);
        return this.updateViewableNodes(this);
    }
    makeDownloadBlob({ objectGraph }) {
        const file = new Blob([JSON.stringify(objectGraph, null, 2)], { type: 'text/json' });
        this.downloadHref = URL.createObjectURL(file);
    }
}
const dispatch = {
    notify: {
        dispatch: true
    }
};
const noDry = {
    dry: false
};
const noDryNoP = {
    dry: false,
    parse: false,
};
const xe = new XE({
    config: {
        tagName: 'xtal-tree',
        propDefaults: {
            isOpenPath: 'open',
            testNodePaths: ['name', 'value'],
            idPath: 'id',
            parentPath: 'parent',
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
            indentFactor: 25,
        },
        propInfo: {
            toggledNode: {
                notify: {
                    dispatch: true
                },
                dry: false,
            },
            newNode: noDryNoP,
            toggledNodePath: noDry,
            editedNode: noDryNoP,
            viewableNodes: dispatch,
            collapseAll: noDry,
            expandAll: noDry,
            expandAllNode: noDryNoP,
            collapseAllNode: noDryNoP,
            updateCount: {
                notify: {
                    echoDelay: 200,
                    echoTo: 'updateCountEcho',
                }
            },
            copyNodeToClipboard: noDryNoP,
            downloadHref: noDryNoP,
        },
        actions: {
            defineIsOpenFn: 'isOpenPath',
            defineIdFn: 'idPath',
            defineTestNodeFn: 'testNodePaths',
            defineToggledNodeFn: 'toggleNodePath',
            defineCompareFn: {
                ifAllOf: ['sort', 'comparePath']
            },
            onSort: 'compareFn',
            toggleNode: {
                ifAllOf: ['toggledNode', 'toggleNodeFn', 'idFn']
            },
            updateViewableNodes: {
                ifAllOf: ['nodesCopy', 'idFn']
            },
            onToggledNodePath: 'toggledNodePath',
            setLevels: {
                ifAllOf: ['nodesCopy', 'levelPath', 'marginStylePath']
            },
            onCollapseAll: 'collapseAll',
            onExpandAll: 'expandAll',
            search: {
                ifKeyIn: ['searchString'],
            },
            onNodes: 'nodes',
            onObjectGraph: 'objectGraph',
            onEditedNode: 'editedNode',
            synchNodesCopyOrObjectGraph: {
                ifEquals: ['updateCount', 'updateCountEcho'],
                //ifAllOf:['updateCount', 'updateCountEcho', 'objectGraph']
            },
            onNewNode: 'newNode',
            onDeleteNode: 'deleteNode',
            onCopyNodeToClipboard: 'copyNodeToClipboard',
            onExpandAllNode: 'expandAllNode',
            onCollapseAllNode: 'collapseAllNode',
            makeDownloadBlob: {
                ifAllOf: ['objectGraph'],
                ifKeyIn: ['updateCount', 'updateCountEcho'],
                ifEquals: ['updateCount', 'updateCountEcho'],
            }
        },
    },
    superclass: XtalTree,
});
