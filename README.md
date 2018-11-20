[![Published on webcomponents.org](https://img.shields.io/badge/webcomponents.org-published-blue.svg)](https://www.webcomponents.org/element/bahrus/xtal-tree)

<a href="https://nodei.co/npm/xtal-tree/"><img src="https://nodei.co/npm/xtal-tree.png"></a>

<img src="http://img.badgesize.io/https://unpkg.com/xtal-tree@0.0.34/build/ES6/xtal-tree.iife.js?compression=gzip">

# \<xtal-tree\>

Provide flat, virtual snapshot of a tree.  xtal-tree.js is ~1.5kb minified / gzipped.

<!--
```
<custom-element-demo>
  <template>
  <div>
  
    <xtal-state-watch watch level="global"></xtal-state-watch>
    <p-d on="history-changed" to="xtal-tree" prop="firstVisibleIndex" val="target.history.firstVisibleIndex"></p-d>
    <h3>Basic xtal-tree demo</h3>
   
    <!--   Expand All / Collapse All / Sort  / Search Buttons -->
    
    <button disabled data-expand-cmd="allExpandedNodes">Expand All</button>
    <p-d on="click" to="xtal-tree" prop="expandCmd" val="target.dataset.expandCmd" m="1" skip-init></p-d>
    <button disabled data-expand-cmd="allCollapsedNodes">Collapse All</button>
    <p-d on="click" to="xtal-tree" prop="expandCmd" val="target.dataset.expandCmd" m="1" skip-init></p-d>
    <button disabled data-dir="asc">Sort Asc</button>
    <p-d on="click" to="xtal-tree" prop="sorted" val="target.dataset.dir" m="1" skip-init></p-d>
    <button disabled data-dir="desc">Sort Desc</button>
    <p-d on="click" to="xtal-tree" prop="sorted" val="target.dataset.dir" m="1" skip-init></p-d>
    <input disabled type="text" placeholder="Search">
    <p-d-r on="input" to="xtal-split" prop="search" val="target.value"></p-d-r>
    <p-d on="input" to="xtal-tree" prop="searchString" val="target.value"></p-d>

    <!-- ================= Get Sample JSON with Tree Structure (File Directory), Pass to xtal-tree -->
    <xtal-fetch fetch href="https://unpkg.com/xtal-tree@0.0.34/demo/directory.json" as="json"></xtal-fetch>
    <!-- =================  Pass JSON object to xtal-tree for processing ========================= -->
    <p-d on="fetch-complete" to="xtal-tree" prop="nodes" val="target.value" m="1"></p-d>

    <!-- ================= Train xtal-tree how to expand / collapse nodes ========================= -->
    <xtal-deco>
      <script nomodule>
        ({
          childrenFn: node => node.children,
          isOpenFn: node => node.expanded,
          levelSetterFn: function (nodes, level) {
            nodes.forEach(node => {
              node.style = 'margin-left:' + (level * 12) + 'px';
              if (node.children) this.levelSetterFn(node.children, level + 1)
            })
          },
          toggleNodeFn: node => {
            node.expanded = !node.expanded;
          },
          testNodeFn: (node, search) => {
            if (!search) return true;
            if (!node.nameLC) node.nameLC = node.name.toLowerCase();
            return node.nameLC.indexOf(search.toLowerCase()) > -1;
          },
          compareFn: (lhs, rhs) => {
            if (lhs.name < rhs.name) return -1;
            if (lhs.name > rhs.name) return 1;
            return 0;
          },
          props:{
              expandCmd: '',
              fistVisibleIndex: -1
            },
            onPropsChange(name, newVal){
              switch(name){
                case 'expandCmd':
                  this[this.expandCmd] = this.viewableNodes;
                  break;
                  
              }
            }
        })
      </script>
    </xtal-deco>
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
    
    <xtal-deco><script nomodule>
      ({
        props: {
          newFirstVisibleIndex: -1,
        },
        onPropsChange: function (name, newVal) {
          switch (name) {
            case 'newFirstVisibleIndex':
              if(!this.items || this.newFirstVisibleIndex < 0) return;
              this.scrollToIndex(this.newFirstVisibleIndex);
          }
        }
      })
    </script></xtal-deco>
    <iron-list style="height:400px;overflow-x:hidden" id="nodeList" mutable-data p-d-if="p-d-r">
      <template>
        <div class="node" style$="[[item.style]]" p-d-if="p-d-r">
          <span node="[[item]]" p-d-if="p-d-r">
            <if-diff if="[[item.children]]" tag="hasChildren" m="1"></if-diff>
            <if-diff if="[[item.expanded]]" tag="isExpanded" m="1"></if-diff>
            <span data-has-children="-1" data-is-expanded="-1" node="[[item]]"></span>
          </span>
          <p-u on="click" to="myTree" prop="toggledNode" val="target.node" skip-init></p-u>
          <xtal-split node="[[item]]" text-content="[[item.name]]"></xtal-split>
          <p-u on="click" to="myTree" prop="toggledNode" val="target.node" skip-init></p-u>
          
        </div>
      </template>
    </iron-list>
    <p-d on="scroll" to="xtal-state-commit" prop="history" val="target.firstVisibleIndex"></p-d>
    <xtal-state-commit level="global" rewrite href="/scroll" with-path="firstVisibleIndex"></xtal-state-commit>
    <!-- Polyfill for retro browsers -->
    <script src="https://cdn.jsdelivr.net/npm/@webcomponents/webcomponentsjs/webcomponents-loader.js"></script>
    <!-- End Polyfill for retro browsers -->

    <!-- Polymer Elements -->
    <script type="module" src="https://unpkg.com/@polymer/iron-list@3.0.1/iron-list.js?module"></script>
    <!-- End Polymer Elements -->

    <script type="module" src="https://cdn.jsdelivr.net/npm/xtal-splitting@0.0.8/xtal-splitting.js"></script>
    <script type="module" src="https://cdn.jsdelivr.net/npm/xtal-fetch@0.0.52/xtal-fetch.js"></script>
    <script type="module" src="https://cdn.jsdelivr.net/npm/xtal-decorator@0.0.27/xtal-decorator.iife.js"></script>
    <script type="module" src="https://cdn.jsdelivr.net/npm/xtal-tree@0.0.38/xtal-tree.iife.js"></script>
    <script type="module" src="https://cdn.jsdelivr.net/npm/xtal-state@0.0.42/xtal-state.js"></script>
    <script type="module" src="https://cdn.jsdelivr.net/npm/purr-sist@0.0.13/purr-sist.iife.js"></script>
    <script type="module" src="https://cdn.jsdelivr.net/npm/if-diff@0.0.11/if-diff.iife.js"></script>
    <script type="module" src="https://cdn.jsdelivr.net/npm/p-d.p-u@0.0.79/dist/p-all.iife.js"></script>
  </div>
  </template>
</custom-element-demo>
```
-->

Often we want to take advantage of a nice flat list generator component, like dom-repeat, or iron-list, but we want to use it to display and manipulate tree data.

This scenario seems to come up so frequently with various components, that this component strives to genericize that requirement.

xtal-tree takes a "watcha-got?" approach to the data -- it allows the specific structure of the tree data to be pretty much anything, and passes no judgment on it.   It doesn't accidentally overwrite anything it shouldn't, without specific permission from the developer. The user of xtal-tree, i.e. the developer, then needs to train xtal-tree how to interpret the data -- how to get the children, how to represent an open node vs a closed node, etc.

xtal-tree also takes a "whatcha-want?" approach to what is displayed.  You can display the data as a classic tree, or as a treegrid, or as any other way you want.  The only assumption xtal-tree makes is that you want to build the display from a flat list generator, like dom-repeat, iron-list, or a flat grid.  

Think of xtal-tree as a reusable "View Model" component.


## Install the Polymer-CLI

First, make sure you have the [Polymer CLI](https://www.npmjs.com/package/polymer-cli) and npm (packaged with [Node.js](https://nodejs.org)) installed. Run `npm install` to install your element's dependencies, then run `polymer serve` to serve your element locally.

## Viewing Your Element

```
$ polymer serve
```

## Running Tests

```
$ polymer test
```

Your application is already set up to be tested via [web-component-tester](https://github.com/Polymer/web-component-tester). Run `polymer test` to run your application's test suite locally.
