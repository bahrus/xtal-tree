[![Published on webcomponents.org](https://img.shields.io/badge/webcomponents.org-published-blue.svg)](https://www.webcomponents.org/element/bahrus/xtal-tree)

<a href="https://nodei.co/npm/xtal-tree/"><img src="https://nodei.co/npm/xtal-tree.png"></a>

[![Actions Status](https://github.com/bahrus/xtal-tree/workflows/CI/badge.svg)](https://github.com/bahrus/xtal-tree/actions?query=workflow%3ACI)

# \<xtal-tree\>

[Demo](https://codepen.io/bahrus/pen/GROLwBV)

Often we want to take advantage of a nice flat list generator component, like dom-repeat, or iron-list, but we want to use it to display and manipulate hierarchical tree data.

This scenario seems to come up so frequently with various components, that this component strives to genericize that requirement.

**NB I** This component takes a JS / JSON - centric approach.  An alternative way of generating an expandable tree is to use [server side HTML rendering or static site generation](https://bahrus.github.io/xtal-tree-deco/cdn.html), tapping into the power of the  details / summary element.  Some experiments with this approach have been done [here](https://github.com/bahrus/xtal-tree-deco), where similar support for expand all / search / sort is supported. In fact, the search capability is better with this approach.  This will tend to have smaller first paint / time to interactive times, if the tree starts out in collapsed mode.  However,as the amount of data increases, if you want to support expand all and global search capabilities, it may be better to use a virtual list combined with this JS-based component.

For simplicity and better performance, xtal-tree does make some assumptions about the structure of the data.  It assumes each node has the following fields (some of which are optional):

```TypeScript
export interface ITreeNode{
    children?: ITreeNode[];
    name: string;
    path: string;
    value: any;
    asString?: string;
    type: string;
    parent?: ITreeNode;
    open?: boolean;
}
```

Some of the properties are computed dynamically by the component.  This can result in adding unexpected properties to a user-defined data structure.  To avoid this, set property "clone" to true.

Think of xtal-tree as a reusable "View Model" component.  

xtal-tree also provides an option to turn any object graph JSON structure, and turn it into a regular tree structure that can be rendered quickly using a virtual list.


## Viewing This Element Locally

```
$ npm install
$ npm run serve
```

