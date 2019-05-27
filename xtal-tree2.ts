import {decorate} from 'trans-render/decorate.js';

export function XtalTreeDeco(root: HTMLDetailsElement){
    console.log('decorating');
    decorate(root, {
        propDefs:{
            allExpanded: false,
            allCollapsed: false,
        },
        methods:{
            onPropsChange(name, newVal){
                switch(name){
                    case 'allExpanded':
                        if(newVal){
                            this.setAttribute('open', '');
                            this.querySelectorAll('details').forEach(details => details.setAttribute('open', ''));
                        }
                        this.allCollapsed = false;
                        break;
                    case 'allCollapsed':
                        if(newVal){
                            this.removeAttribute('open');
                            this.querySelectorAll('details').forEach(details => details.removeAttribute('open'));
                        }

                }

            }
        }
    });
}