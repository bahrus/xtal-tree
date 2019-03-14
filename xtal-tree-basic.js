import 'xtal-splitting/xtal-split.js';
//import {XtalDeco} from 'xtal-decorator/xtal-deco.js';
import 'if-diff/if-diff.js';
import '@polymer/iron-list/iron-list.js';
import 'p-d.p-u/p-d.js';
import 'p-d.p-u/p-u.js';
import { XtalTree } from './xtal-tree.js';
import { XtalFetchReq } from 'xtal-fetch/xtal-fetch-req.js';
import { XtalElement } from 'xtal-element/xtal-element.js';
import { define } from 'xtal-element/define.js';
import { createTemplate, newRenderContext } from 'xtal-element/utils.js';
import { decorate, attribs } from 'trans-render/decorate.js';
import { update } from 'trans-render/update.js';
//const tsBug = [ XtalSplit.is];
const customSymbols = {
    lastFirstVisibleIndex: Symbol('lastFirstVisibleIndex'),
    recalculatedNodes: Symbol('restoreLastVisibleIndex'),
    selectedNode: Symbol('selectedNode'),
};
//const recalculatedNodes = Symbol('restoreLastVisibleIndex');
const mainTemplate = createTemplate(/* html */ `
<!-- ================= Get Sample JSON with Tree Structure (File Directory), Pass to xtal-tree -->
<xtal-fetch-req fetch as="json"></xtal-fetch-req>
<!-- =================  Pass JSON object to xtal-tree for processing ========================= -->
<p-d on="fetch-complete" prop="nodes" val="target.value" m="1"></p-d>
<xtal-tree id="myTree"></xtal-tree>
<p-d on="viewable-nodes-changed" to="iron-list" prop="items" val="target.viewableNodes" m="1" skip-init></p-d>
<p-d on="viewable-nodes-changed" to="iron-list" prop-sym="recalculatedNodes" m="1" skip-init val="target.viewableNodes"></p-d> 
<!-- ==============  Styling of iron-list ================== -->
<style>
  div.node {
    cursor: pointer;
    height: 24px;
    display:flex;
    flex-direction:row;
    align-items: center;
  }

  span.match {
    font-weight: bold;
    background-color: yellowgreen;
  }

  span[data-has-children="1"][data-is-expanded="1"]::after{
    content: "\u25BE";
    font-size: 1.6em;
  }

  span[data-has-children="-1"],span[data-no-children="-1"]{
    display:none;
  }

  span[data-has-children="1"][data-is-expanded="-1"]::after{
    content: "\u25B8";
    font-size: 1.6em;
  }

  span[data-has-children="1"],span[data-no-children="1"]{
    width: 26px;
    display:inline-block;
  }


</style>
<iron-list selection-enabled style="height:400px;overflow-x:hidden" id="nodeList" mutable-data p-d-if="p-d-r">
  <template>
    <div node="[[item]]" class="node" style$="[[item.style]]" p-d-if="p-d-r">
      <span node="[[item]]" p-d-if="p-d-r">
        <if-diff if="[[item.children]]" tag="hasChildren" m="1"></if-diff>
        <if-diff if="[[!item.children]]" tag="noChildren" m="1"></if-diff>
        <if-diff if="[[item.expanded]]" tag="isExpanded" m="1"></if-diff>
        <span data-has-children="-1" data-is-expanded="-1" node="[[item]]">&nbsp;</span>
        <span data-no-children="1">&nbsp;</span>
      </span>
      <xtal-split  node="[[item]]" text-content="[[item.name]]"></xtal-split>          
    </div>
  </template>
</iron-list>   
<p-u on="Symbol-selectedNode-changed" to="./myTree" prop="toggledNode" skip-init>

`);
//const nodeClickEvent = 'nodeClickEvent';
const href = 'href';
const indendentation = 'indentation';
const init = Symbol('init');
export class XtalTreeBasic extends XtalElement {
    constructor() {
        super(...arguments);
        this._indentation = 18;
        // setHref(){
        //   if(!this.root) return;
        //   (this.root.querySelector(XtalFetchReq.is) as XtalFetchReq).href = this._href;
        // }
        this._initContext = newRenderContext({
            [XtalTree.is]: ({ target }) => {
                const indent = this._indentation;
                decorate(target, {
                    [attribs]: {
                        [indendentation]: this._indentation,
                    },
                    childrenFn: node => node.children,
                    isOpenFn: node => node.expanded,
                    levelSetterFn: function (nodes, level) {
                        nodes.forEach(node => {
                            node.level = level;
                            //const adjustedLevel = (<any>node).children ? level : level + 1;
                            node.style = 'margin-left:' + (level * indent) + 'px';
                            if (node.children)
                                this.levelSetterFn(node.children, level + 1);
                        });
                    },
                    toggleNodeFn: node => {
                        node.expanded = !node.expanded;
                    },
                    testNodeFn: (node, search) => {
                        if (!search)
                            return true;
                        if (!node.nameLC)
                            node.nameLC = node.name.toLowerCase();
                        return node.nameLC.indexOf(search.toLowerCase()) > -1;
                    },
                    compareFn: (lhs, rhs) => {
                        if (lhs.name < rhs.name)
                            return -1;
                        if (lhs.name > rhs.name)
                            return 1;
                        return 0;
                    },
                });
            },
            'p-d[prop-sym]': ({ target }) => {
                target.prop = customSymbols[target.getAttribute('prop-sym')];
            },
            'iron-list': ({ target }) => {
                decorate(target, {}, {
                    props: {
                        // [customSymbols.lastFirstVisibleIndex]: -1,
                        [customSymbols.recalculatedNodes]: false,
                        [customSymbols.selectedNode]: null
                    },
                    on: {
                        click: function (e) {
                            if (!e.target.node)
                                return;
                            console.log('remembering ' + this.firstVisibleIndex);
                            this[customSymbols.lastFirstVisibleIndex] = this.firstVisibleIndex;
                            this[customSymbols.selectedNode] = e.target.node;
                        }
                    },
                    methods: {
                        onPropsChange: function (name, newVal) {
                            switch (name) {
                                case customSymbols.recalculatedNodes:
                                    if (newVal === false)
                                        return;
                                    //this[customSymbols.lastFirstVisibleIndex] = this[customSymbols.lastFirstVisibleIndex];
                                    setTimeout(() => {
                                        console.log('scrolling to ' + this[customSymbols.lastFirstVisibleIndex]);
                                        this.scrollToIndex(this[customSymbols.lastFirstVisibleIndex]);
                                        console.log(this.firstVisibleIndex);
                                    }, 10);
                                    break;
                            }
                        },
                    },
                    id: init
                });
            }
        });
        this._updateContext = newRenderContext({
            [XtalFetchReq.is]: ({ target }) => decorate(target, {
                href: this._href,
            })
        });
    }
    static get is() { return 'xtal-tree-basic'; }
    get mainTemplate() {
        return mainTemplate;
    }
    static get observedAttributes() {
        return super.observedAttributes.concat([href, indendentation]);
    }
    attributeChangedCallback(n, ov, nv) {
        switch (n) {
            case href:
                this._href = nv;
                break;
            case indendentation:
                this._indentation = parseFloat(nv);
                break;
        }
        super.attributeChangedCallback(n, ov, nv);
    }
    get href() {
        return this._href;
    }
    set href(nv) {
        this.setAttribute(href, nv);
    }
    get indentation() {
        return this._indentation;
    }
    set indentation(nv) {
        this.attr(indendentation, nv.toString());
    }
    get initContext() {
        return this._initContext;
    }
    get updateContext() {
        this._updateContext.update = update;
        return this._updateContext;
    }
    get ready() { return true; }
    get eventContext() {
        return {};
    }
    onPropsChange() {
        if (!super.onPropsChange())
            return false;
        //this.setHref();
        return true;
    }
}
define(XtalTreeBasic);
