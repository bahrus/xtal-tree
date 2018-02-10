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
        get toggleNodeSelectionFn() {
            return this._toggleNodeSelectionFn;
        }
        set toggleNodeSelectionFn(nodeFn) {
            this._toggleNodeSelectionFn = nodeFn;
        }
        set toggledNodeSelection(tn) {
            this._toggleNodeSelectionFn(tn);
        }
        selectNodeShallow(tn) {
            if (!this._isSelectedFn(tn))
                this._toggleNodeSelectionFn(tn);
        }
        unselectNodeShallow(tn) {
            if (this._isSelectedFn(tn))
                this._toggleNodeSelectionFn(tn);
        }
        selectNodeAndCascade(tn) {
            this.selectNodeRecursive(tn);
        }
        selectNodeRecursive(tn) {
            this.selectNodeShallow(tn);
            const children = this._childrenFn(tn);
            if (children) {
                this._selectedChildScore[this._keyFn(tn)] = children.length;
                children.forEach(child => this.selectNodeRecursive(child));
            }
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
            this.startCreatingChildToParentLookup();
        }
        startCreatingChildToParentLookup() {
            this._childToParentLookup = {};
            this.createChildToParentLookup(this._nodes, this._childToParentLookup);
        }
        createChildToParentLookup(nodes, lookup) {
            nodes.forEach(node => {
                const nodeKey = this._keyFn(node);
                const scs = this._selectedChildScore;
                scs[nodeKey] = 0;
                const children = this._childrenFn(node);
                if (children) {
                    children.forEach(child => {
                        if (this._isSelectedFn(child))
                            scs[nodeKey]++;
                        const childId = this._keyFn(child);
                        lookup[childId] = node;
                    });
                    this.createChildToParentLookup(children, lookup);
                }
            });
        }
    }
    customElements.define('xtal-cascade', XtalCascade);
})();
//# sourceMappingURL=xtal-cascade.js.map