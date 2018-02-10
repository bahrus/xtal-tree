(function () {
    /**
     * `xtal-cascade`
     *  Cascade node selection up and down a tree collection
     *
     * @customElement
     * @polymer
     * @demo demo/index.html
     */
    class XtalCascade extends HTMLElement {
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
        get isSelectedFn() {
            return this._isSelectedFn;
        }
        set isSelectedFn(nodeFn) {
            this._isSelectedFn = nodeFn;
        }
        get selectedNodeFn() {
            return this._selectedNodeFn;
        }
        set selectedNodeFn(nodeFn) {
            this._selectedNodeFn = nodeFn;
        }
        get nodes() {
            return this._nodes;
        }
        set nodes(nodes) {
            this._nodes = nodes;
            this.onPropsChange();
        }
        onPropsChange() {
            if (!this._keyFn || !this._childrenFn || !this._nodes)
                return;
            this.createChildToParentLookup();
        }
        createChildToParentLookup() {
            this._childToParentLookup = {};
        }
    }
    customElements.define('xtal-cascade', XtalCascade);
})();
//# sourceMappingURL=xtal-cascade.js.map