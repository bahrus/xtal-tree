import "xtal-split/xtal-split.js";
//import {XtalDeco} from 'xtal-decorator/xtal-deco.js';
import "if-diff/if-diff.js";
//import '@polymer/iron-list/iron-list.js';
import "p-et-alia/p-d.js";
import "p-et-alia/p-u.js";
import { XtalTree } from "./xtal-tree.js";
import { XtalFetchReq } from "xtal-fetch/xtal-fetch-req.js";
import { XtalElement } from "xtal-element/xtal-element.js";
import { define } from "trans-render/define.js";
import { createTemplate, newRenderContext } from "xtal-element/utils.js";
import { decorate } from "trans-render/decorate.js";
import { update } from "trans-render/update.js";
import { XtalVListBase } from "xtal-vlist/xtal-vlist-base.js";
import { init } from "trans-render/init.js";
const customSymbols = {
    lastFirstVisibleIndex: Symbol("lastFirstVisibleIndex"),
    recalculatedNodes: Symbol("restoreLastVisibleIndex"),
    selectedNode: Symbol("selectedNode")
};
//const recalculatedNodes = Symbol('restoreLastVisibleIndex');
const mainTemplate = createTemplate(/* html */ `
<!-- ================= Get Sample JSON with Tree Structure (File Directory), Pass to xtal-tree -->
<xtal-fetch-req fetch as=json></xtal-fetch-req>
<!-- =================  Pass JSON object to xtal-tree for processing ========================= -->
<p-d on=fetch-complete prop=nodes val=target.value m=1></p-d>
<xtal-tree id=myTree></xtal-tree>
<p-d on=viewable-nodes-changed to=xtal-vlist-customized[-items]  val=target.viewableNodes m=1 skip-init></p-d>
<!-- <p-d on="viewable-nodes-changed" to="iron-list" prop-sym="recalculatedNodes" m="1" skip-init val="target.viewableNodes"></p-d>  -->
<xtal-vlist-customized -items></xtal-vlist-customized>
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

  @media only screen and (-webkit-min-device-pixel-ratio : 1.5),
        only screen and (min-device-pixel-ratio : 1.5) {

      /* Styles */
      .container {
          width: 100%;
          height: 100%;
          min-height: 100%;
      }
  }

  .vrow {
      width: 100%;
      height: 30px;
      max-height: 30px;
      /*border-bottom: solid 1px #dbd9d9;*/
      color: #000;
      margin: 0;
  }

  .vrow p {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      border: none;
      margin: 0;
      color: #5b5b5b;
      /*font-size: 1.5rem;*/
  }
</style>


`);
const href = "href";
const indendentation = "indentation";
//const init = Symbol("init");
export class XtalTreeBasic extends XtalElement {
    constructor() {
        super(...arguments);
        this._indentation = 18;
        this._updateContext = newRenderContext({
            [XtalFetchReq.is]: ({ target }) => decorate(target, {
                propVals: {
                    href: this._href
                }
            })
        });
    }
    static get is() {
        return "xtal-tree-basic";
    }
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
    get initRenderContext() {
        return newRenderContext({
            [XtalTree.is]: ({ target }) => {
                const indent = this._indentation;
                decorate(target, {
                    attribs: {
                        [indendentation]: this._indentation
                    },
                    propVals: {
                        childrenFn: node => node.children,
                        isOpenFn: node => node.expanded,
                        levelSetterFn: function (nodes, level) {
                            nodes.forEach(node => {
                                node.level = level;
                                //const adjustedLevel = (<any>node).children ? level : level + 1;
                                node.style = "margin-left:" + level * indent + "px";
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
                        }
                    }
                });
            },
            "p-d[prop-sym]": ({ target }) => {
                target.prop = customSymbols[target.getAttribute("prop-sym")];
            },
            "iron-list": ({ target }) => {
                decorate(target, {
                    propDefs: {
                        // [customSymbols.lastFirstVisibleIndex]: -1,
                        [customSymbols.recalculatedNodes]: false,
                        [customSymbols.selectedNode]: null
                    },
                    on: {
                        click: function (e) {
                            if (!e.target.node)
                                return;
                            console.log("remembering " + this.firstVisibleIndex);
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
                                        console.log("scrolling to " +
                                            this[customSymbols.lastFirstVisibleIndex]);
                                        this.scrollToIndex(this[customSymbols.lastFirstVisibleIndex]);
                                        console.log(this.firstVisibleIndex);
                                    }, 10);
                                    break;
                            }
                        }
                    }
                });
            }
        });
    }
    get updateRenderContext() {
        this._updateContext.update = update;
        return this._updateContext;
    }
    get readyToInit() {
        return true;
    }
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
const testTemplate = createTemplate(/* html */ `
<div>
    <label></label>
</div>
`);
class XtalVListCustomized extends XtalVListBase {
    static get is() {
        return "xtal-vlist-customized";
    }
    get items() {
        return this._items;
    }
    set items(nv) {
        this._items = nv;
        this.totalRows = nv.length;
    }
    generate(row) {
        const el = document.createElement("div");
        // el.innerHTML = "<p>ITEM " + row + "</p>";
        // return el;
        const ctx = {
            Transform: {
                div: {
                    label: this._items[row].name
                }
            }
        };
        init(testTemplate, ctx, el);
        return el;
    }
}
define(XtalVListCustomized);
