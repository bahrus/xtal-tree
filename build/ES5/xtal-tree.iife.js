(function(){var disabled="disabled";var search_string="search-string",sorted="sorted",XtalTree=function(_XtallatX){babelHelpers.inherits(XtalTree,_XtallatX);function XtalTree(){babelHelpers.classCallCheck(this,XtalTree);return babelHelpers.possibleConstructorReturn(this,(XtalTree.__proto__||Object.getPrototypeOf(XtalTree)).apply(this,arguments))}babelHelpers.createClass(XtalTree,[{key:"attributeChangedCallback",value:function attributeChangedCallback(name,oldValue,newValue){switch(name){case search_string:this._searchString=newValue;this.searchNodes();break;case sorted:this._sorted=newValue;this.sort(!0);break;}}},{key:"connectedCallback",value:function connectedCallback(){this._upgradeProperties(["childrenFn","compareFn","isOpenFn","nodes","searchString",sorted,"testNodeFn","toggledNode","toggleNodeFn","levelSetterFn"])}},{key:"sort",value:function sort(redraw){if(!this._sorted||!this._compareFn||!this._nodes)return;this.sortNodes(this._nodes);if(redraw){this.updateViewableNodes()}}},{key:"sortNodes",value:function sortNodes(nodes,compareFn){var _this3=this;if(!compareFn){if("desc"===this.sorted){compareFn=function(lhs,rhs){return-1*_this3._compareFn(lhs,rhs)}}else{compareFn=this._compareFn}}nodes.sort(compareFn);nodes.forEach(function(node){var children=_this3._childrenFn(node);if(children)_this3.sortNodes(children,compareFn)})}},{key:"notifyViewNodesChanged",value:function notifyViewNodesChanged(){this.de("viewable-nodes",{value:this.viewableNodes})}},{key:"onPropsChange",value:function onPropsChange(){if(!this._isOpenFn||!this._childrenFn||!this._nodes)return;if(this._levelSetterFn){this._levelSetterFn(this._nodes,0)}this.updateViewableNodes()}},{key:"_calculateViewableNodes",value:function _calculateViewableNodes(nodes,acc){var _this4=this;if(!nodes)return;nodes.forEach(function(node){if(_this4.searchString){if(!_this4._isOpenFn(node)&&!_this4._testNodeFn(node,_this4.searchString))return}acc.push(node);if(_this4._isOpenFn(node))_this4._calculateViewableNodes(_this4._childrenFn(node),acc)});return acc}},{key:"updateViewableNodes",value:function updateViewableNodes(){this._viewableNodes=this._calculateViewableNodes(this._nodes,[]);this.notifyViewNodesChanged()}},{key:"searchNodes",value:function searchNodes(){if(!this._testNodeFn)return;this.collapseAll(this._nodes);this.search(this._nodes,null);this.updateViewableNodes()}},{key:"search",value:function search(nodes,parent){var _this5=this;nodes.forEach(function(node){if(_this5._testNodeFn(node,_this5._searchString)){if(parent)_this5.openNode(parent)}else{var children=_this5._childrenFn(node);if(children){_this5.search(children,node);if(parent&&_this5._isOpenFn(node)){_this5.openNode(parent)}}}})}},{key:"openNode",value:function openNode(node){if(!this._isOpenFn(node))this._toggleNodeFn(node)}},{key:"expandAll",value:function expandAll(nodes){var _this6=this;nodes.forEach(function(node){_this6.openNode(node);var children=_this6._childrenFn(node);if(children)_this6.expandAll(children)})}},{key:"closeNode",value:function closeNode(node){if(this._isOpenFn(node))this._toggleNodeFn(node)}},{key:"collapseAll",value:function collapseAll(nodes){var _this7=this;nodes.forEach(function(node){_this7.closeNode(node);var children=_this7._childrenFn(node);if(children)_this7.collapseAll(children)})}},{key:"childrenFn",get:function get(){return this._childrenFn},set:function set(nodeFn){this._childrenFn=nodeFn;this.onPropsChange()}},{key:"isOpenFn",get:function get(){return this._isOpenFn},set:function set(nodeFn){this._isOpenFn=nodeFn;this.onPropsChange()}},{key:"nodes",get:function get(){return this._nodes},set:function set(nodes){this._nodes=nodes;this.sort(!1);this.onPropsChange()}},{key:"searchString",get:function get(){return this._searchString},set:function set(val){this.attr(search_string,val)}},{key:"testNodeFn",get:function get(){return this._testNodeFn},set:function set(fn){this._testNodeFn=fn}},{key:"compareFn",get:function get(){return this._compareFn},set:function set(val){this._compareFn=val;this.sort(!0)}},{key:"sorted",get:function get(){return this._sorted},set:function set(val){this.attr(sorted,val)}},{key:"viewableNodes",get:function get(){return this._viewableNodes},set:function set(nodes){this._viewableNodes=nodes}},{key:"toggleNodeFn",get:function get(){return this._toggleNodeFn},set:function set(nodeFn){this._toggleNodeFn=nodeFn}},{key:"toggledNode",set:function set(node){this.de("toggled-node",{value:node});this._toggleNodeFn(node);this.updateViewableNodes()}},{key:"allExpandedNodes",set:function set(nodes){this.expandAll(nodes);this.updateViewableNodes()}},{key:"allCollapsedNodes",set:function set(nodes){this.collapseAll(nodes);this.updateViewableNodes()}},{key:"levelSetterFn",set:function set(setter){this._levelSetterFn=setter;this.onPropsChange()},get:function get(){return this._levelSetterFn}}],[{key:"observedAttributes",get:function get(){return[search_string,sorted]}}]);return XtalTree}(function(superClass){return function(_superClass){babelHelpers.inherits(_class,_superClass);function _class(){var _this;babelHelpers.classCallCheck(this,_class);_this=babelHelpers.possibleConstructorReturn(this,(_class.__proto__||Object.getPrototypeOf(_class)).apply(this,arguments));_this._evCount={};return _this}babelHelpers.createClass(_class,[{key:"attr",value:function attr(name,val,trueVal){if(val){this.setAttribute(name,trueVal||val)}else{this.removeAttribute(name)}}},{key:"incAttr",value:function incAttr(name){var ec=this._evCount;if(name in ec){ec[name]++}else{ec[name]=0}this.attr(name,ec[name].toString())}},{key:"attributeChangedCallback",value:function attributeChangedCallback(name,oldVal,newVal){switch(name){case disabled:this._disabled=null!==newVal;break;}}},{key:"de",value:function de(name,detail){var eventName=name+"-changed",newEvent=new CustomEvent(eventName,{detail:detail,bubbles:!0,composed:!1});this.dispatchEvent(newEvent);this.incAttr(eventName);return newEvent}},{key:"_upgradeProperties",value:function _upgradeProperties(props){var _this2=this;props.forEach(function(prop){if(_this2.hasOwnProperty(prop)){var value=_this2[prop];delete _this2[prop];_this2[prop]=value}})}},{key:"disabled",get:function get(){return this._disabled},set:function set(val){this.attr(disabled,val,"")}}],[{key:"observedAttributes",get:function get(){return[disabled]}}]);return _class}(superClass)}(HTMLElement));customElements.define("xtal-tree",XtalTree)})();