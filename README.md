[![Published on webcomponents.org](https://img.shields.io/badge/webcomponents.org-published-blue.svg)](https://www.webcomponents.org/element/bahrus/xtal-tree)

# \<xtal-tree\>

<!--
```
<custom-element-demo style="height:600px">
  <template>
    
    <script src="https://cdn.jsdelivr.net/npm/xtal-fetch@0.0.20/build/ES6/xtal-fetch.js"></script>
    <script async src="https://cdn.jsdelivr.net/npm/xtal-decorator@0.0.12/build/ES6/xtal-decorator.js"></script>
    <script src="xtal-tree.js"></script>
    <script src="xtal-split.js"></script>
    <script src="xtal-cascade.js"></script>
    <link rel="import" href="../polymer/polymer-element.html">
    <link rel="import" href="../polymer/lib/elements/dom-bind.html">
    <link rel="import" href="../polymer/lib/elements/dom-if.html">
    <link rel="import" href="../vaadin-checkbox/vaadin-checkbox.html">
    <link rel="import" href="../iron-list/iron-list.html">
            <xtal-decorator>
          <script type="text/ecmascript ish">
            [{
              polymerProperties:{
                // Define how xtal-tree should define an open or expanded node
                isOpenFn:{
                    type: Function,
                    value: function(node){
                      return node.expanded;
                    }
                },
                // Specify how to get the children of a node.
                childrenFn:{
                  type: Function,
                  value: function(node){
                    return node.children;
                  }
                },
                // Define how to toggle nodes between open/expanded vs closed/minimized.
                toggleNodeFn:{
                  type: Function,
                  value: function(node){
                    node.expanded = !node.expanded;
                  }
                },
                // Optional -- useful if child nodes should be indented 
                levelSetterFn:{
                  type: Function,
                  value: function(nodes, level){
                    nodes.forEach(node => {
                      node.style = 'margin-left:' + (level * 12) + 'px';
                      if(node.children) this.levelSetterFn(node.children, level + 1)
                    })
                  }
                },
                //  Advanced -- this is only needed for search support
                testNodeFn:{
                  type: Function,
                  value: function(node, search){
                    if(!node.nameLC) node.nameLC = node.name.toLowerCase();
                    return node.nameLC.indexOf(search.toLowerCase()) > -1;
                  }
                },
                //  Advanced -- this is only neeeded for sorting support.
                //  The search is case sensitive.  To make it case sensitive, do something
                //  similar to what was done for search above.
                compareFn:{
                  type: Function,
                  value: function(lhs, rhs){
                    
                    if(lhs.name < rhs.name) return -1 ;
                    if(lhs.name > rhs.name) return 1;
                    return 0;
                  }
                },
                /////////////////   Super Advanced -- this is only needed for Cascading selected nodes
                //  This is needed for quick traversal of the tree.
                keyFn:{
                  type: Function,
                  value: function(node){
                    return node.path;
                  }
                },
                //  This being true should be mutually exclusive with isIndeterminateFn evaluating to true.
                isSelectedFn:{
                  type: Function,
                  value: function(node){
                    return node.isSelected;
                  }
                },
                //  This being true should be mutually exclusive with isSelectedFn being true.
                isIndeterminateFn:{
                  type: Function,
                  value: function(node){
                    return node.isIndeterminate;
                  }
                },
                //  Users will cause this function to be called directly on the node they click
                toggleNodeSelectionFn:{
                  type: Function,
                  value: function(node){
                    node.isSelected = !node.isSelected;
                  }
                },
                //  This will only be called by the cascading logic.
                toggleIndeterminateFn:{
                  type: Function,
                  value: function(node){
                    node.isIndeterminate = !node.isIndeterminate;
                  }
                }

              },
              ////////////////////  Event handlers
              toggleExpandedNode(e){
                const target = e.target || e.srcElement;
                let node = target.node;
                if(!node) node = target.parentNode.node;
                const fvi = this.$.nodeList.firstVisibleIndex;
                this.$.myTree.toggledNode = node;
                this.$.nodeList.scrollToIndex(fvi);
                //this.$.nodeList.scrollToItem(node); //TODO use index
              },
              toggleSelectedNode(e){
                const target = e.target || e.srcElement;
                let node = target.selectNode;
                if(!node) node=target.parentNode.selectNode;
                const fvi = this.$.nodeList.firstVisibleIndex;
                this.$.myCascade.toggledNodeSelection = node;
                this.$.nodeList.items = this.$.nodeList.items.slice(0);
                this.$.nodeList.scrollToIndex(fvi);
              },
              expandAll(e){
                this.$.myTree.allExpandedNodes = this.$.myTree.viewableNodes;
              },
              collapseAll(e){
                this.$.myTree.allCollapsedNodes = this.$.myTree.viewableNodes;
              },
              sortAsc(e){
                this.$.myTree.sorted = 'asc';
              },
              sortDesc(e){
                this.$.myTree.sorted = 'desc'
              }
            }]
          </script>
        </xtal-decorator>
        <dom-bind>
          <template>
            <style>
              div.node {
                cursor: pointer;
              }

              span.match {
                font-weight: bold;
                background-color: yellow;
              }

              iron-list {
                height: 50vh;
                /* don't use % values unless the parent element is sized. */
              }
            </style>
            <xtal-fetch fetch href="demo/directory.json" as="json" result="{{directory}}"></xtal-fetch>
            <xtal-tree id="myTree" is-open-fn="[[isOpenFn]]" children-fn="[[childrenFn]]" level-setter-fn="[[levelSetterFn]]" test-node-fn="[[testNodeFn]]"
              toggle-node-fn="[[toggleNodeFn]]" compare-fn="[[compareFn]]" nodes="[[directory]]" search-string="[[search]]"
              viewable-nodes="{{viewableNodes}}">
            </xtal-tree>
            <xtal-cascade id="myCascade" key-fn="[[keyFn]]" 
              is-open-fn="[[isOpenFn]]" children-fn="[[childrenFn]]" nodes="[[directory]]" 
              is-selected-fn="[[isSelectedFn]]" is-indeterminate-fn="[[isIndeterminateFn]]"
              toggle-node-selection-fn="[[toggleNodeSelectionFn]]" 
              toggle-indeterminate-fn="[[toggleIndeterminateFn]]"
              selected-root-nodes="{{selectedRootNodes}}"
            >
            </xtal-cascade>
            <div>Click on Nodes below to toggle open / closed.</div>
            <br>
            <input type="text" value="{{search::input}}" placeholder="Search">
            <button on-click="expandAll">Expand All</button>
            <button on-click="collapseAll">Collapse All</button>
            <button on-click="sortAsc">Sort Asc</button>
            <button on-click="sortDesc">Sort Desc</button>
            <p></p>
            <iron-list id="nodeList" items="[[viewableNodes]]" mutable-data>
              <template>
                <div class="node"  style$="[[item.style]]">
                  <span on-click="toggleExpandedNode" node="[[item]]">
                      <template is="dom-if" if="[[item.children]]">
                          <template is="dom-if" if="[[item.expanded]]">📖</template>
                          <template is="dom-if" if="[[!item.expanded]]">📕</template>
                        </template>
                        <template is="dom-if" if="[[!item.children]]">📝</template>
                  </span>
                  <span on-click="toggleSelectedNode" select-node="[[item]]">
                      <vaadin-checkbox checked="[[item.isSelected]]" indeterminate="[[item.isIndeterminate]]"></vaadin-checkbox>
                      <xtal-split search="[[search]]" text-content="[[item.name]]"></xtal-split>
                  </span>

                </div>
              </template>
            </iron-list>

            <h2>Root Selected Nodes:</h2>

            <iron-list  items="[[selectedRootNodes]]" mutable-data>
              <template>
                <div>[[item.path]]</div>
              </template>
            </iron-list>

          </template>
        </dom-bind>
        </template>
</custom-element-demo>
```
-->

\<xtal-tree\> is a dependency free web component that provides  a flat, virtual snapshot of a tree.  It is ~1kb, gzipped and minified.

Often we want to take advantage of a nice flat list generator component, like dom-repeat, or iron-list, but we want to use it to display and manipulate tree data.

This scenario seems to come up so frequently with various components, that this component strives to genericize that requirement.

xtal-tree takes a "watcha-got?" approach to the data -- it allows the specific structure of the tree data to be pretty much anything, and passes no judgment on it.   It doesn't accidentally overwrite anything it shouldn't, without specific permission from the developer. The user of xtal-tree, i.e. the developer, then needs to train xtal-tree how to interpret the data -- how to get the children, how to represent an open node vs a closed node, etc.

xtal-tree also takes a "whatcha-want?" approach to what is displayed.  You can display the data as a classic tree, or as a treegrid, or as any other way you want.  The only assumption xtal-tree makes is that you want to build the display from a flat list generator, like dom-repeat, iron-list, or a flat grid.  

Think of xtal-tree as a reusable "View Model" component.

The markup xtal-tree expects looks like this:

```html
    <xtal-tree 
        is-open-fn="[[isOpenFn]]" 
        children-fn = "[[childrenFn]]" 
        toggle-node-fn="[[toggleNodeFn]]"
        level-setter-fn="[[levelSetterFn]]"
        test-node-fn="[[testNodeFn]]"
        nodes="[[directory]]"
        search-string="[[search]]"
        viewable-nodes="{{viewableNodes}}"
    >
    </xtal-tree>
```

The properties required to show a tree are isOpenFn, childrenFn and nodes (that has the actual data).   The viewableNodes property / change event tells other components what flat array of nodes need to display and in what order, and the list changes as nodes are opened / closed, searched, sorted.

Let's illustrate via the code used in the demo.  For the demo, we want to display the names of the folders of a typical bower_components directory.

The structure of the file looks as follows:

```JSON
[
  {
    "path": "./bower_components",
    "name": "bower_components",
    "children": [
      {
        "path": "bower_components/accessibility-developer-tools",
        "name": "accessibility-developer-tools",
        "children": [
            {"etc": "etc"}
        ]
      }
    ]
  }
]
```

(Note:  This example and file was generated by a member of the Vaadin team.)

So now as a consumer of xtal-tree, we need to define custom functions to help interpret this data:

```JavaScript
    isOpenFn: function(node){
        return node.expanded;
    },
    childrenFn: function(node){
        return node.children;
    },
    toggleNodeFn:function(node){
        node.expanded = !node.expanded;
    },
```

These functions need to be passed to the xtal-tree instance, so it can recreate the flat list as users expand / collapse nodes. 

To specify a node needs to be toggled (opened / closed), you can pass it declaratively or programmatically.  Here we show it done programmatically:

```JavaScript
this.$.myTree.toggledNode = node;   
```

The toggleNodeFn property is an optional function property that allows one to add a toggle ability to the tree.  Applying the toggleNodeFn repeatedly to a node should cause the isOpenFn function to toggle between true and false when applied to the same node. 

### Other properties  

The levelSetterFn property is an optional function property that, if provided, then xtal-tree will apply markers to all the nodes, so the flat list generator can show indendation (for example).

The test-node-fn property is also an optional function property that allows a search of the tree to be done, based on the value of searchString.

The compare-fn property is also an optional function property that specifies how to compare two nodes, for sorting purposes.  The sorted property, not shown in the markup above, indicates whether the sort should be ascending ('asc') or descending ('desc').

With respect to the search, this github repo contains another web component, xtal-split, which is a ~500 byte dependency free web component that will split text into regions (spans) matching a search string.  Those spans can be styled to highlight the text that matches the search.

### Super Advanced

Sometimes we want our tree to support node selection, following an assumption that the state of a parent reflects the aggregation of all its children.  This is a particularly complex requirement.  What makes this feature significantly more complex than a simple expandable/collapsible tree, is that for node selection, we need three states to track - selected, unselected, and indeterminate.

If all of a nodes's children are selected, that is assumed to be logically equivalent to the parent being selected.  If none of the children are selected, then the parent is assumed to not be selected.  If some children are selected, but not others, then the parent goes into the indeterminate state.  Users can only select or unselect nodes, but the side effects of that choice will cascade up and down the tree.

This is where the 1k (gzipped and minified) dependency free web component xtal-cascade fits in.  Because we now have three states, we need the developer to specify two toggle functions, rather than one.  The markup looks as follows in the demo:

```html
    <xtal-cascade id="myCascade" key-fn="[[keyFn]]" 
        is-open-fn="[[isOpenFn]]" children-fn="[[childrenFn]]" nodes="[[directory]]" 
        is-selected-fn="[[isSelectedFn]]" is-indeterminate-fn="[[isIndeterminateFn]]"
        toggle-node-selection-fn="[[toggleNodeSelectionFn]]" 
        toggle-indeterminate-fn="[[toggleIndeterminateFn]]"
        selected-root-nodes="{{selectedRootNodes}}"
    >
    </xtal-cascade>
```

Recall that the "output" of xtal-tree,"viewable-nodes," is the array of "viewableNodes" which will tend to be quite large.

On the other hand, here the "output" of the xtal-cascade component is:  "selected-root-nodes," which provides the smallest set of nodes that indicate what nodes are selected.  Since all the children of a selected node are selected for logical consistencies, there is no need to include them because that would be redundant.

## Install the Polymer-CLI

First, make sure you have the [Polymer CLI](https://www.npmjs.com/package/polymer-cli) installed. Then run `polymer serve` to serve your element locally.

## Viewing Your Element

```
$ polymer serve
```

## Running Tests

```
$ polymer test
```

Your application is already set up to be tested via [web-component-tester](https://github.com/Polymer/web-component-tester). Run `polymer test` to run your application's test suite locally.
