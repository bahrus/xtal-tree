import {XtalTree} from './xtal-tree.js';
import { define } from 'trans-render/define.js';

export class XtalTreeSampleStruct extends XtalTree{
    static get is(){return 'xtal-tree-sample-struct';}
    constructor(){
        super();
        this.childrenFn = node => (<any>node).children;
        this.isOpenFn = node => (<any>node).expanded;
        this.levelSetterFn = function(nodes, level) {
          nodes.forEach(node => {
            (<any>node).level = level;
            //const adjustedLevel = (<any>node).children ? level : level + 1;
            (<any>node).style = "margin-left:" + level * 18 + "px";
            if ((<any>node).children)
              this.levelSetterFn((<any>node).children, level + 1);
          });
        };
        this.toggleNodeFn =  node => {
          (<any>node).expanded = !(<any>node).expanded;
        };
        this.testNodeFn = (node, search) => {
          if (!search) return true;
          if (!(<any>node).nameLC)
            (<any>node).nameLC = (<any>node).name.toLowerCase();
          return (<any>node).nameLC.indexOf(search.toLowerCase()) > -1;
        };
        this.compareFn = (lhs, rhs) => {
          if ((<any>lhs).name < (<any>rhs).name) return -1;
          if ((<any>lhs).name > (<any>rhs).name) return 1;
          return 0;
        };
    }
}
define(XtalTreeSampleStruct);