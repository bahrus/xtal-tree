(function(){class a extends HTMLElement{static get properties(){return{childrenFn:null,compareFn:null,isOpenFn:null,nodes:null,searchString:null,sorted:null,testNodeFn:null,toggledNode:null,toggleNodeFn:null}}_upgradeProperty(a){if(this.hasOwnProperty(a)){let b=this[a];delete this[a],this[a]=b}}connectedCallback(){for(const b in a.properties)this._upgradeProperty(b)}get childrenFn(){return this._childrenFn}set childrenFn(a){this._childrenFn=a,this.onPropsChange()}get isOpenFn(){return this._isOpenFn}set isOpenFn(a){this._isOpenFn=a,this.onPropsChange()}get nodes(){return this._nodes}set nodes(a){this._nodes=a,this.sort(!1),this.onPropsChange()}get searchString(){return this._searchString}set searchString(a){this._searchString=a,a&&this.searchNodes()}get testNodeFn(){return this._testNodeFn}set testNodeFn(a){this._testNodeFn=a}get compareFn(){return this._compareFn}set compareFn(a){this._compareFn=a,this.sort(!0)}get sorted(){return this._sorted}set sorted(a){this._sorted=a,this.sort(!0)}sort(a){this._sorted&&this._compareFn&&this._nodes&&(this.sortNodes(this._nodes),a&&this.updateViewableNodes())}sortNodes(a,b){b||('desc'===this.sorted?b=(a,b)=>-1*this._compareFn(a,b):b=this._compareFn),a.sort(b),a.forEach((a)=>{const c=this._childrenFn(a);c&&this.sortNodes(c,b)})}notifyViewNodesChanged(){const a=new CustomEvent('viewable-nodes-changed',{detail:{value:this.viewableNodes},bubbles:!0,composed:!0});this.dispatchEvent(a)}onPropsChange(){this._isOpenFn&&this._childrenFn&&this._nodes&&(this._levelSetterFn&&this._levelSetterFn(this._nodes,0),this.updateViewableNodes())}_calculateViewableNodes(a,b){if(a)return a.forEach((a)=>{(!this.searchString||this._isOpenFn(a)||this._testNodeFn(a,this.searchString))&&(b.push(a),this._isOpenFn(a)&&this._calculateViewableNodes(this._childrenFn(a),b))}),b}get viewableNodes(){return this._viewableNodes}set viewableNodes(a){this._viewableNodes=a}get toggleNodeFn(){return this._toggleNodeFn}set toggleNodeFn(a){this._toggleNodeFn=a}updateViewableNodes(){this._viewableNodes=this._calculateViewableNodes(this._nodes,[]),this.notifyViewNodesChanged()}set toggledNode(a){this._toggleNodeFn(a),this.updateViewableNodes()}set allExpandedNodes(a){this.expandAll(a),this.updateViewableNodes()}set allCollapsedNodes(a){this.collapseAll(a),this.updateViewableNodes()}searchNodes(){this._testNodeFn&&(this.collapseAll(this._nodes),this.search(this._nodes,null),this.updateViewableNodes())}search(a,b){a.forEach((a)=>{if(this._testNodeFn(a,this._searchString))b&&this.openNode(b);else{const c=this._childrenFn(a);c&&(this.search(c,a),b&&this._isOpenFn(a)&&this.openNode(b))}})}openNode(a){this._isOpenFn(a)||this._toggleNodeFn(a)}expandAll(a){a.forEach((a)=>{this.openNode(a);const b=this._childrenFn(a);b&&this.expandAll(b)})}closeNode(a){this._isOpenFn(a)&&this._toggleNodeFn(a)}collapseAll(a){a.forEach((a)=>{this.closeNode(a);const b=this._childrenFn(a);b&&this.collapseAll(b)})}set levelSetterFn(a){this._levelSetterFn=a}get levelSetterFn(){return this._levelSetterFn}}customElements.define('xtal-tree',a)})();