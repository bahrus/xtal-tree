(function () {
    class XtalSplit extends HTMLElement {
        get search() {
            return this._search;
        }
        set search(val) {
            this._search = val;
            this.onPropsChange();
        }
        strip(html) {
            var tmp = document.createElement("DIV");
            tmp.innerHTML = html;
            return tmp.textContent || tmp.innerText || "";
        }
        get textContent() {
            return this._textContent;
        }
        set textContent(val) {
            this._textContent = this.strip(val);
            this.onPropsChange();
        }
        onPropsChange() {
            if (!this._textContent)
                return;
            if (!this._search) {
                this.innerText = this._textContent;
            }
            else {
                const split = this._textContent.split(new RegExp(this._search, 'i'));
                const tokenCount = split.length;
                const len = this._search.length;
                let iPos = 0;
                let text = '';
                //console.log(split);
                split.forEach((token, idx) => {
                    iPos += token.length;
                    text += token;
                    if (idx < tokenCount)
                        text += "<span class='match'>" + this._textContent.substr(iPos, len) + "</span>";
                    iPos += len;
                });
                this.innerHTML = text;
            }
        }
    }
    customElements.define('xtal-split', XtalSplit);
})();
//# sourceMappingURL=xtal-split.js.map