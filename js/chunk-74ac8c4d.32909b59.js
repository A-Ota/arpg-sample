(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-74ac8c4d"],{"18a5":function(e,t,n){"use strict";var r=n("23e7"),i=n("857a"),a=n("af03");r({target:"String",proto:!0,forced:a("anchor")},{anchor:function(e){return i(this,"a","name",e)}})},6062:function(e,t,n){"use strict";var r=n("6d61"),i=n("6566");e.exports=r("Set",(function(e){return function(){return e(this,arguments.length?arguments[0]:void 0)}}),i)},6566:function(e,t,n){"use strict";var r=n("9bf2").f,i=n("7c73"),a=n("e2cc"),o=n("0366"),s=n("19aa"),c=n("2266"),u=n("7dd0"),d=n("2626"),h=n("83ab"),f=n("f183").fastKey,l=n("69f3"),p=l.set,v=l.getterFor;e.exports={getConstructor:function(e,t,n,u){var d=e((function(e,r){s(e,d,t),p(e,{type:t,index:i(null),first:void 0,last:void 0,size:0}),h||(e.size=0),void 0!=r&&c(r,e[u],{that:e,AS_ENTRIES:n})})),l=v(t),y=function(e,t,n){var r,i,a=l(e),o=x(e,t);return o?o.value=n:(a.last=o={index:i=f(t,!0),key:t,value:n,previous:r=a.last,next:void 0,removed:!1},a.first||(a.first=o),r&&(r.next=o),h?a.size++:e.size++,"F"!==i&&(a.index[i]=o)),e},x=function(e,t){var n,r=l(e),i=f(t);if("F"!==i)return r.index[i];for(n=r.first;n;n=n.next)if(n.key==t)return n};return a(d.prototype,{clear:function(){var e=this,t=l(e),n=t.index,r=t.first;while(r)r.removed=!0,r.previous&&(r.previous=r.previous.next=void 0),delete n[r.index],r=r.next;t.first=t.last=void 0,h?t.size=0:e.size=0},delete:function(e){var t=this,n=l(t),r=x(t,e);if(r){var i=r.next,a=r.previous;delete n.index[r.index],r.removed=!0,a&&(a.next=i),i&&(i.previous=a),n.first==r&&(n.first=i),n.last==r&&(n.last=a),h?n.size--:t.size--}return!!r},forEach:function(e){var t,n=l(this),r=o(e,arguments.length>1?arguments[1]:void 0,3);while(t=t?t.next:n.first){r(t.value,t.key,this);while(t&&t.removed)t=t.previous}},has:function(e){return!!x(this,e)}}),a(d.prototype,n?{get:function(e){var t=x(this,e);return t&&t.value},set:function(e,t){return y(this,0===e?0:e,t)}}:{add:function(e){return y(this,e=0===e?0:e,e)}}),h&&r(d.prototype,"size",{get:function(){return l(this).size}}),d},setStrong:function(e,t,n){var r=t+" Iterator",i=v(t),a=v(r);u(e,t,(function(e,t){p(this,{type:r,target:e,state:i(e),kind:t,last:void 0})}),(function(){var e=a(this),t=e.kind,n=e.last;while(n&&n.removed)n=n.previous;return e.target&&(e.last=n=n?n.next:e.state.first)?"keys"==t?{value:n.key,done:!1}:"values"==t?{value:n.value,done:!1}:{value:[n.key,n.value],done:!1}:(e.target=void 0,{value:void 0,done:!0})}),n?"entries":"values",!n,!0),d(t)}}},"6d61":function(e,t,n){"use strict";var r=n("23e7"),i=n("da84"),a=n("94ca"),o=n("6eeb"),s=n("f183"),c=n("2266"),u=n("19aa"),d=n("861d"),h=n("d039"),f=n("1c7e"),l=n("d44e"),p=n("7156");e.exports=function(e,t,n){var v=-1!==e.indexOf("Map"),y=-1!==e.indexOf("Weak"),x=v?"set":"add",w=i[e],g=w&&w.prototype,b=w,S={},m=function(e){var t=g[e];o(g,e,"add"==e?function(e){return t.call(this,0===e?0:e),this}:"delete"==e?function(e){return!(y&&!d(e))&&t.call(this,0===e?0:e)}:"get"==e?function(e){return y&&!d(e)?void 0:t.call(this,0===e?0:e)}:"has"==e?function(e){return!(y&&!d(e))&&t.call(this,0===e?0:e)}:function(e,n){return t.call(this,0===e?0:e,n),this})};if(a(e,"function"!=typeof w||!(y||g.forEach&&!h((function(){(new w).entries().next()})))))b=n.getConstructor(t,e,v,x),s.REQUIRED=!0;else if(a(e,!0)){var C=new b,E=C[x](y?{}:-0,1)!=C,k=h((function(){C.has(1)})),D=f((function(e){new w(e)})),K=!y&&h((function(){var e=new w,t=5;while(t--)e[x](t,t);return!e.has(-0)}));D||(b=t((function(t,n){u(t,b,e);var r=p(new w,t,b);return void 0!=n&&c(n,r[x],{that:r,AS_ENTRIES:v}),r})),b.prototype=g,g.constructor=b),(k||K)&&(m("delete"),m("has"),v&&m("get")),(K||E)&&m(x),y&&g.clear&&delete g.clear}return S[e]=b,r({global:!0,forced:b!=w},S),l(b,e),y||n.setStrong(b,e,v),b}},"857a":function(e,t,n){var r=n("1d80"),i=/"/g;e.exports=function(e,t,n,a){var o=String(r(e)),s="<"+t;return""!==n&&(s+=" "+n+'="'+String(a).replace(i,"&quot;")+'"'),s+">"+o+"</"+t+">"}},"99af":function(e,t,n){"use strict";var r=n("23e7"),i=n("d039"),a=n("e8b5"),o=n("861d"),s=n("7b0b"),c=n("50c4"),u=n("8418"),d=n("65f0"),h=n("1dde"),f=n("b622"),l=n("2d00"),p=f("isConcatSpreadable"),v=9007199254740991,y="Maximum allowed index exceeded",x=l>=51||!i((function(){var e=[];return e[p]=!1,e.concat()[0]!==e})),w=h("concat"),g=function(e){if(!o(e))return!1;var t=e[p];return void 0!==t?!!t:a(e)},b=!x||!w;r({target:"Array",proto:!0,forced:b},{concat:function(e){var t,n,r,i,a,o=s(this),h=d(o,0),f=0;for(t=-1,r=arguments.length;t<r;t++)if(a=-1===t?o:arguments[t],g(a)){if(i=c(a.length),f+i>v)throw TypeError(y);for(n=0;n<i;n++,f++)n in a&&u(h,f,a[n])}else{if(f>=v)throw TypeError(y);u(h,f++,a)}return h.length=f,h}})},af03:function(e,t,n){var r=n("d039");e.exports=function(e){return r((function(){var t=""[e]('"');return t!==t.toLowerCase()||t.split('"').length>3}))}},b186:function(e,t,n){"use strict";n.r(t);var r=function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",{staticStyle:{position:"relative"}},[n("div",{ref:"pixi_area",staticStyle:{position:"absolute",width:"320px",height:"240px"}}),n("div",{staticStyle:{position:"absolute",left:"10px",top:"10px","background-color":"#0000ff66",color:"#fff"}},[e._v("矢印キーで移動")])])},i=[],a=(n("99af"),n("d3b7"),n("6062"),n("3ca3"),n("18a5"),n("ddb0"),n("d4ec")),o=n("bee2"),s=n("262e"),c=n("2caf"),u=n("2b0e"),d=n("22a2"),h=function(e){Object(s["a"])(n,e);var t=Object(c["a"])(n);function n(e){var r;return Object(a["a"])(this,n),r=t.call(this),r.sheet=e,r.animationFrame=0,r._currentDirection=2,r.animationStep=0,r.body=new d["Sprite"](e.textures["character-2-0"]),r.body.anchor.set(.5,.5),r.addChild(r.body),r.shadow=new d["Graphics"],r.shadow.lineStyle(0),r.shadow.beginFill(0,1),r.shadow.drawEllipse(0,28,16,10),r.shadow.endFill(),r.shadow.alpha=.5,r.addChildAt(r.shadow,0),r}return Object(o["a"])(n,[{key:"currentDirection",get:function(){return this._currentDirection},set:function(e){this._currentDirection=e,this.syncTexture()}},{key:"syncTexture",value:function(){this.body.texture=this.sheet.textures["character-".concat(this.currentDirection,"-").concat(3===this.animationStep?1:this.animationStep)]}},{key:"update",value:function(){++this.animationFrame,this.animationFrame>30&&(this.animationFrame=0,this.animationStep=(this.animationStep+1)%4,this.syncTexture())}}]),n}(d["Container"]),f=37,l=38,p=39,v=40,y=u["default"].extend({data:function(){return{chara:null,pressedKeyCodeSet:new Set}},mounted:function(){var e=this;d["settings"].RESOLUTION=window.devicePixelRatio,d["settings"].SCALE_MODE=d["SCALE_MODES"].NEAREST,window.onkeydown=this.onKeyDown,window.onkeyup=this.onKeyUp;var t={width:320,height:240},n=new d["Application"](t),r=this.$refs["pixi_area"];r.appendChild(n.view);var i=new d["Sprite"](d["Texture"].WHITE);i.width=320,i.height=240,i.tint=13421772,n.stage.addChild(i),d["Loader"].shared.reset().add("/arpg-sample/images/chara01.json").load((function(){d["Loader"].shared.resources["/arpg-sample/images/chara01.json"].spritesheet;e.chara=new h(d["Loader"].shared.resources["/arpg-sample/images/chara01.json"].spritesheet),e.chara.position.set(160,120),n.stage.addChild(e.chara)})),n.ticker.add((function(t){var n;e.updateCharaState(),null===(n=e.chara)||void 0===n||n.update()}))},methods:{onKeyDown:function(e){console.log(e.keyCode),this.pressedKeyCodeSet.add(e.keyCode)},onKeyUp:function(e){this.pressedKeyCodeSet["delete"](e.keyCode)},updateCharaState:function(){var e=1,t=.7,n=0,r=0;this.pressedKeyCodeSet.has(f)?this.pressedKeyCodeSet.has(v)?(this.chara.currentDirection=1,n=-t,r=t):this.pressedKeyCodeSet.has(l)?(this.chara.currentDirection=7,n=-t,r=-t):(this.chara.currentDirection=4,n=-e):this.pressedKeyCodeSet.has(p)?this.pressedKeyCodeSet.has(v)?(this.chara.currentDirection=3,n=t,r=t):this.pressedKeyCodeSet.has(l)?(this.chara.currentDirection=9,n=t,r=-t):(this.chara.currentDirection=6,n=+e):this.pressedKeyCodeSet.has(l)?(this.chara.currentDirection=8,r=-e):this.pressedKeyCodeSet.has(v)&&(this.chara.currentDirection=2,r=e),0!=n&&(this.chara.position.x+=n),0!=r&&(this.chara.position.y+=r)}},components:{},computed:{},props:[]}),x=y,w=n("2877"),g=Object(w["a"])(x,r,i,!1,null,"593fc81f",null);t["default"]=g.exports},bb2f:function(e,t,n){var r=n("d039");e.exports=!r((function(){return Object.isExtensible(Object.preventExtensions({}))}))},f183:function(e,t,n){var r=n("d012"),i=n("861d"),a=n("5135"),o=n("9bf2").f,s=n("90e3"),c=n("bb2f"),u=s("meta"),d=0,h=Object.isExtensible||function(){return!0},f=function(e){o(e,u,{value:{objectID:"O"+ ++d,weakData:{}}})},l=function(e,t){if(!i(e))return"symbol"==typeof e?e:("string"==typeof e?"S":"P")+e;if(!a(e,u)){if(!h(e))return"F";if(!t)return"E";f(e)}return e[u].objectID},p=function(e,t){if(!a(e,u)){if(!h(e))return!0;if(!t)return!1;f(e)}return e[u].weakData},v=function(e){return c&&y.REQUIRED&&h(e)&&!a(e,u)&&f(e),e},y=e.exports={REQUIRED:!1,fastKey:l,getWeakData:p,onFreeze:v};r[u]=!0}}]);
//# sourceMappingURL=chunk-74ac8c4d.32909b59.js.map