(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-0b5b80a6"],{"159b":function(t,e,r){var n=r("da84"),i=r("fdbc"),a=r("17c2"),o=r("9112");for(var s in i){var c=n[s],u=c&&c.prototype;if(u&&u.forEach!==a)try{o(u,"forEach",a)}catch(f){u.forEach=a}}},"17c2":function(t,e,r){"use strict";var n=r("b727").forEach,i=r("a640"),a=r("ae40"),o=i("forEach"),s=a("forEach");t.exports=o&&s?[].forEach:function(t){return n(this,t,arguments.length>1?arguments[1]:void 0)}},"18a5":function(t,e,r){"use strict";var n=r("23e7"),i=r("857a"),a=r("af03");n({target:"String",proto:!0,forced:a("anchor")},{anchor:function(t){return i(this,"a","name",t)}})},"277d":function(t,e,r){var n=r("23e7"),i=r("e8b5");n({target:"Array",stat:!0},{isArray:i})},3456:function(t,e,r){"use strict";r.r(e);var n=function(){var t=this,e=t.$createElement,r=t._self._c||e;return r("div",{staticStyle:{position:"relative"}},[r("div",{ref:"pixi_area",staticStyle:{position:"absolute",width:"320px",height:"240px"}}),r("div",{staticStyle:{position:"absolute",left:"10px",top:"10px","background-color":"#0000ff66",color:"#fff"}},[t._v("矢印キーで移動")])])},i=[],a=(r("99af"),r("4160"),r("d3b7"),r("6062"),r("3ca3"),r("18a5"),r("159b"),r("ddb0"),r("3835")),o=r("d4ec"),s=r("bee2"),c=r("257e"),u=r("262e"),f=r("2caf"),d=r("2b0e"),h=r("22a2"),l=function(t){Object(u["a"])(r,t);var e=Object(f["a"])(r);function r(t,n){var i;return Object(o["a"])(this,r),i=e.call(this),i.sheet=t,i.routine=n,i.animationFrame=0,i._currentDirection=2,i.animationStep=0,n.character=Object(c["a"])(i),i.body=new h["Sprite"](t.textures["character-2-0"]),i.body.anchor.set(.5,.5),i.addChild(i.body),i.shadow=new h["Graphics"],i.shadow.lineStyle(0),i.shadow.beginFill(0,1),i.shadow.drawEllipse(0,28,16,10),i.shadow.endFill(),i.shadow.alpha=.5,i.addChildAt(i.shadow,0),i}return Object(s["a"])(r,[{key:"currentDirection",get:function(){return this._currentDirection},set:function(t){this._currentDirection=t,this.syncTexture()}},{key:"syncTexture",value:function(){this.body.texture=this.sheet.textures["character-".concat(this.currentDirection,"-").concat(3===this.animationStep?1:this.animationStep)]}},{key:"update",value:function(){this.routine.update(),this.zIndex=this.position.y,++this.animationFrame,this.animationFrame>30&&(this.animationFrame=0,this.animationStep=(this.animationStep+1)%4,this.syncTexture())}}]),r}(h["Container"]),v=function t(){Object(o["a"])(this,t)},p=37,y=38,b=39,g=40,m=function(t,e){var r=.7*e;switch(t){case 1:return[-r,r];case 2:return[0,e];case 3:return[r,r];case 4:return[-e,0];case 6:return[e,0];case 7:return[-r,-r];case 8:return[0,-e];case 9:return[r,-r]}return[0,0]},w=function(t){Object(u["a"])(r,t);var e=Object(f["a"])(r);function r(t){var n;return Object(o["a"])(this,r),n=e.call(this),n.pressedKeyCodeSet=t,n}return Object(s["a"])(r,[{key:"update",value:function(){var t=null;if(this.pressedKeyCodeSet.has(p)?t=this.pressedKeyCodeSet.has(g)?1:this.pressedKeyCodeSet.has(y)?7:4:this.pressedKeyCodeSet.has(b)?t=this.pressedKeyCodeSet.has(g)?3:this.pressedKeyCodeSet.has(y)?9:6:this.pressedKeyCodeSet.has(y)?t=8:this.pressedKeyCodeSet.has(g)&&(t=2),null!=t){this.character.currentDirection=t;var e=m(this.character.currentDirection,1),r=Object(a["a"])(e,2),n=r[0],i=r[1];this.character.position.x+=n,this.character.position.y+=i}}}]),r}(v),x=function(t){Object(u["a"])(r,t);var e=Object(f["a"])(r);function r(){var t,n=arguments.length>0&&void 0!==arguments[0]&&arguments[0],i=arguments.length>1&&void 0!==arguments[1]?arguments[1]:0,a=arguments.length>2&&void 0!==arguments[2]?arguments[2]:60;return Object(o["a"])(this,r),t=e.call(this),t.isMoving=n,t.frameCountToWait=i,t.frameCountToMove=a,t}return Object(s["a"])(r,[{key:"update",value:function(){if(this.isMoving){var t=m(this.character.currentDirection,.6),e=Object(a["a"])(t,2),r=e[0],n=e[1];this.character.position.x+=r,this.character.position.y+=n,--this.frameCountToWait,this.frameCountToWait<=0&&(this.frameCountToWait=0,this.frameCountToMove=60+30*Math.floor(3*Math.random()),this.isMoving=!1)}else--this.frameCountToMove,this.frameCountToMove<=0&&(this.frameCountToMove=0,this.frameCountToWait=60,this.character.currentDirection=[1,2,3,4,6,7,8,9][Math.floor(8*Math.random())],this.isMoving=!0)}}]),r}(v),S=d["default"].extend({data:function(){return{characters:[],pressedKeyCodeSet:new Set}},mounted:function(){var t=this;h["settings"].RESOLUTION=window.devicePixelRatio,h["settings"].SCALE_MODE=h["SCALE_MODES"].NEAREST,window.onkeydown=this.onKeyDown,window.onkeyup=this.onKeyUp;var e={width:320,height:240},r=new h["Application"](e),n=this.$refs["pixi_area"];n.appendChild(r.view),r.stage.sortableChildren=!0;var i=new h["Sprite"](h["Texture"].WHITE);i.width=320,i.height=240,i.tint=13421772,r.stage.addChild(i),h["Loader"].shared.reset().add("/arpg-sample/images/chara01.json").add("/arpg-sample/images/chara02.json").load((function(){var e=new l(h["Loader"].shared.resources["/arpg-sample/images/chara01.json"].spritesheet,new w(t.pressedKeyCodeSet));e.position.set(180,110),r.stage.addChild(e),t.characters.push(e);var n=new l(h["Loader"].shared.resources["/arpg-sample/images/chara02.json"].spritesheet,new x);n.position.set(140,90),r.stage.addChild(n),t.characters.push(n)})),r.ticker.add((function(e){t.characters.forEach((function(t){return t.update()}))}))},methods:{onKeyDown:function(t){this.pressedKeyCodeSet.add(t.keyCode)},onKeyUp:function(t){this.pressedKeyCodeSet["delete"](t.keyCode)}},components:{},computed:{},props:[]}),C=S,E=r("2877"),O=Object(E["a"])(C,n,i,!1,null,"5967b8ad",null);e["default"]=O.exports},3835:function(t,e,r){"use strict";r.d(e,"a",(function(){return c}));r("277d");function n(t){if(Array.isArray(t))return t}r("a4d3"),r("e01a"),r("d28b"),r("d3b7"),r("3ca3"),r("ddb0");function i(t,e){if("undefined"!==typeof Symbol&&Symbol.iterator in Object(t)){var r=[],n=!0,i=!1,a=void 0;try{for(var o,s=t[Symbol.iterator]();!(n=(o=s.next()).done);n=!0)if(r.push(o.value),e&&r.length===e)break}catch(c){i=!0,a=c}finally{try{n||null==s["return"]||s["return"]()}finally{if(i)throw a}}return r}}r("a630"),r("fb6a"),r("0d03"),r("b0c0"),r("25f0");function a(t,e){(null==e||e>t.length)&&(e=t.length);for(var r=0,n=new Array(e);r<e;r++)n[r]=t[r];return n}function o(t,e){if(t){if("string"===typeof t)return a(t,e);var r=Object.prototype.toString.call(t).slice(8,-1);return"Object"===r&&t.constructor&&(r=t.constructor.name),"Map"===r||"Set"===r?Array.from(t):"Arguments"===r||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r)?a(t,e):void 0}}function s(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}function c(t,e){return n(t)||i(t,e)||o(t,e)||s()}},4160:function(t,e,r){"use strict";var n=r("23e7"),i=r("17c2");n({target:"Array",proto:!0,forced:[].forEach!=i},{forEach:i})},"4df4":function(t,e,r){"use strict";var n=r("0366"),i=r("7b0b"),a=r("9bdd"),o=r("e95a"),s=r("50c4"),c=r("8418"),u=r("35a1");t.exports=function(t){var e,r,f,d,h,l,v=i(t),p="function"==typeof this?this:Array,y=arguments.length,b=y>1?arguments[1]:void 0,g=void 0!==b,m=u(v),w=0;if(g&&(b=n(b,y>2?arguments[2]:void 0,2)),void 0==m||p==Array&&o(m))for(e=s(v.length),r=new p(e);e>w;w++)l=g?b(v[w],w):v[w],c(r,w,l);else for(d=m.call(v),h=d.next,r=new p;!(f=h.call(d)).done;w++)l=g?a(d,b,[f.value,w],!0):f.value,c(r,w,l);return r.length=w,r}},6062:function(t,e,r){"use strict";var n=r("6d61"),i=r("6566");t.exports=n("Set",(function(t){return function(){return t(this,arguments.length?arguments[0]:void 0)}}),i)},6566:function(t,e,r){"use strict";var n=r("9bf2").f,i=r("7c73"),a=r("e2cc"),o=r("0366"),s=r("19aa"),c=r("2266"),u=r("7dd0"),f=r("2626"),d=r("83ab"),h=r("f183").fastKey,l=r("69f3"),v=l.set,p=l.getterFor;t.exports={getConstructor:function(t,e,r,u){var f=t((function(t,n){s(t,f,e),v(t,{type:e,index:i(null),first:void 0,last:void 0,size:0}),d||(t.size=0),void 0!=n&&c(n,t[u],{that:t,AS_ENTRIES:r})})),l=p(e),y=function(t,e,r){var n,i,a=l(t),o=b(t,e);return o?o.value=r:(a.last=o={index:i=h(e,!0),key:e,value:r,previous:n=a.last,next:void 0,removed:!1},a.first||(a.first=o),n&&(n.next=o),d?a.size++:t.size++,"F"!==i&&(a.index[i]=o)),t},b=function(t,e){var r,n=l(t),i=h(e);if("F"!==i)return n.index[i];for(r=n.first;r;r=r.next)if(r.key==e)return r};return a(f.prototype,{clear:function(){var t=this,e=l(t),r=e.index,n=e.first;while(n)n.removed=!0,n.previous&&(n.previous=n.previous.next=void 0),delete r[n.index],n=n.next;e.first=e.last=void 0,d?e.size=0:t.size=0},delete:function(t){var e=this,r=l(e),n=b(e,t);if(n){var i=n.next,a=n.previous;delete r.index[n.index],n.removed=!0,a&&(a.next=i),i&&(i.previous=a),r.first==n&&(r.first=i),r.last==n&&(r.last=a),d?r.size--:e.size--}return!!n},forEach:function(t){var e,r=l(this),n=o(t,arguments.length>1?arguments[1]:void 0,3);while(e=e?e.next:r.first){n(e.value,e.key,this);while(e&&e.removed)e=e.previous}},has:function(t){return!!b(this,t)}}),a(f.prototype,r?{get:function(t){var e=b(this,t);return e&&e.value},set:function(t,e){return y(this,0===t?0:t,e)}}:{add:function(t){return y(this,t=0===t?0:t,t)}}),d&&n(f.prototype,"size",{get:function(){return l(this).size}}),f},setStrong:function(t,e,r){var n=e+" Iterator",i=p(e),a=p(n);u(t,e,(function(t,e){v(this,{type:n,target:t,state:i(t),kind:e,last:void 0})}),(function(){var t=a(this),e=t.kind,r=t.last;while(r&&r.removed)r=r.previous;return t.target&&(t.last=r=r?r.next:t.state.first)?"keys"==e?{value:r.key,done:!1}:"values"==e?{value:r.value,done:!1}:{value:[r.key,r.value],done:!1}:(t.target=void 0,{value:void 0,done:!0})}),r?"entries":"values",!r,!0),f(e)}}},"6d61":function(t,e,r){"use strict";var n=r("23e7"),i=r("da84"),a=r("94ca"),o=r("6eeb"),s=r("f183"),c=r("2266"),u=r("19aa"),f=r("861d"),d=r("d039"),h=r("1c7e"),l=r("d44e"),v=r("7156");t.exports=function(t,e,r){var p=-1!==t.indexOf("Map"),y=-1!==t.indexOf("Weak"),b=p?"set":"add",g=i[t],m=g&&g.prototype,w=g,x={},S=function(t){var e=m[t];o(m,t,"add"==t?function(t){return e.call(this,0===t?0:t),this}:"delete"==t?function(t){return!(y&&!f(t))&&e.call(this,0===t?0:t)}:"get"==t?function(t){return y&&!f(t)?void 0:e.call(this,0===t?0:t)}:"has"==t?function(t){return!(y&&!f(t))&&e.call(this,0===t?0:t)}:function(t,r){return e.call(this,0===t?0:t,r),this})};if(a(t,"function"!=typeof g||!(y||m.forEach&&!d((function(){(new g).entries().next()})))))w=r.getConstructor(e,t,p,b),s.REQUIRED=!0;else if(a(t,!0)){var C=new w,E=C[b](y?{}:-0,1)!=C,O=d((function(){C.has(1)})),j=h((function(t){new g(t)})),A=!y&&d((function(){var t=new g,e=5;while(e--)t[b](e,e);return!t.has(-0)}));j||(w=e((function(e,r){u(e,w,t);var n=v(new g,e,w);return void 0!=r&&c(r,n[b],{that:n,AS_ENTRIES:p}),n})),w.prototype=m,m.constructor=w),(O||A)&&(S("delete"),S("has"),p&&S("get")),(A||E)&&S(b),y&&m.clear&&delete m.clear}return x[t]=w,n({global:!0,forced:w!=g},x),l(w,t),y||r.setStrong(w,t,p),w}},"857a":function(t,e,r){var n=r("1d80"),i=/"/g;t.exports=function(t,e,r,a){var o=String(n(t)),s="<"+e;return""!==r&&(s+=" "+r+'="'+String(a).replace(i,"&quot;")+'"'),s+">"+o+"</"+e+">"}},"99af":function(t,e,r){"use strict";var n=r("23e7"),i=r("d039"),a=r("e8b5"),o=r("861d"),s=r("7b0b"),c=r("50c4"),u=r("8418"),f=r("65f0"),d=r("1dde"),h=r("b622"),l=r("2d00"),v=h("isConcatSpreadable"),p=9007199254740991,y="Maximum allowed index exceeded",b=l>=51||!i((function(){var t=[];return t[v]=!1,t.concat()[0]!==t})),g=d("concat"),m=function(t){if(!o(t))return!1;var e=t[v];return void 0!==e?!!e:a(t)},w=!b||!g;n({target:"Array",proto:!0,forced:w},{concat:function(t){var e,r,n,i,a,o=s(this),d=f(o,0),h=0;for(e=-1,n=arguments.length;e<n;e++)if(a=-1===e?o:arguments[e],m(a)){if(i=c(a.length),h+i>p)throw TypeError(y);for(r=0;r<i;r++,h++)r in a&&u(d,h,a[r])}else{if(h>=p)throw TypeError(y);u(d,h++,a)}return d.length=h,d}})},"9bdd":function(t,e,r){var n=r("825a"),i=r("2a62");t.exports=function(t,e,r,a){try{return a?e(n(r)[0],r[1]):e(r)}catch(o){throw i(t),o}}},a630:function(t,e,r){var n=r("23e7"),i=r("4df4"),a=r("1c7e"),o=!a((function(t){Array.from(t)}));n({target:"Array",stat:!0,forced:o},{from:i})},a640:function(t,e,r){"use strict";var n=r("d039");t.exports=function(t,e){var r=[][t];return!!r&&n((function(){r.call(null,e||function(){throw 1},1)}))}},ae40:function(t,e,r){var n=r("83ab"),i=r("d039"),a=r("5135"),o=Object.defineProperty,s={},c=function(t){throw t};t.exports=function(t,e){if(a(s,t))return s[t];e||(e={});var r=[][t],u=!!a(e,"ACCESSORS")&&e.ACCESSORS,f=a(e,0)?e[0]:c,d=a(e,1)?e[1]:void 0;return s[t]=!!r&&!i((function(){if(u&&!n)return!0;var t={length:-1};u?o(t,1,{enumerable:!0,get:c}):t[1]=1,r.call(t,f,d)}))}},af03:function(t,e,r){var n=r("d039");t.exports=function(t){return n((function(){var e=""[t]('"');return e!==e.toLowerCase()||e.split('"').length>3}))}},b0c0:function(t,e,r){var n=r("83ab"),i=r("9bf2").f,a=Function.prototype,o=a.toString,s=/^\s*function ([^ (]*)/,c="name";n&&!(c in a)&&i(a,c,{configurable:!0,get:function(){try{return o.call(this).match(s)[1]}catch(t){return""}}})},bb2f:function(t,e,r){var n=r("d039");t.exports=!n((function(){return Object.isExtensible(Object.preventExtensions({}))}))},f183:function(t,e,r){var n=r("d012"),i=r("861d"),a=r("5135"),o=r("9bf2").f,s=r("90e3"),c=r("bb2f"),u=s("meta"),f=0,d=Object.isExtensible||function(){return!0},h=function(t){o(t,u,{value:{objectID:"O"+ ++f,weakData:{}}})},l=function(t,e){if(!i(t))return"symbol"==typeof t?t:("string"==typeof t?"S":"P")+t;if(!a(t,u)){if(!d(t))return"F";if(!e)return"E";h(t)}return t[u].objectID},v=function(t,e){if(!a(t,u)){if(!d(t))return!0;if(!e)return!1;h(t)}return t[u].weakData},p=function(t){return c&&y.REQUIRED&&d(t)&&!a(t,u)&&h(t),t},y=t.exports={REQUIRED:!1,fastKey:l,getWeakData:v,onFreeze:p};n[u]=!0},fb6a:function(t,e,r){"use strict";var n=r("23e7"),i=r("861d"),a=r("e8b5"),o=r("23cb"),s=r("50c4"),c=r("fc6a"),u=r("8418"),f=r("b622"),d=r("1dde"),h=r("ae40"),l=d("slice"),v=h("slice",{ACCESSORS:!0,0:0,1:2}),p=f("species"),y=[].slice,b=Math.max;n({target:"Array",proto:!0,forced:!l||!v},{slice:function(t,e){var r,n,f,d=c(this),h=s(d.length),l=o(t,h),v=o(void 0===e?h:e,h);if(a(d)&&(r=d.constructor,"function"!=typeof r||r!==Array&&!a(r.prototype)?i(r)&&(r=r[p],null===r&&(r=void 0)):r=void 0,r===Array||void 0===r))return y.call(d,l,v);for(n=new(void 0===r?Array:r)(b(v-l,0)),f=0;l<v;l++,f++)l in d&&u(n,f,d[l]);return n.length=f,n}})}}]);
//# sourceMappingURL=chunk-0b5b80a6.4790e86c.js.map