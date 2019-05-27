import {XtallatX} from 'xtal-element/xtal-latx.js';
import {define} from 'trans-render/define.js';
import {hydrate} from 'trans-render/hydrate.js';

interface INodeState {
}

interface INodePosition {
    node: ITreeNode,
    position: number
}

export interface ITreeNode {
}

export interface ITree {
    nodes: ITreeNode[];
    childrenFn: (tn: ITreeNode) => ITreeNode[];

}

const search_string = 'search-string';
const sorted = 'sorted';
/**
 * `xtal-tree`
 *  Provide flat, virtual snapshot of a tree 
 *
 * @customElement
 * @polymer
 * @demo demo/index.html
 */
export class XtalTree extends  XtallatX(hydrate(HTMLElement)) {
    static get is(){return 'xtal-tree';}
    static get observedAttributes() {
        return [search_string, sorted];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        switch (name) {
            case search_string:
                this._searchString = newValue;
                this.searchNodes();
                break;
            case sorted:
                this._sorted = newValue;
                this.sort(true);
                break;
        }

    }
    _conn: boolean;
    connectedCallback() {
        this.style.display = 'none';
        this._conn = true;
        this.propUp(['childrenFn', 'compareFn', 'isOpenFn', 'nodes', 'searchString', 
            sorted, 'testNodeFn', 'toggledNode', 'toggleNodeFn', 'levelSetterFn']);
        this.onPropsChange();
    }

    _childrenFn: (tn: ITreeNode) => ITreeNode[];
    get childrenFn() {
        return this._childrenFn;
    }
    set childrenFn(nodeFn) {
        this._childrenFn = nodeFn;
        this.onPropsChange();
    }



    _isOpenFn: (tn: ITreeNode) => boolean;
    get isOpenFn() {
        return this._isOpenFn;
    }
    set isOpenFn(nodeFn) {
        this._isOpenFn = nodeFn;
        this.onPropsChange();
    }

    _nodes: ITreeNode[];
    get nodes() {
        return this._nodes;
    }

    set nodes(nodes) {
        this._nodes = nodes;
        this.sort(false);
        this.onPropsChange();
    }

    _searchString: string;
    get searchString() {
        return this._searchString;
    }
    set searchString(val) {
        this.attr(search_string, val);
    }

    _testNodeFn?: (tn: ITreeNode, search: string) => boolean;
    get testNodeFn() {
        return this._testNodeFn;
    }
    set testNodeFn(fn) {
        this._testNodeFn = fn;
    }

    _compareFn: (lhs: ITreeNode, rhs: ITreeNode) => number;
    get compareFn() {
        return this._compareFn;
    }

    set compareFn(val) {
        this._compareFn = val;
        this.sort(true);
    }

    _sorted: string;
    get sorted() {
        return this._sorted;
    }
    set sorted(val) {
        this.attr(sorted, val);
    }

    sort(redraw: boolean) {
        if (!this._sorted || !this._compareFn || !this._nodes) return;
        this.sortNodes(this._nodes);
        if (redraw) {
            this.updateViewableNodes();
        }
    }

    sortNodes(nodes: ITreeNode[], compareFn?: (lhs: ITreeNode, rhs: ITreeNode) => number) {
        if (!compareFn) {
            if (this.sorted === 'desc') {
                compareFn = (lhs: ITreeNode, rhs: ITreeNode) => -1 * this._compareFn(lhs, rhs);
            } else {
                compareFn = this._compareFn;
            }
        }

        nodes.sort(compareFn);
        nodes.forEach(node => {
            const children = this._childrenFn(node);
            if (children) this.sortNodes(children, compareFn);
        })


    }

    notifyViewNodesChanged() {
        debugger;
        this.de('viewable-nodes',{
            value: this.viewableNodes
        })
    }
    onPropsChange() {
        if (!this._conn || !this._isOpenFn || !this._childrenFn || !this._nodes) return;
        if (this._levelSetterFn) {
            this._levelSetterFn(this._nodes, 0);
        }
        this.updateViewableNodes();

    }

    _calculateViewableNodes(nodes: ITreeNode[], acc: ITreeNode[]) {
        if (!nodes) return;
        nodes.forEach(node => {
            if (this.searchString) {
                if (!this._isOpenFn(node) && !this._testNodeFn(node, this.searchString)) return;
            }
            acc.push(node);
            if (this._isOpenFn(node)) this._calculateViewableNodes(this._childrenFn(node), acc);
        })
        return acc;
    }

    _viewableNodes: ITreeNode[];
    get viewableNodes() {
        return this._viewableNodes;
    }

    set viewableNodes(nodes) {
        this._viewableNodes = nodes;
    }

    _toggleNodeFn: (tn: ITreeNode) => void;
    get toggleNodeFn() {
        return this._toggleNodeFn;
    }

    set toggleNodeFn(nodeFn) {
        this._toggleNodeFn = nodeFn;
    }
    updateViewableNodes() {
        this._viewableNodes = this._calculateViewableNodes(this._nodes, []);
        this.notifyViewNodesChanged();
    }
    set toggledNode(node: ITreeNode) {
        if(node === null) return;
        this.de('toggled-node', {
            value: node
        })
        this._toggleNodeFn(node);
        this.updateViewableNodes();
    }

    set allExpandedNodes(nodes: ITreeNode[]) {
        this.expandAll(nodes);
        this.updateViewableNodes();
    }

    set allCollapsedNodes(nodes: ITreeNode[]) {
        this.collapseAll(nodes);
        this.updateViewableNodes();
    }

    searchNodes() {
        if (!this._testNodeFn) return;
        this.collapseAll(this._nodes);
        this.search(this._nodes, null);
        this.updateViewableNodes();
    }

    search(nodes: ITreeNode[], parent: ITreeNode) {
        nodes.forEach(node => {
            if (this._testNodeFn(node, this._searchString)) {
                if (parent) this.openNode(parent);
            } else {
                const children = this._childrenFn(node);
                if (children) {
                    this.search(children, node);
                    if (parent && this._isOpenFn(node)) {
                        this.openNode(parent);
                    }
                }
            }
        })
    }

    openNode(node) {
        if (!this._isOpenFn(node)) this._toggleNodeFn(node);
    }

    expandAll(nodes: ITreeNode[]) {
        nodes.forEach(node => {
            this.openNode(node);
            const children = this._childrenFn(node);
            if (children) this.expandAll(children);
        })
    }
    closeNode(node) {
        if (this._isOpenFn(node)) this._toggleNodeFn(node);
    }
    collapseAll(nodes: ITreeNode[]) {
        nodes.forEach(node => {
            this.closeNode(node);
            const children = this._childrenFn(node);
            if (children) this.collapseAll(children);
        })
    }

    _levelSetterFn: (nodes: ITreeNode[], level: number) => void
    set levelSetterFn(setter) {
        this._levelSetterFn = setter;
        this.onPropsChange();
    }
    get levelSetterFn() {
        return this._levelSetterFn;
    }
}

define(XtalTree);
