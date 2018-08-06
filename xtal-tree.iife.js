
    //@ts-check
    (function () {
    const disabled = 'disabled';
function XtallatX(superClass) {
    return class extends superClass {
        constructor() {
            super(...arguments);
            this._evCount = {};
        }
        static get observedAttributes() {
            return [disabled];
        }
        get disabled() {
            return this._disabled;
        }
        set disabled(val) {
            this.attr(disabled, val, '');
        }
        attr(name, val, trueVal) {
            if (val) {
                this.setAttribute(name, trueVal || val);
            }
            else {
                this.removeAttribute(name);
            }
        }
        incAttr(name) {
            const ec = this._evCount;
            if (name in ec) {
                ec[name]++;
            }
            else {
                ec[name] = 0;
            }
            this.attr(name, ec[name].toString());
        }
        attributeChangedCallback(name, oldVal, newVal) {
            switch (name) {
                case disabled:
                    this._disabled = newVal !== null;
                    break;
            }
        }
        de(name, detail) {
            const eventName = name + '-changed';
            const newEvent = new CustomEvent(eventName, {
                detail: detail,
                bubbles: true,
                composed: false,
            });
            this.dispatchEvent(newEvent);
            this.incAttr(eventName);
            return newEvent;
        }
        _upgradeProperties(props) {
            props.forEach(prop => {
                if (this.hasOwnProperty(prop)) {
                    let value = this[prop];
                    delete this[prop];
                    this[prop] = value;
                }
            });
        }
    };
}
//# sourceMappingURL=xtal-latx.js.map
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
class XtalTree extends XtallatX(HTMLElement) {
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
        this._upgradeProperties(['childrenFn', 'compareFn', 'isOpenFn', 'nodes', 'searchString', sorted, 'testNodeFn', 'toggledNode', 'toggleNodeFn', 'levelSetterFn']);
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
        if (!this._isOpenFn || !this._childrenFn || !this._nodes)
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
customElements.define('xtal-tree', XtalTree);
//# sourceMappingURL=xtal-tree.js.map
    })();  
        