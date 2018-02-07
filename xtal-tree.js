(function () {
    /**
     * `xtal-tree`
     *  Web component wrapper around billboard.js charting library
     *
     * @customElement
     * @polymer
     * @demo demo/index.html
     */
    class XtalTree extends HTMLElement {
        get childrenFn() {
            return this._childrenFn;
        }
        set childrenFn(nodeFn) {
            this._childrenFn = nodeFn;
            this.onPropsChange();
        }
        get keyFn() {
            return this._keyFn;
        }
        set keyFn(nodeFn) {
            this._keyFn = nodeFn;
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
            this.onPropsChange();
        }
        notifyViewNodesChanged() {
            const newEvent = new CustomEvent('viewable-nodes-changed', {
                detail: {
                    value: this.viewableNodes
                },
                bubbles: true,
                composed: true
            });
            this.dispatchEvent(newEvent);
            //console.log(this.viewableNodes);
        }
        onPropsChange() {
            if (!this._isOpenFn || !this._childrenFn || !this._nodes)
                return;
            if (this._levelSetterFn) {
                this._levelSetterFn(this._nodes, 0);
            }
            this.viewableNodes = this._calculateViewableNodes(this._nodes, []);
            this.notifyViewNodesChanged();
        }
        _calculateViewableNodes(nodes, acc) {
            // console.log({
            //     isOpenFn: this._isOpenFn,
            // });
            if (!nodes)
                return;
            nodes.forEach(node => {
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
            this._indexViewableNodes();
        }
        _indexViewableNodes() {
            if (!this._viewableNodes)
                return;
            this._viewableNodeKeys = {};
            this._viewableNodes.forEach((node, idx) => {
                this._viewableNodeKeys[this.keyFn(node)] = {
                    node: node,
                    position: idx
                };
            });
        }
        get toggleNodeFn() {
            return this._toggleNodeFn;
        }
        set toggleNodeFn(nodeFn) {
            this._toggleNodeFn = nodeFn;
        }
        set toggledNode(node) {
            this._toggleNodeFn(node);
            //for now, recalculate all nodes
            this._nodes = this._nodes.slice();
            this._viewableNodes = this._calculateViewableNodes(this._nodes, []);
            this.notifyViewNodesChanged();
        }
        set levelSetterFn(setter) {
            this._levelSetterFn = setter;
        }
        get levelSetterFn() {
            return this._levelSetterFn;
        }
    }
    customElements.define('xtal-tree', XtalTree);
})();
//# sourceMappingURL=xtal-tree.js.map