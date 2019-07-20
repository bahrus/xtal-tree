import "if-diff/if-diff.js";
import "p-et-alia/p-d.js";
import "p-et-alia/p-u.js";
import "./xtal-tree-basic-vlist.js";
import { XtalTree } from "./xtal-tree.js";
import { XtalFetchReq } from "xtal-fetch/xtal-fetch-req.js";
import { XtalElement } from "xtal-element/xtal-element.js";
import { define } from "trans-render/define.js";
import { createTemplate, newRenderContext } from "xtal-element/utils.js";
import { decorate } from "trans-render/decorate.js";
import { update } from "trans-render/update.js";
import { DecorateArgs } from "trans-render/init.d.js";

// const customSymbols = {
//   lastFirstVisibleIndex: Symbol("lastFirstVisibleIndex"),
//   recalculatedNodes: Symbol("restoreLastVisibleIndex"),
//   selectedNode: Symbol("selectedNode")
// };
const mainTemplate = createTemplate(/* html */ `
<!--   Expand All / Collapse All / Sort  / Search Buttons -->
<button disabled data-expand-cmd=allExpandedNodes>Expand All</button>
<!--Expand All-->
<p-d on=click to=xtal-tree[-expandCmd]  val=target.dataset.expandCmd m=1 skip-init></p-d>
<button disabled data-expand-cmd=allCollapsedNodes>Collapse All</button>
<p-d on=click to=xtal-tree[-expandCmd]  val=target.dataset.expandCmd m=1 skip-init></p-d>
<button disabled data-dir="asc">Sort Asc</button>
<p-d on=click to=xtal-tree[-sorted] val=target.dataset.dir m=1 skip-init></p-d>
<button disabled data-dir="desc">Sort Desc</button>
<p-d on=click to=xtal-tree[-sorted] val=target.dataset.dir></p-d>
<input disabled=2 type=text placeholder=Search>
<p-d on=input to=xtal-tree-basic-vlist[-search] val=target.value></p-d>
<p-d on=input to=xtal-tree[-searchString] val=target.value></p-d>
<!-- ================= Get Sample JSON with Tree Structure (File Directory), Pass to xtal-tree -->
<xtal-fetch-req fetch as=json></xtal-fetch-req>
<!-- =================  Pass JSON object to xtal-tree for processing ========================= -->
<p-d on=fetch-complete prop=nodes val=target.value m=1></p-d>
<xtal-tree -expandCmd -sorted -searchString id=myTree></xtal-tree>
<p-d on=viewable-nodes-changed to=[-items]  val=target.viewableNodes m=1 skip-init></p-d>
<xtal-tree-basic-vlist -items -search></xtal-tree-basic-vlist>
<p-u on=selectedNode-changed to=myTree prop=toggledNode val=target.selectedNode></p-u>
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

  span[data-has-children],span[data-no-children]{
    width:26px;
  }
  span[data-has-children="-1"],span[data-no-children="-1"]{
    visibility:hidden;
  }

  span[data-has-children="1"][data-is-expanded="-1"]::after{
    content: "\u25B8";
    font-size: 1.6em;
  }

  span[data-has-children="1"],span[data-no-children="1"]{
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
export class XtalTreeBasic extends XtalElement {
  static get is() {
    return "xtal-tree-basic";
  }
  get mainTemplate() {
    return mainTemplate;
  }
  static get observedAttributes() {
    return super.observedAttributes.concat([href, indendentation]);
  }
  attributeChangedCallback(n: string, ov: string, nv: string) {
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
  _href!: string;
  get href() {
    return this._href;
  }
  set href(nv) {
    this.setAttribute(href, nv);
  }
  _indentation = 18;
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
        decorate(
          target as HTMLElement,
          {
            attribs: {
              [indendentation]: this._indentation
            },
            propDefs:{
              expandCmd: '',
            },
            propVals: {
              childrenFn: node => (<any>node).children,
              isOpenFn: node => (<any>node).expanded,
              levelSetterFn: function(nodes, level) {
                nodes.forEach(node => {
                  (<any>node).level = level;
                  //const adjustedLevel = (<any>node).children ? level : level + 1;
                  (<any>node).style = "margin-left:" + level * indent + "px";
                  if ((<any>node).children)
                    this.levelSetterFn((<any>node).children, level + 1);
                });
              },
              toggleNodeFn: node => {
                (<any>node).expanded = !(<any>node).expanded;
              },
              testNodeFn: (node, search) => {
                if (!search) return true;
                if (!(<any>node).nameLC)
                  (<any>node).nameLC = (<any>node).name.toLowerCase();
                return (<any>node).nameLC.indexOf(search.toLowerCase()) > -1;
              },
              compareFn: (lhs, rhs) => {
                if ((<any>lhs).name < (<any>rhs).name) return -1;
                if ((<any>lhs).name > (<any>rhs).name) return 1;
                return 0;
              }
            },
            methods: {
              onPropsChange(name, newVal) {
                switch (name) {
                  case 'expandCmd':
                    this[this.expandCmd] = this.viewableNodes;
                    break;
  
                }
              }
            }
          } as DecorateArgs
        );
      },

    });
  }
  _updateContext = newRenderContext({
    [XtalFetchReq.is]: ({ target }) =>
      decorate(target as HTMLElement, {
        propVals: {
          href: this._href
        }
      })
  });
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
    if (!super.onPropsChange()) return false;
    //this.setHref();
    return true;
  }
}
define(XtalTreeBasic);


