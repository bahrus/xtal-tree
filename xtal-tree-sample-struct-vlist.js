import { define } from "trans-render/define.js";
import { createTemplate } from "xtal-element/utils.js";
import { XtalVListBase } from "xtal-vlist/xtal-vlist-base.js";
import { decorate } from "trans-render/decorate.js";
import { init } from "trans-render/init.js";
const itemTemplate = createTemplate(/* html */ `
<div class="node">
  <span data-is-expanded="-1"></span>
  <label></label>
</div>
`);
class XtalTreeSampleStructVList extends XtalVListBase {
    static get is() {
        return "xtal-tree-sample-struct-vlist";
    }
    get search() {
        return this._search;
    }
    set search(nv) {
        this._search = nv;
    }
    connectedCallback() {
        this.propUp(['search']);
        super.connectedCallback();
    }
    generate(row) {
        const el = document.createElement("div");
        const rowNode = this._items[row];
        const ctx = {
            Transform: {
                div: ({ target }) => {
                    decorate(target, {
                        attribs: {
                            style: rowNode.style
                        },
                        on: {
                            click: function (e) {
                                this.selectedNode = rowNode;
                            }
                        },
                        propDefs: {
                            selectedNode: undefined
                        }
                    });
                    return {
                        span: ({ target }) => decorate(target, {
                            propVals: {
                                dataset: {
                                    hasChildren: rowNode.children ? 1 : -1,
                                    isExpanded: rowNode.expanded ? 1 : -1,
                                }
                            }
                        }),
                        label: ({ target }) => {
                            const nme = rowNode.name;
                            if (this._search) {
                                const split = nme.split(new RegExp(this._search, 'i'));
                                const tcL = nme.length; //token content length;
                                const tc = split.length;
                                const len = this._search.length;
                                let iP = 0;
                                let text = '';
                                split.forEach((t, i) => {
                                    iP += t.length;
                                    text += t;
                                    if (i < tc && iP < tcL)
                                        text += "<span class='match'>" + nme.substr(iP, len) + "</span>";
                                    iP += len;
                                });
                                target.innerHTML = text;
                            }
                            else {
                                target.textContent = nme;
                            }
                        }
                    };
                }
            }
        };
        init(itemTemplate, ctx, el);
        return el;
    }
}
define(XtalTreeSampleStructVList);