import { XtalTree } from './xtal-tree.js';
import { define } from 'trans-render/define.js';
export class XtalTreeSampleStruct extends XtalTree {
    static get is() { return 'xtal-tree-sample-struct'; }
    constructor() {
        super();
        this.childrenFn = node => node.children;
        this.isOpenFn = node => node.expanded;
        this.levelSetterFn = function (nodes, level) {
            nodes.forEach(node => {
                node.level = level;
                //const adjustedLevel = (<any>node).children ? level : level + 1;
                node.style = "margin-left:" + level * 18 + "px";
                if (node.children)
                    this.levelSetterFn(node.children, level + 1);
            });
        };
        this.toggleNodeFn = node => {
            node.expanded = !node.expanded;
        };
        this.testNodeFn = (node, search) => {
            if (!search)
                return true;
            if (!node.nameLC)
                node.nameLC = node.name.toLowerCase();
            return node.nameLC.indexOf(search.toLowerCase()) > -1;
        };
        this.compareFn = (lhs, rhs) => {
            if (lhs.name < rhs.name)
                return -1;
            if (lhs.name > rhs.name)
                return 1;
            return 0;
        };
    }
}
define(XtalTreeSampleStruct);
