[![Published on webcomponents.org](https://img.shields.io/badge/webcomponents.org-published-blue.svg)](https://www.webcomponents.org/element/bahrus/xtal-tree)

# \<xtal-tree\>

\<xtal-tree\> is a dependency free web component that provides  a flat, virtual snapshot of a tree.

Often when working with a flat list generator, like dom-repeat, or iron-list, we want to take advantage of the nice component, but display tree data.

This scenario seems to come up so frequently with various components, that this component strives to genericize that requirement.

The markup looks as follows (for the simple dom-repeat element)

```html
    <xtal-tree id="myTree"
        is-open-fn="[[isOpenFn]]" 
        key-fn="[[keyFn]]" 
        children-fn = "[[childrenFn]]" 
        nodes="[[directory]]"
        toggle-node-fn="[[toggleNodeFn]]"
        viewable-nodes="{{viewableNodes}}"
    >
    </xtal-tree>
    <div>Click on Nodes below to toggle open / closed.</div><br>
    <template is="dom-repeat" items="[[viewableNodes]]">
        <div node="[[item]]" on-click="toggleNode">[[item.name]]</div>
    </template>
```

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
