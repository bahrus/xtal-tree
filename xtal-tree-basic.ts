import {XtalSplit} from 'xtal-splitting/xtal-split.js';
//import {XtalDeco} from 'xtal-decorator/xtal-deco.js';
import {IfDiff} from 'if-diff/if-diff.js';
import '@polymer/iron-list/iron-list.js';
import {PD} from './node_modules/p-d.p-u/p-d.js';
import {XtalTree} from './xtal-tree.js';
import {XtalFetchReq} from 'xtal-fetch/xtal-fetch-req.js';
import {XtalElement} from 'xtal-element/xtal-element.js';
import {define} from 'xtal-element/define.js';
import {createTemplate, newRenderContext} from 'xtal-element/utils.js';
import {decorate} from 'trans-render/decorate.js';
import {RuleMapping} from 'event-switch/event-switch.d.js';
import {newEventContext} from 'event-switch/event-switch.js';
const tsBug = [XtalFetchReq.is, PD.is, IfDiff.is, XtalSplit.is];
console.log(tsBug);
const mainTemplate = createTemplate(/* html */`
<!-- ================= Get Sample JSON with Tree Structure (File Directory), Pass to xtal-tree -->
<xtal-fetch-req fetch href="https://unpkg.com/xtal-tree@0.0.34/demo/directory.json" as="json"></xtal-fetch-req>
<!-- =================  Pass JSON object to xtal-tree for processing ========================= -->
<p-d on="fetch-complete" prop="nodes" val="target.value" m="1"></p-d>
<xtal-tree id="myTree"></xtal-tree>
<p-d on="viewable-nodes-changed" to="iron-list" prop="items" val="target.viewableNodes" m="1"></p-d>
    <p-d on="viewable-nodes-changed" to="iron-list" prop="newFirstVisibleIndex" val="target.firstVisibleIndex" m="1"></p-d>
    <!-- ==============  Styling of iron-list ================== -->
    <style>
      div.node {
        cursor: pointer;
      }

      span.match {
        font-weight: bold;
        background-color: yellowgreen;
      }

      span[data-has-children="1"][data-is-expanded="1"]::after{
        content: "📖";
      }

      span[data-has-children="1"][data-is-expanded="-1"]::after{
        content: "📕";
      }

      span[data-has-children="-1"]::after{
        content: "📝";
      }
    </style>
    <iron-list style="height:400px;overflow-x:hidden" id="nodeList" mutable-data p-d-if="p-d-r">
      <template>
        <div class="node" style$="[[item.style]]" p-d-if="p-d-r">
          <span node="[[item]]" p-d-if="p-d-r">
            <if-diff if="[[item.children]]" tag="hasChildren" m="1"></if-diff>
            <if-diff if="[[item.expanded]]" tag="isExpanded" m="1"></if-diff>
            <span data-has-children="-1" data-is-expanded="-1" node="[[item]]"></span>
          </span>
          <xtal-split node="[[item]]" text-content="[[item.name]]"></xtal-split>          
        </div>
      </template>
    </iron-list>   


`);
const nodeClickEvent = 'nodeClickEvent';
export class XtalTreeBasic extends XtalElement{
    static get is(){return 'xtal-tree-basic';}
    get mainTemplate(){
        return mainTemplate;
    }
    _renderContext = newRenderContext({
        [XtalTree.is]: ({target}) => decorate<XtalTree>(target as XtalTree, {
            childrenFn: node => (<any>node).children,
            isOpenFn: node => (<any>node).expanded,
            levelSetterFn: function (nodes, level) {
              nodes.forEach(node => {
                (<any>node).style = 'margin-left:' + (level * 12) + 'px';
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
        } as XtalTree),
        'iron-list': ({target}) => decorate<HTMLElement>(target as HTMLElement, {} as HTMLElement, {
          props: {
            newFirstVisibleIndex: -1,
          },
          on:{
            click: function(e){
              if(!(<any>e).target.node) return;
              const firstVisible = this.firstVisibleIndex;
              console.log('firstVisible = ' + firstVisible);
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
          }
        })
    });
    get renderContext(){
        return this._renderContext;
    }
    get ready(){return true;}
    _eventContext = newEventContext({
      nodeClickEvent:{
        // route:{
        //   'iron-list':{
        //     action: e =>{
        //       console.log(this)
        //     }
        //   }
        // },
        action: e =>{
          (this.root.querySelector(XtalTree.is) as XtalTree).toggledNode = (<any>e).detail.toggledNode;
        }
      }
    } as RuleMapping)
    get eventContext(){
        return this._eventContext;
    }
}
define(XtalTreeBasic);



