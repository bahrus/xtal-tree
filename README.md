[![Published on webcomponents.org](https://img.shields.io/badge/webcomponents.org-published-blue.svg)](https://www.webcomponents.org/element/bahrus/xtal-tree)

# \<xtal-tree\>

\<xtal-tree\> is a dependency free web component that provides  a flat, virtual snapshot of a tree.

Often when working with a flat list generator, like dom-repeat, or iron-list, we want to take advantage of the nice component, but display tree data.

This scenario seems to come up so frequently with various components, that this component strives to genericize that requirement.

xtal-tree takes a "watcha-got?" approach to the data -- it allows the specific structure of the tree data to be pretty much anything, and passes no judgement on it.   It doesn't accidentally overwrite anything it shouldn't, without specific permission from the developer. The user of xtal-tree, ie the developer, then needs to train xtal-tree how to interpret the data -- how to get the children, how to represent an open node vs a closed node, etc.

xtal-tree also takes a "whatcha-want?" approach to what is displayed.  You can display the data as a classic tree, or as a treegrid, or as any other way you want.  The only assumption xtal-tree makes is that you want to build the display from a flat list generator, like dom-repeat, iron-list, or a flat grid.  

Think of xtal-tree is a reusable "View Model" component.

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

The properties required to show a tree are isOpenFn, childrenFn and nodes (that has the actual data).   The viewableNodes property / change event tells other components what nodes need to display and in what order, and changes as nodes are opened / closed, searchedd, sorted.

The toggleNodeFn property is an optional function property that allows one to add a toggle ability to the tree.  Applying the toggleNodeFn repeatedly to a node should cause the isOpenFn function to toggle between true and false when applied to the same node.   

The levelSetterFn property is an optional function property that, if provided, then xtal-tree will apply markers to all the nodes, so the flat list generator can show indendation (for example).

The test-node-fn property is also an optional function property that allows a search of the tree to be done, based on the value of searchString.

The compare-fn property is also an optional function property that specifies how to compare two nodes, for sorting purposes.  The sorted property, not shown in the markup above, indicates whether the sort should be ascending ('asc') or descending ('desc').

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
