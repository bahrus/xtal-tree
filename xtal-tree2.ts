import {decorate} from 'trans-render/decorate.js';

export function XtalTreeDeco(root: HTMLDetailsElement){
    decorate(root, {
        propDefs:{
            allExpanded: false
        },
        methods:{
            onPropsChange(name, oldVal, newVal){
                debugger;
            }
        }
    });
}