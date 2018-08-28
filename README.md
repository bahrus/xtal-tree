[![Published on webcomponents.org](https://img.shields.io/badge/webcomponents.org-published-blue.svg)](https://www.webcomponents.org/element/bahrus/xtal-tree)

<a href="https://nodei.co/npm/xtal-tree/"><img src="https://nodei.co/npm/xtal-tree.png"></a>

# \<xtal-tree\>

Provide flat, virtual snapshot of a tree.  xtal-tree.js is ~1.4kb minified / gzipped.

<!--
```
<custom-element-demo>
  <template>
  <div>
    <!-- Polyfill for re(dge)tro browsers -->
    <script src="https://unpkg.com/@webcomponents/webcomponentsjs/webcomponents-loader.js"></script>
    <!-- Polyfill for re(dge)tro browsers -->

    <!-- Polymer Elements -->
    <script type="module" src="https://unpkg.com/@polymer/polymer@3.0.5/lib/elements/dom-if.js?module"></script>
    <script type="module" src="https://unpkg.com/@polymer/iron-list@3.0.0-pre.21/iron-list.js?module"></script>
    <!-- End Polyer Elements -->

    <script src="https://unpkg.com/xtal-splitting@0.0.7/xtal-splitting.js"></script>
    <script src="https://unpkg.com/p-d.p-u@0.0.67/p-d.p-d-x.p-u.js"></script>
    <script src="https://unpkg.com/xtal-fetch@0.0.40/xtal-fetch.js"></script>
    <script src="https://unpkg.com/xtal-decorator@0.0.20/xtal-decorator.iife.js"></script>
    <script type="module" src="https://unpkg.com/xtal-tree@0.0.34/xtal-tree.iife.js"></script>
    <h3>Basic xtal-tree demo</h3>
    <script>
      var fvi = -1;
      function levelSetter(nodes, level) {
        nodes.forEach(node => {
          node.style = 'margin-left:' + (level * 12) + 'px';
          if (node.children) levelSetter(node.children, level + 1)
        })
      }
    </script>
    <style>
      div.node {
        cursor: pointer;
      }

      span.match {
        font-weight: bold;
        background-color: yellowgreen;
      }
    </style>
    <xtal-deco>
      <script nomodule>
      ({
        on:{
          'click': function(e){
            myTree[e.target.dataset.nodes] = myTree.viewableNodes;
          }
        }
      })
    </script>
    </xtal-deco>
    <span>
        <button data-nodes="allExpandedNodes" >Expand All</button>
        <button data-nodes="allCollapsedNodes">Collapse All</button>
    </span>
    
    <button data-dir="asc">Sort Asc</button>
    <p-d on="click" if="button" to="#myTree{sorted:target.dataset.dir}"></p-d>
    <button data-dir="desc">Sort Desc</button>
    <p-d on="click" if="button" to="#myTree{sorted:target.dataset.dir}"></p-d>
    <input type="text" placeholder="Search">
    <p-d id="searchProp" on="input" to="xtal-split{search}"></p-d>
    <p-d on="input" to="#myTree{searchString}"></p-d>
    <xtal-fetch fetch href="https://unpkg.com/xtal-tree@0.0.34/demo/directory.json" as="json"></xtal-fetch>
    <p-d on="result-changed" to="#myTree{nodes}" m="1"></p-d>
    <xtal-deco>
      <script nomodule>
        ({
          childrenFn: node => node.children,
          isOpenFn: node => node.expanded,
          levelSetterFn: levelSetter,
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
          }
        })
      </script>
    </xtal-deco>
    <xtal-tree id="myTree"></xtal-tree>
    <p-d on="viewable-nodes-changed" to="iron-list{items};#viewNodesChangeHandler{input}"></p-d>
    <p-d on="toggled-node-changed" to="#toggledNodeChangeHandler{input}"></p-d>
    <iron-list style="height:400px" id="nodeList" mutable-data p-d-if="#searchProp">
      <template>
        <div class="node" style$="[[item.style]]" p-d-if="#searchProp">
          <span node="[[item]]">
            <template is="dom-if" if="[[item.children]]">
              <template is="dom-if" if="[[item.expanded]]">📖</template>
              <template is="dom-if" if="[[!item.expanded]]">📕</template>
            </template>
            <template is="dom-if" if="[[!item.children]]">📝</template>
          </span>
          <p-u on="click" if="span" to="/myTree{toggledNode:target.node}"></p-u>
          <xtal-split node="[[item]]" search="[[search]]" text-content="[[item.name]]"></xtal-split>
          <p-u on="click" if="xtal-split" to="/myTree{toggledNode:target.node}"></p-u>
        </div>
      </template>
    </iron-list>
    <script type="module ish">
        inp => {
          if(typeof(fvi) !== 'undefined' && fvi > -1){
            nodeList.scrollToIndex(fvi);
          }
        }
      </script>
    <p-d id="viewNodesChangeHandler" on="eval" to="{whoknows}"></p-d>
    <script type="module ish">
        inp =>{
          fvi = nodeList.firstVisibleIndex;
        }
      </script>
    <p-d id="toggledNodeChangeHandler" on="eval" to="{whoknows}"></p-d>
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
