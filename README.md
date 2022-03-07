[![Published on webcomponents.org](https://img.shields.io/badge/webcomponents.org-published-blue.svg)](https://www.webcomponents.org/element/bahrus/xtal-tree)

<a href="https://nodei.co/npm/xtal-tree/"><img src="https://nodei.co/npm/xtal-tree.png"></a>

<img src="https://badgen.net/bundlephobia/minzip/xtal-tree">

# \<xtal-tree\>

Often we want to take advantage of a nice flat list generator component, like dom-repeat, or iron-list, but we want to use it to display and manipulate tree data.

This scenario seems to come up so frequently with various components, that this component strives to genericize that requirement.

**NB I** This component takes a JS / JSON - centric approach.  An alternative way of generating an expandable tree is to use [server side HTML rendering](https://bahrus.github.io/xtal-tree-deco/cdn.html), tapping into the power of the  details / summary element.  Some experiments with this approach have been done [here](https://github.com/bahrus/xtal-tree-deco), where similar support for expand all / search / sort is supported. This will tend to have smaller first paint / time to interactive times, if the tree starts out in collapsed mode.  However,as the amount of data increases, if you want to support expand all and global search capabilities, it may be better to use a virtual list combined with this JS-based component.

xtal-tree takes a "watcha-got?" approach to the data -- it allows the specific structure of the tree data to be pretty much anything, and passes no judgment on it.   It doesn't accidentally overwrite anything it shouldn't. The user of xtal-tree, i.e. the developer, then needs to train xtal-tree how to interpret the data -- how to get the children, how to represent an open node vs a closed node, etc.  Some common defaults are established meant to match common structures.

xtal-tree also takes a "whatcha-want?" approach to what is displayed.  You can display the data as a classic tree, or as a treegrid, or as any other way you want.  The only assumption xtal-tree makes is that you want to build the display from a flat list generator, like [xtal-vlist](https://github.com/bahrus/xtal-vlist).  

Think of xtal-tree as a reusable "View Model" component.  



## Viewing This Element Locally

```
$ npm install
$ npm run serve
```

