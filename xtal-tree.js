import { XtallatX } from 'xtal-element/xtal-latx.js';
import { define } from 'xtal-element/define.js';
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
export class XtalTree extends XtallatX(HTMLElement) {
    static get is() { return 'xtal-tree'; }
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
    connectedCallback() {
        this.style.display = 'none';
        this._conn = true;
        this._upgradeProperties(['childrenFn', 'compareFn', 'isOpenFn', 'nodes', 'searchString',
            sorted, 'testNodeFn', 'toggledNode', 'toggleNodeFn', 'levelSetterFn']);
        this.onPropsChange();
    }
    get childrenFn() {
        return this._childrenFn;
    }
    set childrenFn(nodeFn) {
        this._childrenFn = nodeFn;
        this.onPropsChange();
    }
    get isOpenFn() {
        return this._isOpenFn;
    }
    set isOpenFn(nodeFn) {
        this._isOpenFn = nodeFn;
        this.onPropsChange();
    }
    get nodes() {
        return this._nodes;
    }
    set nodes(nodes) {
        this._nodes = nodes;
        this.sort(false);
        this.onPropsChange();
    }
    get searchString() {
        return this._searchString;
    }
    set searchString(val) {
        this.attr(search_string, val);
    }
    get testNodeFn() {
        return this._testNodeFn;
    }
    set testNodeFn(fn) {
        this._testNodeFn = fn;
    }
    get compareFn() {
        return this._compareFn;
    }
    set compareFn(val) {
        this._compareFn = val;
        this.sort(true);
    }
    get sorted() {
        return this._sorted;
    }
    set sorted(val) {
        this.attr(sorted, val);
    }
    sort(redraw) {
        if (!this._sorted || !this._compareFn || !this._nodes)
            return;
        this.sortNodes(this._nodes);
        if (redraw) {
            this.updateViewableNodes();
        }
    }
    sortNodes(nodes, compareFn) {
        if (!compareFn) {
            if (this.sorted === 'desc') {
                compareFn = (lhs, rhs) => -1 * this._compareFn(lhs, rhs);
            }
            else {
                compareFn = this._compareFn;
            }
        }
        nodes.sort(compareFn);
        nodes.forEach(node => {
            const children = this._childrenFn(node);
            if (children)
                this.sortNodes(children, compareFn);
        });
    }
    notifyViewNodesChanged() {
        this.de('viewable-nodes', {
            value: this.viewableNodes
        });
    }
    onPropsChange() {
        if (!this._conn || !this._isOpenFn || !this._childrenFn || !this._nodes)
            return;
        if (this._levelSetterFn) {
            this._levelSetterFn(this._nodes, 0);
        }
        this.updateViewableNodes();
    }
    _calculateViewableNodes(nodes, acc) {
        if (!nodes)
            return;
        nodes.forEach(node => {
            if (this.searchString) {
                if (!this._isOpenFn(node) && !this._testNodeFn(node, this.searchString))
                    return;
            }
            acc.push(node);
            if (this._isOpenFn(node))
                this._calculateViewableNodes(this._childrenFn(node), acc);
        });
        return acc;
    }
    get viewableNodes() {
        return this._viewableNodes;
    }
    set viewableNodes(nodes) {
        this._viewableNodes = nodes;
    }
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
    set toggledNode(node) {
        if (node === null)
            return;
        this.de('toggled-node', {
            value: node
        });
        this._toggleNodeFn(node);
        this.updateViewableNodes();
    }
    set allExpandedNodes(nodes) {
        this.expandAll(nodes);
        this.updateViewableNodes();
    }
    set allCollapsedNodes(nodes) {
        this.collapseAll(nodes);
        this.updateViewableNodes();
    }
    searchNodes() {
        if (!this._testNodeFn)
            return;
        this.collapseAll(this._nodes);
        this.search(this._nodes, null);
        this.updateViewableNodes();
    }
    search(nodes, parent) {
        nodes.forEach(node => {
            if (this._testNodeFn(node, this._searchString)) {
                if (parent)
                    this.openNode(parent);
            }
            else {
                const children = this._childrenFn(node);
                if (children) {
                    this.search(children, node);
                    if (parent && this._isOpenFn(node)) {
                        this.openNode(parent);
                    }
                }
            }
        });
    }
    openNode(node) {
        if (!this._isOpenFn(node))
            this._toggleNodeFn(node);
    }
    expandAll(nodes) {
        nodes.forEach(node => {
            this.openNode(node);
            const children = this._childrenFn(node);
            if (children)
                this.expandAll(children);
        });
    }
    closeNode(node) {
        if (this._isOpenFn(node))
            this._toggleNodeFn(node);
    }
    collapseAll(nodes) {
        nodes.forEach(node => {
            this.closeNode(node);
            const children = this._childrenFn(node);
            if (children)
                this.collapseAll(children);
        });
    }
    set levelSetterFn(setter) {
        this._levelSetterFn = setter;
        this.onPropsChange();
    }
    get levelSetterFn() {
        return this._levelSetterFn;
    }
}
define(XtalTree);
