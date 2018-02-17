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
        get isIndeterminateFn() {
            return this._isIndeterminateFn;
        }
        set isIndeterminateFn(nodeFn) {
            this._isIndeterminateFn = nodeFn;
        }
        get toggleNodeSelectionFn() {
            return this._toggleNodeSelectionFn;
        }
        set toggleNodeSelectionFn(nodeFn) {
            this._toggleNodeSelectionFn = nodeFn;
        }
        get toggleIndeterminateFn() {
            return this._toggleInterminateFn;
        }
        set toggleIndeterminateFn(nodeFn) {
            this._toggleInterminateFn = nodeFn;
        }
        set toggledNodeSelection(tn) {
            if (!this._isSelectedFn(tn)) {
                this.selectNodeAndCascade(tn);
            }
            else {
                this.unselectNodeAndCascade(tn);
            }
            //this._toggleNodeSelectionFn(tn);
            this.updateSelectedRootNodes();
        }
        _upgradeProperty(prop) {
            if (this.hasOwnProperty(prop)) {
                let value = this[prop];
                delete this[prop];
                this[prop] = value;
            }
        }
        connectedCallback() {
            for (const key in XtalCascade.properties) {
                this._upgradeProperty(key);
            }
        }
        static get properties() {
            return {
                childrenFn: null,
                nodes: null,
                keyFn: null,
                isSelectedFn: null,
                isIndeterminateFn: null,
                selectedRootNodes: null,
                toggleIndeterminateFn: null,
                toggleNodeSelectionFn: null,
            };
        }
        selectNodeShallow(tn) {
            if (!this._isSelectedFn(tn))
                this._toggleNodeSelectionFn(tn);
            if (this._isIndeterminateFn(tn))
                this._toggleInterminateFn(tn);
        }
        unselectNodeShallow(tn) {
            if (this._isSelectedFn(tn))
                this._toggleNodeSelectionFn(tn);
            if (this._isIndeterminateFn(tn))
                this._toggleInterminateFn(tn);
        }
        setNodeIndeterminate(tn) {
            if (!this._isIndeterminateFn(tn))
                this._toggleInterminateFn(tn);
        }
        selectNodeAndCascade(tn) {
            this.selectNodeRecursive(tn);
            let currentNode = tn;
            do {
                //debugger;
                const thisID = this._keyFn(currentNode);
                const parentNd = this._childToParentLookup[thisID];
                if (parentNd) {
                    const parentId = this._keyFn(parentNd);
                    this._selectedChildScore[parentId]++;
                    const children = this._childrenFn(parentNd);
                    if (this._selectedChildScore[parentId] === children.length) {
                        this.selectNodeShallow(parentNd);
                    }
                    else {
                        //this._toggleInterminateFn(parentNd);
                        this.setNodeIndeterminate(parentNd);
                    }
                }
                currentNode = parentNd;
            } while (currentNode);
        }
        unselectNodeAndCascade(tn) {
            this.unselectNodeRecursive(tn);
            let currentNode = tn;
            do {
                const thisID = this._keyFn(currentNode);
                const parentNd = this._childToParentLookup[thisID];
                if (parentNd) {
                    const parentId = this._keyFn(parentNd);
                    this._selectedChildScore[parentId]--;
                    //const children = this._childrenFn(parentNd);
                    if (this._selectedChildScore[parentId] === 0) {
                        this.unselectNodeShallow(parentNd);
                    }
                    else {
                        if (!this._isIndeterminateFn(parentNd))
                            this._toggleInterminateFn(parentNd);
                        if (this._isSelectedFn(parentNd))
                            this._toggleNodeSelectionFn(parentNd);
                    }
                }
                currentNode = parentNd;
            } while (currentNode);
        }
        // set newSelectedNodeToggle(tn: ITreeNode){
        //     if(this._isSelectedFn(tn)){
        //         this.unselectNodeAndCascade(tn);
        //     }else{
        //         this.selectNodeAndCascade(tn);
        //     }
        //     this.updateSelectedRootNodes();bba
        // }
        selectNodeRecursive(tn) {
            this.selectNodeShallow(tn);
            const children = this._childrenFn(tn);
            if (children) {
                this._selectedChildScore[this._keyFn(tn)] = children.length;
                children.forEach(child => this.selectNodeRecursive(child));
            }
        }
        unselectNodeRecursive(tn) {
            this.unselectNodeShallow(tn);
            const children = this._childrenFn(tn);
            if (children) {
                this._selectedChildScore[this._keyFn(tn)] = 0;
                children.forEach(child => this.unselectNodeRecursive(child));
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
            if (!this._keyFn || !this._childrenFn || !this._nodes ||
                !this._isSelectedFn || !this._toggleNodeSelectionFn || !this._toggleInterminateFn)
                return;
            this.startCreatingChildToParentLookup();
        }
        startCreatingChildToParentLookup() {
            this._childToParentLookup = {};
            this._selectedChildScore = {};
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
                    if (scs[nodeKey] === children.length) {
                        this.selectNodeShallow(node);
                    }
                    else if (scs[nodeKey] > 0) {
                        this._toggleInterminateFn(node);
                    }
                    this.createChildToParentLookup(children, lookup);
                }
            });
            this.updateSelectedRootNodes();
        }
        updateSelectedRootNodes() {
            this._selectedRootNodes = this._calculateSelectedRootNodes(this._nodes, []);
            this.notifySelectedRootNodesChanged();
        }
        notifySelectedRootNodesChanged() {
            const newEvent = new CustomEvent('selected-root-nodes-changed', {
                detail: {
                    value: this._selectedRootNodes
                },
                bubbles: true,
                composed: true
            });
            this.dispatchEvent(newEvent);
        }
        _calculateSelectedRootNodes(nodes, acc) {
            nodes.forEach(node => {
                if (this._isSelectedFn(node)) {
                    acc.push(node);
                }
                else if (this._isIndeterminateFn(node)) {
                    const children = this._childrenFn(node);
                    if (children) {
                        this._calculateSelectedRootNodes(children, acc);
                    }
                }
            });
            return acc;
        }
        get selectedRootNodes() {
            return this._selectedRootNodes;
        }
        set selectedRootNodes(nodes) {
            this._selectedRootNodes = nodes;
        }
    }
    customElements.define('xtal-cascade', XtalCascade);
})();
//# sourceMappingURL=xtal-cascade.js.map