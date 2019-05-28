[![Published on webcomponents.org](https://img.shields.io/badge/webcomponents.org-published-blue.svg)](https://www.webcomponents.org/element/bahrus/xtal-tree)

<a href="https://nodei.co/npm/xtal-tree/"><img src="https://nodei.co/npm/xtal-tree.png"></a>

<img src="https://badgen.net/bundlephobia/minzip/xtal-tree">

# \<xtal-tree\>


<!--
```
<custom-element-demo>
  <template>
    <div>
        <style>
            #directory details>section{
                margin-left:20px;
                display:flex;
                flex-direction:column;
            }

            #directory .match{
                font-weight: 800;
            }

            
        </style>
        <xtal-sip><script nomodule>["xtal-fetch-req", "p-d-r"]</script></xtal-sip>
        <button>Expand All</button>
        <p-d-r on=click to=details prop=allExpanded val=target skip-init></p-d-r>
        <button>Collapse All</button>
        <p-d-r on=click to=details prop=allCollapsed val=target skip-init></p-d-r>
        <label for=search>Search</label>
        <input disabled autocomplete=off id=search>
        <p-d-r on=input to=details prop=searchString val=target.value skip-init></p-d-r>
        <br>
        <button data-dir=asc>Sort Ascending</button>
        <p-d-r on=click to=details prop=sortDir val=target.dataset.dir skip-init></p-d-r>
        <button data-dir=desc>Sort Descending</button>
        <p-d-r on=click to=details prop=sortDir val=target.dataset.dir skip-init></p-d-r>
        <xtal-fetch-req p-d-if="p-d-r" id="directory" fetch href="https://unpkg.com/xtal-tree@0.0.64/demo/directory.html" as="text" insert-results></xtal-fetch-req>
        <script defer src="https://cdn.jsdelivr.net/npm/es-module-shims@0.2.7/dist/es-module-shims.js"></script>
        <script type="importmap-shim">
        {
            "imports": {
                "xtal-element/": "https://cdn.jsdelivr.net/npm/xtal-element@0.0.59/",
                "trans-render/": "https://cdn.jsdelivr.net/npm/trans-render@0.0.111/",
                "xtal-sip": "https://cdn.jsdelivr.net/npm/xtal-sip@0.0.87/xtal-sip.js",
                "xtal-fetch-req": "https://cdn.jsdelivr.net/npm/xtal-fetch@0.0.58/xtal-fetch-req.js",
                "p-d": "https://cdn.jsdelivr.net/npm/p-et-alia@0.0.4/p-d.js",
                "p-d-r": "https://cdn.jsdelivr.net/npm/p-et-alia@0.0.4/p-d-r.js",
                "xtal-deco": "https://cdn.jsdelivr.net/npm/xtal-decorator@0.0.46/xtal-deco.js"
            }
        }
        </script>
        <script type="module-shim">
            import 'xtal-sip';
            import {XtalTreeDeco} from 'https://cdn.jsdelivr.net/npm/xtal-tree@0.0.64/XtalTreeDeco.js';
            directory.addEventListener('fetch-complete', e =>{
                XtalTreeDeco(directory.querySelector('details'), true);
            })
        </script>

    </div>
  </div>
  </template>
</custom-element-demo>
```
-->

The details element provides a way to create tree structures with pure HTML. Performance is surprisingly good, and may not require any virtual scrollers, even for fairly large tree structures.

However, such trees lack some capabilities expected from a tree component, such as search, sort and expandAll/Collapse All.  This library contains a helper "decorator" function, XtalTreeDeco, which adds such capabilities.

This package also contains a custom element, xtal-tree (xtal-tree.js) which takes JavaScript tree structure, and provides the same capabilities.

## Viewing Your Element

```
$ polymer serve
```

