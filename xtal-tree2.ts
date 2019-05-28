import {decorate} from 'trans-render/decorate.js';

function getStrVal(el: HTMLElement){
    switch(el.localName){
        case 'div':
            return el.textContent;
        case 'details':
            return el.querySelector('summary').textContent;
    }
}
export function XtalTreeDeco(root: HTMLDetailsElement, recursive?: boolean){
    //console.log('decorating');
    decorate(root, {
        propDefs:{
            allExpanded: false,
            allCollapsed: false,
            searchString: null,
            sortDir: null,
        },
        methods:{
            onPropsChange(name, newVal){
                switch(name){
                    case 'allExpanded':
                        if(newVal){
                            this.setAttribute('open', '');
                            this.querySelectorAll('details').forEach(details => details.setAttribute('open', ''));
                        }
                        if(this.allCollapsed) this.allCollapsed = false;
                        break;
                    case 'allCollapsed':
                        if(newVal){
                            this.removeAttribute('open');
                            this.querySelectorAll('details').forEach(details => details.removeAttribute('open'));
                        }
                        if(this.allExpanded) this.allExpanded = false;
                        break;
                    case 'searchString':
                        if(newVal === null || newVal === '') return;
                        const newValLC = newVal.toLowerCase();
                        this.querySelectorAll('section>div').forEach(div =>{
                            if(div.textContent.toLowerCase().indexOf(newValLC) > -1){
                                div.classList.add('match');
                            }else{
                                div.classList.remove('match');
                            }
                        })
                        const summary = this.querySelector('summary');
                        if(summary.textContent.toLowerCase().indexOf(newValLC) > -1){
                            summary.classList.add('match');
                            this.allCollapsed = true;
                        }else{
                            summary.classList.remove('match');
                            if(recursive){
                                this.querySelectorAll('details').forEach(details => {
                                    details.searchString = newValLC;
                                });
                                if(this.querySelector('.match')){
                                    this.setAttribute('open', '');
                                }else{
                                    this.removeAttribute('open');
                                }
                            }
                        }
                        break;
                    case 'sortDir':
                        if(newVal === null) return;
                        const section = this.querySelector('section');
                        const sectionChildren = Array.from(section.children);
                        const one = newVal === 'asc' ? 1 : -1;
                        const min = newVal === 'asc' ? -1 : 1;
                        sectionChildren.sort((a: HTMLElement, b: HTMLElement) =>{
                            const lhs = getStrVal(a);
                            const rhs = getStrVal(b);
                            if(lhs < rhs) return min;
                            if(lhs > rhs) return one;
                            return 0
                        });
                        let count = 1;
                        sectionChildren.forEach(child => {
                            (child as HTMLElement).style.order = count.toString();
                            count++;
                        });
                        if(recursive){
                            this.querySelectorAll('details').forEach(details => {
                                details.sortDir = newVal;
                            });
                        }
                }

            }
        }
    });
    if(recursive){
        root.querySelectorAll('details').forEach(details => XtalTreeDeco(details, recursive));
    }
    
}