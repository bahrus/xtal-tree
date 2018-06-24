# \<xtal-tree\>

Provide flat, virtual snapshot of a tree

<!--
```
<custom-element-demo>
  <template>
  <script src="../node_modules/@webcomponents/webcomponentsjs/webcomponents-loader.js"></script>
  <script type="module">
    import "https://unpkg.com/@polymer/polymer@3.0.2/lib/elements/dom-if.js?module";
  </script>
  <script type="module" src="https://unpkg.com/@polymer/iron-list@3.0.0-pre.21/iron-list.js?module"></script>
  <script src="https://unpkg.com/xtal-splitting@0.0.1/xtal-splitting.js"></script>
  <script src="https://unpkg.com/p-d.p-u@0.0.21/p-d.p-d-x.p-u.js"></script>
  <script src="https://unpkg.com/xtal-fetch@0.0.34/xtal-fetch.js"></script>

  <script type="module" src="https://unpkg.com/xtal-tree@0.0.17/xtal-tree.js?module"></script>

      <script>
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
    <xtal-fetch fetch href="directory.json" as="json"></xtal-fetch>
    <p-d on="result-changed" to="#myTree{nodes}"></p-d>
    <script type="module ish">
      ({
        childrenFn: node => node.children,
        isOpenFn: node => node.expanded,
        levelSetterFn: levelSetter,
        toggleNodeFn: node => {
          node.expanded = !node.expanded;
        },
        testNodeFn: (node, search) =>{
          if(!node.nameLC) node.nameLC = node.name.toLowerCase();
          return node.nameLC.indexOf(search.toLowerCase()) > -1;
        },
        compareFn: (lhs, rhs) =>{
          if(lhs.name < rhs.name) return -1 ;
          if(lhs.name > rhs.name) return 1;
          return 0;
        }
      })
    </script>
    <p-d-x on="eval" to="{childrenFn:childrenFn;isOpenFn:isOpenFn;levelSetterFn:levelSetterFn;toggleNodeFn:toggleNodeFn;testNodeFn:testNodeFn;compareFn:compareFn}"></p-d-x>
    <xtal-tree id="myTree"></xtal-tree>
    <p-d on="viewable-nodes-changed" to="{items}"></p-d>
    <iron-list id="nodeList" mutable-data>
        <template>
          <div class="node"  style$="[[item.style]]">
            <span  node="[[item]]">
                <template is="dom-if" if="[[item.children]]">
                    <template is="dom-if" if="[[item.expanded]]">📖</template>
                    <template is="dom-if" if="[[!item.expanded]]">📕</template>
                  </template>
                  <template is="dom-if" if="[[!item.children]]">📝</template>
            </span>
            <p-u on="click" noinit to="/myTree{toggledNode:target.node}"></p-u>
            <span>
                <xtal-split node="[[item]]"  search="[[search]]" text-content="[[item.name]]"></xtal-split>
            </span>
            <p-u on="click" noinit to="/myTree{toggledNode:target.node}"></p-u>
          </div>
        </template>
      </iron-list>
  </template>
</custom-element-demo>
```
-->

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
