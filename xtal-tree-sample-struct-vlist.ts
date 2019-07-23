import { define } from "trans-render/define.js";
import { createTemplate } from "xtal-element/utils.js";
import { XtalVListBase, focus_id} from "xtal-vlist/xtal-vlist-base.js";
import { RenderContext } from "trans-render/init.d.js";
import { decorate } from "trans-render/decorate.js";
import { init } from "trans-render/init.js";


const itemTemplate = createTemplate(/* html */ `
<div class="node">
  <button></button>
  <label></label>
</div>
`);
class XtalTreeSampleStructVList extends XtalVListBase {
  constructor(){
    super();
    this._h = 300;
  }
  static get is() {
    return "xtal-tree-sample-struct-vlist";
  }

  _search : string | undefined;
  get search(){
    return this._search;
  }
  set search(nv){
    this._search = nv;
  }

  connectedCallback(){
    this.propUp(['search']);
    super.connectedCallback();
  }
  
  
  generate(row: number) {
    const el = document.createElement("div");
    const rowNode = this._items[row];
    const _this = this;
    const ctx: RenderContext = {
      Transform: {
        div: ({target}) => {
          decorate(target, {
            attribs:{
              style: rowNode.style
            },
            on:{
              click: function(e){
                this.selectedNode = rowNode;
              }
            },
            propDefs:{
              selectedNode: undefined
            }
          })
          return {
            button: ({target}) => decorate(target, {
              attribs:{
                [focus_id]: rowNode.path,
              },
              propVals:{
                dataset:{
                  hasChildren: rowNode.children ? 1 : -1,
                  //isExpanded: rowNode.expanded ? 1 : -1,
                  
                },
                textContent: rowNode.expanded ? '\u25BE' : '\u25B8' 
              },
              on:{
                focus: function(e){
                  const buttonElement = e.target as HTMLButtonElement;
                  buttonElement.parentElement.classList.add('selected');
                  //buttonElement.parentElement.style.border = '5px solid red';
                  (<any>_this)._lastFocusID = buttonElement.getAttribute(focus_id);
                },
                blur: function(e){
                  const buttonElement = e.target as HTMLButtonElement;
                  buttonElement.parentElement.classList.remove('selected');
                }
              }
            }),
            label: ({target}) => {
              const nme = rowNode.name;
              if(this._search){
                const split = nme.split(new RegExp(this._search, 'i'));
                const tcL = nme.length; //token content length;
                const tc = split.length;
                const len = this._search.length;
                let iP = 0;
                let text = '';
                split.forEach((t, i) => {
    
                    iP += t.length;
                    text += t;
                    if (i < tc && iP < tcL) text += "<span class='match'>" + nme.substr(iP, len) + "</span>";
                    iP += len;
                })
                target.innerHTML = text;
                
              }else{
                target.textContent = nme;
              }
              
            }
          }
          
        }
      }
    };
    init(itemTemplate, ctx, el);
    return el;
  }


}

define(XtalTreeSampleStructVList);