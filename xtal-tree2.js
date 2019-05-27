import { decorate } from 'trans-render/decorate.js';
export function XtalTreeDeco(root, recursive) {
    //console.log('decorating');
    decorate(root, {
        propDefs: {
            allExpanded: false,
            allCollapsed: false,
        },
        methods: {
            onPropsChange(name, newVal) {
                switch (name) {
                    case 'allExpanded':
                        if (newVal) {
                            this.setAttribute('open', '');
                            this.querySelectorAll('details').forEach(details => details.setAttribute('open', ''));
                        }
                        if (this.allCollapsed)
                            this.allCollapsed = false;
                        break;
                    case 'allCollapsed':
                        if (newVal) {
                            this.removeAttribute('open');
                            this.querySelectorAll('details').forEach(details => details.removeAttribute('open'));
                        }
                        if (this.allExpanded)
                            this.allExpanded = false;
                        break;
                }
            }
        }
    });
    if (recursive) {
        root.querySelectorAll('details').forEach(details => XtalTreeDeco(details, recursive));
    }
}
