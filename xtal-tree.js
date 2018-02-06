(function () {
    class XtalTree extends HTMLElement {
        get childrenFn() {
            return this._childrenFn;
        }
        set childrenFn(node) {
            this._childrenFn = node;
        }
        get keyFn() {
            return this._keyFn;
        }
        set keyFn(node) {
            this._keyFn = node;
        }
        get isOpenFn() {
            return this._isOpenFn;
        }
        set isOpenFn(node) {
            this._isOpenFn = node;
        }
        get nodes() {
            return this._nodes;
        }
        set nodes(nodes) {
            this._nodes = nodes;
            this.viewableNodes = this._calculateViewableNodes(this._nodes, []);
        }
        _calculateViewableNodes(nodes, acc) {
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
            this._viewableNodeKeys = {};
            this._viewableNodes.forEach((node, idx) => {
                this._viewableNodeKeys[this.keyFn(node)] = {
                    node: node,
                    position: idx
                };
            });
        }
        set toggledNode(node) {
        }
    }
    customElements.define('xtal-tree', XtalTree);
})();
//# sourceMappingURL=xtal-tree.js.map