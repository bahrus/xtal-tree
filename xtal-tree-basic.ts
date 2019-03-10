import {XtalSplit} from 'xtal-splitting/xtal-split.js';
//import {XtalDeco} from 'xtal-decorator/xtal-deco.js';
import {IfDiff} from 'if-diff/if-diff.js';
import '@polymer/iron-list/iron-list.js';
import {PD} from 'p-d.p-u/p-d.js';
import {XtalTree} from './xtal-tree.js';
import {XtalFetchReq} from 'xtal-fetch/xtal-fetch-req.js';
import {XtalElement} from 'xtal-element/xtal-element.js';
import {define} from 'xtal-element/define.js';
import {createTemplate, newRenderContext} from 'xtal-element/utils.js';
import {decorate, attribs} from 'trans-render/decorate.js';
import {RuleMapping} from 'event-switch/event-switch.d.js';
import {newEventContext} from 'event-switch/event-switch.js';
const tsBug = [PD.is, IfDiff.is, XtalSplit.is];
//console.log(tsBug);
const mainTemplate = createTemplate(/* html */`
<!-- ================= Get Sample JSON with Tree Structure (File Directory), Pass to xtal-tree -->
<xtal-fetch-req fetch as="json"></xtal-fetch-req>
<!-- =================  Pass JSON object to xtal-tree for processing ========================= -->
<p-d on="fetch-complete" prop="nodes" val="target.value" m="1"></p-d>
<xtal-tree id="myTree"></xtal-tree>
<p-d on="viewable-nodes-changed" to="iron-list" prop="items" val="target.viewableNodes" m="1"></p-d>
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

  span[data-has-children="1"][data-is-expanded="-1"]::after{
    content: "\u25B8";
    font-size: 1.6em;
  }


</style>
<iron-list style="height:400px;overflow-x:hidden" id="nodeList" mutable-data p-d-if="p-d-r">
  <template>
    <div node="[[item]]" class="node" style$="[[item.style]]" p-d-if="p-d-r">
      <span node="[[item]]" p-d-if="p-d-r">
        <if-diff if="[[item.children]]" tag="hasChildren" m="1">&nbsp;</if-diff>
        <if-diff if="[[item.expanded]]" tag="isExpanded" m="1">&nbsp;</if-diff>
        <span data-has-children="-1" data-is-expanded="-1" node="[[item]]"></span>
      </span>
      <xtal-split node="[[item]]" text-content="[[item.name]]"></xtal-split>          
    </div>
  </template>
</iron-list>   


`);
const nodeClickEvent = 'nodeClickEvent';
const href = 'href';
const indendentation = 'indentation';
const init = Symbol('init');
export class XtalTreeBasic extends XtalElement{
    static get is(){return 'xtal-tree-basic';}
    get mainTemplate(){
        return mainTemplate;
    }
    static get observedAttributes(){
      return super.observedAttributes.concat([href, indendentation]);
    }
    attributeChangedCallback(n: string, ov: string, nv: string){
      switch(n){
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
    get href(){
      return this._href;
    }
    set href(nv){
      this.setAttribute(href, nv);
    }
    _indentation = 18;
    get indentation(){
      return this._indentation;
    }
    set indentation(nv){
      this.attr(indendentation, nv.toString());
    }
    setHref(){
      if(!this.root) return;
      (this.root.querySelector(XtalFetchReq.is) as XtalFetchReq).href = this._href;
    }
    _renderContext = newRenderContext({
        [XtalTree.is]: ({target}) => {
            const indent = this._indentation;
            decorate<XtalTree>(target as XtalTree, {
              [attribs]:{
                [indendentation]: this._indentation,
              },
              childrenFn: node => (<any>node).children,
              isOpenFn: node => (<any>node).expanded,
              levelSetterFn: function (nodes, level) {
                nodes.forEach(node => {
                  (<any>node).level = level;
                  const adjustedLevel = (<any>node).children ? level : level + 1;
                  (<any>node).style = 'margin-left:' + (adjustedLevel * indent) + 'px';
                  if ((<any>node).children) this.levelSetterFn((<any>node).children, level + 1)
                })
              },
              toggleNodeFn: node => {
                  (<any>node).expanded = !(<any>node).expanded;
              },
              testNodeFn: (node, search) => {
                if (!search) return true;
                if (!(<any>node).nameLC) (<any>node).nameLC = (<any>node).name.toLowerCase();
                return (<any>node).nameLC.indexOf(search.toLowerCase()) > -1;
              },
              compareFn: (lhs, rhs) => {
                if ((<any>lhs).name < (<any>rhs).name) return -1;
                if ((<any>lhs).name > (<any>rhs).name) return 1;
                return 0;
              },
            } as any);
        },
        'iron-list': ({target}) => {
            decorate<HTMLElement>(target as HTMLElement, {} as HTMLElement, {
              props: {
                newFirstVisibleIndex: -1,
              },
              on:{
                click: function(e){
                  if(!(<any>e).target.node) return;
                  const firstVisible = this.firstVisibleIndex;
                  e.target.dispatchEvent(new CustomEvent(nodeClickEvent, {
                    bubbles: true,
                    detail: {
                      toggledNode: (<any>e).target.node
                    }
                  }))
                  this.newFirstVisibleIndex = firstVisible;
                }
              },
              methods:{
                onPropsChange: function (name, newVal) {
                  switch (name) {
                    case 'newFirstVisibleIndex':
                      if(!this.items || this.newFirstVisibleIndex < 0) return;
                      this.scrollToIndex(this.newFirstVisibleIndex);
                  }
                },
              },
              id: init
            })
          }
    });
    get renderContext(){
        return this._renderContext;
    }
    get ready(){return true;}
    _eventContext = newEventContext({
      [nodeClickEvent]:{
        action: e =>{
          (this.root.querySelector(XtalTree.is) as XtalTree).toggledNode = (<any>e).detail.toggledNode;
        }
      }
    } as RuleMapping)
    get eventContext(){
        return this._eventContext;
    }
    onPropsChange(){
      if(!super.onPropsChange()) return false;
      this.setHref();
      return true;
    }
}
define(XtalTreeBasic);



