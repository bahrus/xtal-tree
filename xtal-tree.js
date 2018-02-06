(function () {
    class XtalTree extends HTMLElement {
        get childrenFn() {
            return this._childrenFn;
        }
        set childrenFn(val) {
            this._childrenFn = val;
        }
        get keyFn() {
            return this._keyFn;
        }
        set keyFn(val) {
            this._keyFn = val;
        }
        get isOpenFn() {
            return this._isOpenFn;
        }
        set isOpenFn(val) {
            this._isOpenFn = val;
        }
        get nodes() {
            return this._nodes;
        }
        set nodes(val) {
            this._nodes = val;
        }
    }
})();
//# sourceMappingURL=xtal-tree.js.map