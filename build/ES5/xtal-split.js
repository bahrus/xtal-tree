(function(){var a=function(a){function b(){return babelHelpers.classCallCheck(this,b),babelHelpers.possibleConstructorReturn(this,(b.__proto__||Object.getPrototypeOf(b)).apply(this,arguments))}return babelHelpers.inherits(b,a),babelHelpers.createClass(b,[{key:"strip",value:function(a){var b=document.createElement("DIV");return b.innerHTML=a,b.textContent||b.innerText||""}},{key:"onPropsChange",value:function(){var a=this;if(this._textContent)if(!this._search)this.innerText=this._textContent;else{var b=this._textContent.split(new RegExp(this._search,"i")),c=b.length,d=this._search.length,e=0,f="";b.forEach(function(b,g){e+=b.length,f+=b,g<c&&(f+="<span class='match'>"+a._textContent.substr(e,d)+"</span>"),e+=d}),this.innerHTML=f}}},{key:"search",get:function(){return this._search},set:function(a){this._search=a,this.onPropsChange()}},{key:"textContent",get:function(){return this._textContent},set:function(a){this._textContent=this.strip(a),this.onPropsChange()}}]),b}(HTMLElement);customElements.define("xtal-split",a)})();