[![Published on webcomponents.org](https://img.shields.io/badge/webcomponents.org-published-blue.svg)](https://www.webcomponents.org/element/bahrus/xtal-tree)

<a href="https://nodei.co/npm/xtal-tree/"><img src="https://nodei.co/npm/xtal-tree.png"></a>

<img src="https://badgen.net/bundlephobia/minzip/xtal-tree">

# \<xtal-tree\>

Often we want to take advantage of a nice flat list generator component, like dom-repeat, or iron-list, but we want to use it to display and manipulate tree data.

This scenario seems to come up so frequently with various components, that this component strives to genericize that requirement.

**NB I** This component takes a JS / JSON - centric approach.  An alternative way of generating an expandable tree is to use [server side HTML rendering](https://bahrus.github.io/xtal-tree-deco/cdn.html), tapping into the power of the  details / summary element.  Some experiments with this approach have been done [here](https://github.com/bahrus/xtal-tree-deco), where similar support for expand all / search / sort is supported. This will tend to have smaller first paint / time to interactive times, if the tree starts out in collapsed mode.  However,as the amount of data increases, if you want to support expand all and global search capabilities, it may be better to use a virtual list combined with this JS-based component.

xtal-tree takes a "watcha-got?" approach to the data -- it allows the specific structure of the tree data to be pretty much anything, and passes no judgment on it.   It doesn't accidentally overwrite anything it shouldn't, without specific permission from the developer. The user of xtal-tree, i.e. the developer, then needs to train xtal-tree how to interpret the data -- how to get the children, how to represent an open node vs a closed node, etc.

xtal-tree also takes a "whatcha-want?" approach to what is displayed.  You can display the data as a classic tree, or as a treegrid, or as any other way you want.  The only assumption xtal-tree makes is that you want to build the display from a flat list generator, like dom-repeat, iron-list, or a flat grid.  

Think of xtal-tree as a reusable "View Model" component.  

Because xtal-tree is non-committal as far as the structure of JSON it expects, it needs to be "trained" to handle a specific data format.  One way this can be done by extending xtal-tree, and specifying some data query functions.  For example:


```TypeScript
export class XtalTreeSampleStruct extends XtalTree{
    static get is(){return 'xtal-tree-sample-struct';}
    constructor(){
        super();
        this.childrenFn = node => (<any>node).children;
        this.isOpenFn = node => (<any>node).expanded;
        this.levelSetterFn = function(nodes, level) {
          nodes.forEach(node => {
            (<any>node).level = level;
            (<any>node).style = "margin-left:" + level * 18 + "px";
            if ((<any>node).children)
              this.levelSetterFn((<any>node).children, level + 1);
          });
        };
        this.toggleNodeFn =  node => {
          (<any>node).expanded = !(<any>node).expanded;
        };
        this.testNodeFn = (node, search) => {
          if (!search) return true;
          if (!(<any>node).nameLC)
            (<any>node).nameLC = (<any>node).name.toLowerCase();
          return (<any>node).nameLC.indexOf(search.toLowerCase()) > -1;
        };
        this.compareFn = (lhs, rhs) => {
          if ((<any>lhs).name < (<any>rhs).name) return -1;
          if ((<any>lhs).name > (<any>rhs).name) return 1;
          return 0;
        };
    }
}
```

In the demo below, we use our own [light-weight virtual list web component wrapper](https://github.com/bahrus/xtal-vlist) around [this js-fiddle](https://jsfiddle.net/jpeter06/ao464o8g/).

**NB II**  This virtual list is not yet outfitted with support for tabbing, as one gets for free with details/summary.

[Demo](https://jsfiddle.net/bahrus/y8moqgrb/)

<!--
```
<custom-element-demo>
  <template>
  <div>
    <!--   Expand All / Collapse All / Sort  / Search Buttons -->
    <button disabled data-expand-cmd=allExpandedNodes>Expand All</button>
    <!-- pass down (p-d) expand/collapse command to xtal-tree-sample-struct -->
    <p-d on=click to=[-expandCmd]  val=target.dataset.expandCmd m=1 skip-init></p-d>
    <button disabled data-expand-cmd=allCollapsedNodes>Collapse All</button>
    <p-d on=click to=[-expandCmd]  val=target.dataset.expandCmd m=1 skip-init></p-d>
    <button disabled data-dir="asc">Sort Asc</button>
    <p-d on=click to=[-sorted] val=target.dataset.dir m=1 skip-init></p-d>
    <button disabled data-dir="desc">Sort Desc</button>
    <p-d on=click to=[-sorted] val=target.dataset.dir m=1 skip-init></p-d>
    <input disabled=2 type=text placeholder=Search>
    <p-d on=input to=[-search] val=target.value m=1 skip-init></p-d>
    <p-d on=input to=[-searchString] val=target.value m=1 skip-init></p-d>
    <!-- ================= Get Sample JSON with Tree Structure (File Directory), Pass to xtal-tree-sample-structure -->
    <xtal-fetch-req fetch href="https://unpkg.com/xtal-tree@0.0.34/demo/directory.json" as=json></xtal-fetch-req>
    <!-- =================  Pass JSON object to xtal-tree for processing ========================= -->
    <p-d on=fetch-complete prop=nodes val=target.value m=1></p-d>
    <xtal-tree-sample-struct -expandCmd -sorted -searchString id=myTree></xtal-tree-sample-struct>
    <p-d on=viewable-nodes-changed to=[-items]  val=target.viewableNodes m=1 skip-init></p-d>
    <xtal-tree-sample-struct-vlist -items -search></xtal-tree-sample-struct-vlist>
    <!-- pass up (p-u) to tree view model when node is toggled -->
    <p-u on=selectedNode-changed to=myTree prop=toggledNode val=target.selectedNode></p-u>
    <!-- ==============  Styling of virtual list ================== -->
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
        content: '\25BE';
        font-size: 1.6em;
      }

      span[data-has-children],span[data-no-children]{
        width:26px;
      }
      span[data-has-children="-1"],span[data-no-children="-1"]{
        visibility:hidden;
      }

      span[data-has-children="1"][data-is-expanded="-1"]::after{
        content: '\25B8';
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
    <script type=module src="https://unpkg.com/p-et-alia@0.0.11/p-d.js?module"></script>
    <script type=module src="https://unpkg.com/p-et-alia@0.0.11/p-u.js?module"></script>
    <script type=module src="https://unpkg.com/if-diff@0.0.35/if-diff.js?module"></script>
    <script type=module src="https://unpkg.com/xtal-fetch@0.0.72/xtal-fetch-req.js?module"></script>
    <script type=module src="https://unpkg.com/xtal-tree@0.0.68/xtal-tree-sample-struct.js?module"></script>
    <script type=module src="https://unpkg.com/xtal-tree@0.0.68/xtal-tree-sample-struct-vlist.js?module"></script>

  </div>
  </template>
</custom-element-demo>
```
-->

## Viewing This Element Locally

```
$ npm install
$ npm run serve
```

