import { define } from "trans-render/define.js";
import { createTemplate } from "xtal-element/utils.js";
import { XtalVList, focus_id } from "xtal-vlist/xtal-vlist.js";
import { decorate } from "trans-render/decorate.js";
import { init } from "trans-render/init.js";
import { split } from "trans-render/split.js";
const itemTemplate = createTemplate(/* html */ `
<div class="node">
  <button></button>
  <label></label>
</div>
`);
class XtalTreeSampleStructVList extends XtalVList {
    constructor() {
        super();
        //this._h = 300;
    }
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
        const _this = this;
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
                        button: ({ target }) => decorate(target, {
                            attribs: {
                                [focus_id]: rowNode.path,
                            },
                            propVals: {
                                //id: rowNode.path,
                                dataset: {
                                    hasChildren: rowNode.children ? 1 : -1,
                                },
                                textContent: rowNode.expanded ? '\u25BE' : '\u25B8',
                                title: rowNode.expanded ? 'collapse' : 'expand'
                            },
                            on: {
                                focus: function (e) {
                                    const buttonElement = e.target;
                                    buttonElement.parentElement.classList.add('selected');
                                    _this._lastFocusID = buttonElement.getAttribute(focus_id);
                                },
                                blur: function (e) {
                                    const buttonElement = e.target;
                                    buttonElement.parentElement.classList.remove('selected');
                                }
                            }
                        }),
                        label: ({ target }) => {
                            //const lbl = target as HTMLLabelElement;
                            const nme = rowNode.name;
                            split(target, nme, this._search);
                            decorate(target, {
                                propVals: {
                                    tabIndex: 0
                                },
                                attribs: {
                                    [focus_id]: rowNode.path + '_l',
                                },
                                on: {
                                    focus: function (e) {
                                        const buttonElement = e.target;
                                        buttonElement.parentElement.classList.add('selected');
                                        _this._lastFocusID = buttonElement.getAttribute(focus_id);
                                    },
                                    blur: function (e) {
                                        const buttonElement = e.target;
                                        buttonElement.parentElement.classList.remove('selected');
                                    }
                                }
                            });
                            //target.setAttribute('for', rowNode.path);
                            //decorate()
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
