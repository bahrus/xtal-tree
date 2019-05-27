import { decorate } from 'trans-render/decorate.js';
export function XtalTreeDeco(root, recursive) {
    //console.log('decorating');
    decorate(root, {
        propDefs: {
            allExpanded: false,
            allCollapsed: false,
            searchString: null,
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
                    case 'searchString':
                        if (newVal === null || newVal === '')
                            return;
                        const newValLC = newVal.toLowerCase();
                        this.querySelectorAll('section>div').forEach(div => {
                            if (div.textContent.toLowerCase().indexOf(newValLC) > -1) {
                                div.classList.add('match');
                            }
                            else {
                                div.classList.remove('match');
                            }
                        });
                        const summary = this.querySelector('summary');
                        if (summary.textContent.toLowerCase().indexOf(newValLC) > -1) {
                            summary.classList.add('match');
                            this.allCollapsed = true;
                        }
                        else {
                            summary.classList.remove('match');
                            if (recursive) {
                                this.querySelectorAll('details').forEach(details => {
                                    details.searchString = newValLC;
                                });
                                if (this.querySelector('.match')) {
                                    this.setAttribute('open', '');
                                }
                                else {
                                    this.removeAttribute('open');
                                }
                            }
                        }
                }
            }
        }
    });
    if (recursive) {
        root.querySelectorAll('details').forEach(details => XtalTreeDeco(details, recursive));
    }
}
